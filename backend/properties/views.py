from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated,BasePermission,SAFE_METHODS
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Q

from leaseManagement.models import Lease
from notification.models import Notification

from .models import  Property,PropertyImage,Amenity
from .serializers import PropertySerializer,PropertyDetailSerializer,PropertyImageSerializer,AmenitySerializer

# Create your views here.
#controls who is allowed to perform actions
class IsOwner(BasePermission):
    def has_permission(self,request,view):
        if request.method in SAFE_METHODS:
            return True
        
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == "Owner"
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        if hasattr(obj,"owner"):
            return obj.owner == request.user
        
        if hasattr(obj,"property"):
            return obj.property.owner == request.user
        
        return False
        
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsOwner]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    #search by title and city
    def get_queryset(self):
        queryset = Property.objects.filter(status="Available",is_active=True)
        
        if(
            self.request.user.is_authenticated
            and self.request.user.role == "Owner"
        ):
            queryset = Property.objects.filter(owner = self.request.user)
        else:
            queryset = Property.objects.filter(status="Available")

        search = self.request.query_params.get("search")
        property_type = self.request.query_params.get("property_type")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(city__icontains=search)
            )
        if property_type:
            queryset = queryset.filter(property_type=property_type)

        if(
            self.request.user.is_authenticated
            and self.request.user.role == "Owner"
            and self.action in ["update","partial_update","destroy"]
        ):
            queryset = queryset.filter(owner=self.request.user)

        #ordering
        ordering = self.request.query_params.get("ordering")
        if ordering == "rent_low":
            queryset = queryset.order_by("monthly_rent")
        elif ordering == "rent_high":
            queryset = queryset.order_by("-monthly_rent")
        elif ordering == "latest":
            queryset = queryset.order_by("-created_at")
        elif ordering == "oldest":
            queryset=queryset.order_by("created_at")
            
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertySerializer

    def perform_create(self,serializer):
        prop = serializer.save(owner=self.request.user)
        amenities = self.request.data.getlist("amenities")
        for amenity in amenities:
            Amenity.objects.create(property=prop,name=amenity)
        images = self.request.FILES.getlist("images")
        
        for index, image in enumerate(images):
            PropertyImage.objects.create(property=prop,image=image,is_cover=(index==0))
        return prop
    
    def perform_update(self,serializer):
        prop = self.get_object()

        if prop.status=="Occupied":
            raise ValidationError("This property has an active lease and cannot be edited.")
        prop = serializer.save()

        amenities = self.request.data.getlist("amenities")
        
        if amenities:
            prop.amenities.all().delete()
            for amenity in amenities:
                Amenity.objects.create(property=prop,name=amenity)
        
        images = self.request.FILES.getlist("images")
        if images:
            has_cover = prop.images.filter(is_cover=True).exists()
            for index, image in enumerate(images):
                PropertyImage.objects.create(property=prop,image=image,is_cover=(not has_cover and index==0))
        return prop

    @action(detail=False,methods=["get"],permission_classes=[IsOwner])
    def my_properties(self,request):
        
        properties = request.user.properties.all()
        serializer = self.get_serializer(properties,many=True)
        return Response(serializer.data)

    @action(detail=False,methods=["get"],permission_classes=[IsAuthenticated])
    def deactivated_properties(self, request):
        if request.user.role != "Owner":
            return Response([])
        properties = Property.objects.filter(owner=request.user,is_active=False)
        serializer = self.get_serializer(properties,many=True,context={"request":request})

        return Response(serializer.data)
            
    @action(detail=True,methods=["patch"],permission_classes=[IsAuthenticated])
    def deactivate(self, request, pk=None):
        prop = self.get_object()
        if prop.owner != request.user:
            return Response({"error":"Permission denied"},status=status.HTTP_403_FORBIDDEN)

        pending_lease = Lease.objects.filter(property=prop,status="Pending Acceptance").exists()
        if pending_lease:
            return Response({"error":"This property has a pending lease awaiting tenant acceptance. you cannot deactivate it."})

        if prop.status == "Occupied":
            return Response({"error":"An occupied property cannot be deactivated."})
        
        prop.status = "Deactivated"
        prop.is_active = False
        prop.save(update_fields = ["status","is_active"])

        return Response({"message":"Property has been deactivated successfully."})

    @action(detail=True,methods=["patch"],permission_classes=[IsAuthenticated])
    def activate(self, request, pk=None):
        prop = self.get_object()
        if prop.owner != request.user:
            return Response({"error":"Permission denied"},status=status.HTTP_403_FORBIDDEN)
    
        if prop.status == "Occupied":
            return Response({"error":"An occupied property cannot be reactivated."})
            
        prop.status = "Available"
        prop.is_active = True
        prop.save(update_fields = ["status","is_active"])
    
        return Response({"message":"Property activated successfully."})

    @action(detail=False,methods=["get"],permission_classes=[IsAuthenticated])
    def active_properties(self, request):
        if request.user.role != "Owner":
            return Response([])
        
        properties = Property.objects.filter(owner=request.user,is_active=True)
        serializer = self.get_serializer(properties,many=True,context={"request":request})
    
        return Response(serializer.data)

    def destroy(self,request,*args,**kwargs):
        prop = self.get_object()
        if prop.status == "Occupied":
            return Response({"error":"Occupied properties cannot be deleted."})
        if prop.lease.filter().exists():
            return Response({"error":"This property has lease history and cannot be permanently deleted. Deactivate it instead."})
        
        return super().destroy(request,*args,**kwargs)

    @action(detail=False,methods=["get"],permission_classes=[IsAuthenticated])
    def owner_properties_list(self,request):
        if request.user.role != "Owner":
            return Response([])
        properties = Property.objects.filter(owner=request.user,status="Available",is_active=True)
        serializer = self.get_serializer(properties,many=True,context={"request":request})
        return Response(serializer.data)
    
class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    permission_classes = [IsOwner]

    def destroy(self, request, *args, **kwargs):
        image = self.get_object()
        image.delete()

        return Response({"message":"Image deleted successfully."},status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == "Owner":
            if self.action in[
                "update","partial_update","destroy",
            ]:
                return PropertyImage.objects.filter(property__owner=self.request.user)
        return PropertyImage.objects.all()
   
    # to upload multiple images
    @action(detail=False, methods=["post"],permission_classes=[IsOwner])
    def upload_multiple(self,request):
        property_id = request.data.get("property_id")
        images = request.FILES.getlist("images")
        
        if not images:
            return Response({"error":"Please select at least one image,"},status=status.HTTP_400_BAD_REQUEST)
        if not property_id:
            return Response({"error":"Property ID is required"},status=status.HTTP_400_BAD_REQUEST)
        try :
            prop = Property.objects.get(id=property_id,owner=request.user)
        except Property.DoesNotExist:
            return Response({"error":"Property not found."},status=status.HTTP_404_NOT_FOUND)
        created_images = []
        first_image = not PropertyImage.objects.filter(property=prop).exists()
        for index, image in enumerate(images):
            obj = PropertyImage.objects.create(property=prop,image=image,is_cover=(first_image and index== 0))
            created_images.append(PropertyImageSerializer(obj).data)
        return Response({"message":"Images uploaded successfully.","images":created_images},status=status.HTTP_201_CREATED)
    
    @action(detail=True,methods=["patch"],permission_classes=[IsAuthenticated])
    def set_cover(self,request,pk=None):
        image = self.get_object()
        if image.property.owner!=request.user:
            return Response({"error":"perrssion denied"})
        PropertyImage.objects.filter(property=image.property).update(is_cover=False)
        image.is_cover  = True
        image.save(update_fields = ["is_cover"])
        return Response({"message":"Cover image updated successfully"},status=status.HTTP_200_OK)
        
class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [IsOwner]
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == "Owner":
            if self.action in[
                "update","partial_update","destroy",
            ]:
                return Amenity.objects.filter(property__owner=self.request.user)
        return Amenity.objects.all()