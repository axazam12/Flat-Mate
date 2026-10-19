from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.utils import timezone

from .models import MaintenanceRequest
from .serializers import MaintenanceRequestSerializer

from leaseManagement.models import Lease
from notification.models import Notification

# Create your views here.    
class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all()
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = MaintenanceRequest.objects.select_related("tenant","owner","lease","property").order_by("-created_at")

        if user.role == "Owner":
            return queryset.filter(owner=user)
        return queryset.filter(tenant=user)
    
    @action(detail=False,methods=["post"])
    def create_request(self,request):
        if request.user.role !="Renter":
            return Response({"error":"Only tenants can create maintenance requests."})
        
        lease = Lease.objects.filter(tenant=request.user,status="Active").first()
        if not lease:
            return Response({"error":"No active lease found."})

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save(tenant=request.user,owner=lease.owner,lease=lease,property=lease.property)

        Notification.objects.create(
            user=lease.owner,
            title  = "New Maintenance Request",
            message = f"{request.user.full_name or request.user.username} submitted a maintenance request for {lease.property.title}.",
            notification_type = "Maintenance",
            )
        return Response(serializer.data)
    

    def destroy(self, request, *args,**kwargs ):
        maintenance = self.get_object()

        if maintenance.tenant != request.user:
            return Response({"error":"Permission denied."})
        
        if maintenance.status != "Open":
            return Response({"error":"Only open requests can be deleted"})

        maintenance.status = "Cancelled"
        maintenance.save()

        return Response({"message": "Maintenance request cancelled successfully."})

    def update(self,request,*args, **kwargs):
        maintenance=self.get_object()
        if maintenance.tenant != request.user:
            return Response({"error":"Permission denied."})
        if maintenance.status != "Open":
            return Response({"error":"Only open requests can be edited."})
        return super().update(request,*args,**kwargs)
    
    @action(detail=False,methods=["get"])
    def active(self,request):
        requests = self.get_queryset().filter(status__in=["Open","In Progress"])

        serializer = self.get_serializer(requests,many=True)
        return Response(serializer.data)
    
    @action(detail=True,methods=["post"])
    def update_status(self,request,pk=None):
        if request.user.role != "Owner":
            return Response({"error":"Permission denied."})
        
        maintenance = self.get_object()
        new_status = request.data.get("status")
        allowed = [
            "Open","In Progress","Resolved","Cancelled"
        ]

        if new_status not in allowed:
            return Response({"error":"Invalid status"})
        
        maintenance.status=new_status
        if new_status =="Resolved":
            maintenance.resolved_at = timezone.now()
        maintenance.save()

        Notification.objects.create(
            user=maintenance.tenant,
            title="Maintenance Updated",
            message=f"Your maintenance request '{maintenance.title}' is now {new_status}.",
            notification_type="Maintenance"
        )
        return Response(self.get_serializer(maintenance,context={"request":request}).data)
    
    @action(detail=True,methods=["post"])
    def respond(self,request,pk=None):
        if request.user.role != "Owner":
            return Response({"error":"Permission denied."})
        maintenance = self.get_object()
        maintenance.owner_response = request.data.get("owner_response","")
        maintenance.save()

        Notification.objects.create(
            user=maintenance.tenant,
            title="Owner Response",
            message=f"The owner responded to your maintenance request '{maintenance.title}'.",
            notification_type="Maintenance"
        )
        return Response(self.get_serializer(maintenance,context={"request":request}).data)

    @action(detail=False,methods=["get"])
    def history(self,request):
        requests = self.get_queryset().filter(status__in=["Resolved","Cancelled"])
        serializer = self.get_serializer(requests,many=True)
        return Response(serializer.data)
    