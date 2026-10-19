from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import  viewsets
from rest_framework.permissions import IsAuthenticated

from visit.models import VisitRequest
from leaseManagement.models import Lease
from .models import RentalApplication
from .serializers import RentalApplicationSerializer
from notification.models import Notification

# Create your views here.
class RentalApplicationViewSet(viewsets.ModelViewSet):
    queryset = RentalApplication.objects.all()
    serializer_class = RentalApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = RentalApplication.objects.select_related("property","owner","renter","visit_request").order_by("-created_at")

        if user.role =="Owner":
            return queryset.filter(owner=user)
        return queryset.filter(renter=user)
    
    @action(detail=True,methods=["patch"])
    def approve(self, request, pk=None):
        application = self.get_object()
        if application.owner != request.user:
            return Response({"error":"Permission DEnied."})
        
        if application.status != "Pending":
            return Response({"error":"Application already processed."})

        prop = application.property
        renter = application.renter

        if prop.status != "Available":
            return Response({"error":"Property is no longer available."})
        
        if Lease.objects.filter(tenant=renter,status="Active").exists():
            return Response({"error":"Tenant already has an active lease."})
        

        application.status = "Approved"
        application.owner_message = request.data.get("owner_message","")
        application.save(update_fields=["status","owner_message"])

        Notification.objects.create(
            user=renter,
            title="Rental application approved",
            message=f"Your application for {prop.title} has been approved. The owner will prepare the lease agreement",
            notification_type ="Application"
        )

        other_application = RentalApplication.objects.filter(property=prop,status="Pending").exclude(id=application.id)

        for app in other_application:
            app.status = "Rejected"
            app.rejection_reason = "Another applicant was selected."
            app.save(update_fields = ["status","rejection_reason"])


            Notification.objects.create(
            user=app.renter,
            title="Rental application rejected",
            message=f"Your application for {prop.title} was not selected.",
            notification_type ="Application"
        )
            
        return Response({"message":"Application approved successfully."})
    
    @action(detail=True,methods=["patch"])
    def reject(self,request,pk=None):
        application = self.get_object()
        if application.owner != request.user:
            return Response({"error":"Permission Denied."})
        
        if application.status != "Pending":
            return Response({"error":"Application already processed."})

        reason = request.data.get("reason")
        if not reason:
            return Response({"error":"Rejection reason is required"})
        
        application.status= "Rejected"
        application.rejection_reason = reason
        application.owner_message = request.data.get("owner_message","")
        application.save(update_fields=["status","owner_message","rejection_reason"])

        Notification.objects.create(
            user=application.renter,
            title="Rental application rejected",
            message=f"Your application for {application.property.title} has been rejected.",
            notification_type ="Application"
        )

        return Response({"message":"Application rejected successfully."})

    
    @action(detail=False,methods=["post"])
    def apply(self,request):
        visit_request_id = request.data.get("visit_request")
        message = request.data.get("message","")
        
        try:
            visit = VisitRequest.objects.get(id=visit_request_id,renter=request.user,status="Completed")
        except VisitRequest.DoesNotExist:
            return Response({"error":"Completed visit request not found."})

        if visit.property.status != "Available" or not visit.property.is_active:
            return Response({"error":"This property is no longer accepting rental applications."})
        
        if RentalApplication.objects.filter(renter=request.user,property=visit.property,status__in=["Pending","Approved"]).exists():
            return Response({"error":"You already have a pending application."})

        application = RentalApplication.objects.create(renter=request.user,owner=visit.owner,property=visit.property,visit_request=visit,message=message,)

        Notification.objects.create(
            user=visit.owner,
            title="Rental Application",
            message = f"{request.user.full_name or request.user.username} applied for '{visit.property.title}'.",
            notification_type ="Application"
        )

        serializer = self.get_serializer(application,context={"request":request})
        return Response({"message":"Rental application submitted successfully.","application":serializer.data})
    
    @action(detail=True,methods=["patch"])
    def cancel(self,request,pk=None):
        application = self.get_object()
        if application.renter  != request.user:
            return Response({"error":"Permission denied."})
        if application.status != "Pending":
            return Response({"error":"Only pending applications can be cancelled."})

        reason = request.data.get("reason")
        if not reason:
            return Response({"error":"Cancellation reason is required,"})

        application.status="Cancelled"
        application.cancellation_reason=reason
        application.save(update_fields=["status","cancellation_reason"])

        Notification.objects.create(
            user=application.owner,
            title="Rental Application Cancelled",
            message = f"{request.user.full_name or request.user.username} cancelled the rental application. \nReason :{reason}",
            notification_type ="Application"
        )

        return Response({"message":"Rental application cancelled successfully."})
