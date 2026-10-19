from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Favorite,Review
from .serializers import FavoriteSerializer,ReviewSerializer
from properties.models import Property
from leaseManagement.models import Lease

from notification.models import Notification
from visit.models import VisitRequest
# Create your views here.

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(renter=self.request.user).order_by("-created_at")
    
    def create(self,request, *args, **kwargs):

        if request.user.role != "Renter":
            return Response({"error":"Only renters can save properties."})
        
        property_id = request.data.get("property")

        if not property_id:
            return Response({"error":"property id is required."})
        
        try:
            property = Property.objects.get(id=property_id,status="Available",is_active=True)
        except Property.DoesNotExist:
            return Response({"error":"Property not found."})
        
        if Favorite.objects.filter(renter=request.user,property=property).exists():
           return  Response({"error":"Property already in favorites."})
        
        favorite = Favorite.objects.create(renter=request.user,property=property)
        serializer = self.get_serializer(favorite,context={"request":request})
        return Response ({"message":"Property added to favorites succuessfully.","favorite":serializer.data})

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class= ReviewSerializer
    
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            return[AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        property_id = self.request.query_params.get("property")
        if property_id:
            return Review.objects.filter(property_id=property_id).select_related("renter","property").order_by("-created_at")
        if self.action == "list":
            return (Review.objects.select_related("renter","property","property__owner").order_by("-created_at"))
        if self.request.user.is_authenticated:
            return Review.objects.filter(renter=self.request.user).select_related("renter","property").order_by("-created_at")
        return Review.objects.none()
    
    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"error":"You must be logged in to write a review."})
        
        if request.user.role != "Renter":
            return Response({"error":"Only renters can add reviews."})
        
        property_id = request.data.get("property")
        rating = request.data.get("rating")
        comment = request.data.get("comment","").strip()

        if not property_id:
            return Response({"error":"Property ID is required"})
        
        if not rating:
            return Response({"error":"Rating is required"})
        
        try:
            property = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'error':"Property not found."})
        
        rented = Lease.objects.filter(tenant=request.user,property=property,status__in=["Active","Completed","Terminated"]).exists()
        
        completed_visit = VisitRequest.objects.filter(renter=request.user,property=property,status="Completed").exists()

        if not rented and not completed_visit:
            return Response({"error":"You can review a property after completing a visit or renting the property."})

        already_reviewed = Review.objects.filter(renter=request.user,property=property).exists()

        if already_reviewed:
            return Response({"error":"You have already reviewed this property."})

        if rented:
            review_type = "Rented Review"
        else:
            review_type = "Visited Review"
        
        review = Review.objects.create(renter=request.user,property=property,rating=rating,comment=comment,review_type=review_type)

        Notification.objects.create(user=property.owner,title="New Review",
                                    message =f"{request.user.full_name or request.user.username} gave your property '{property.title}' {rating} star(s).",
                                    notification_type="Review")
        
        serializer = ReviewSerializer(review,context={"request":request})
        return Response({"message":"Review added successfully","review":serializer.data})
    
    def destroy(self, request,*args,**kwargs):
        review = self.get_object()
        if review.renter!= request.user:
            return Response({"error":"Permission denied"},status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response({"message":"Review deleted successfully."})
    
    def update(self,request,*args,**kwargs):
        review = self.get_object()
        if review.renter!= request.user:
            return Response({"error":"Permission denied"},status=status.HTTP_403_FORBIDDEN)

        data = {"rating":request.data.get("rating",review.rating),"comment":request.data.get("comment",review.comment)}
        
        serializer = self.get_serializer(review,data=data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message":"Review updated successfully","review":serializer.data})

    @action(detail=False,methods=["get"],permission_classes=[IsAuthenticated])
    def mine(self,request):
        reviews=(Review.objects.filter(renter=request.user).select_related("renter","property","property__owner").order_by("-created_at"))
        serializer = self.get_serializer(reviews,many=True,context={"request":request})
        return Response(serializer.data)