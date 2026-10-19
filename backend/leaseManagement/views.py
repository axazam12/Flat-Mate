from datetime import date
from django.utils import timezone

from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from notification.models import Notification
from payment.models import RentPayment
from rentalapplication.models import RentalApplication
from properties.models import Property
from accounts.models import User
from django.db.models import Exists, OuterRef

from .models import Lease, LeaseExtensionRequest
from .serializers import LeaseSerializer, LeaseExtensionRequestSerializer

# Create your views here.
class LeaseViewSet(viewsets.ModelViewSet):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    permission_classes =[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = (Lease.objects.select_related("owner","tenant","property","application","visit_request")).prefetch_related("property__images").order_by("-created_at")
        if user.role == "Owner":
            return queryset.filter(owner=user)
        return queryset.filter(tenant=user)
        
    @action(detail=False,methods=["get"])
    def current(self,request):
        lease = Lease.objects.filter(tenant=request.user,status__in=["Pending Acceptance","Active"]).select_related("property","owner","tenant").first()

        if not lease:
            return Response({"has_current_lease":False,"lease":None})
        
        serializer = self.get_serializer(lease,context={"request":request})

        return Response({"has_current_lease": True,"lease": serializer.data})

    @action(detail=True, methods=["post"])
    def accept(self, request, pk= None):
        lease = self.get_object()

        if lease.tenant != request.user:
            return Response({"error":"Permission denied."})
        if lease.status != "Pending Acceptance":
            return Response({"error":"Lease already processed."})

        if lease.property.status != "Available":
            return Response({"error":"This property is no longer available. The lease cannot be accepted."})

        lease.status = "Active"
        lease.accepted_at = timezone.now()
        lease.save(update_fields=["status","accepted_at"])

        lease.property.status = "Occupied"
        lease.property.save(update_fields=["status"])

        if not RentPayment.objects.filter(lease=lease,month=lease.lease_start.month,year=lease.lease_start.year).exists():
            RentPayment.objects.get_or_create(
                lease=lease,
                tenant=lease.tenant,
                month=lease.lease_start.month,
                year=lease.lease_start.year,
                defaults ={
                    "amount": lease.monthly_rent,
                    "due_date" : lease.lease_start,
                    "status" : "Pending"
                }
                
            )
        if lease.lease_type == "Application" and lease.application:
            lease.application.status = "Completed"
            lease.application.save(update_fields=["status"])

        Notification.objects.create(
            user=lease.owner,
            title="Lease Accepted",
            message = f"{lease.tenant.full_name} accepted the lease.",
            notification_type="Lease"
        )

        serializer = self.get_serializer(lease,context={"request":request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def decline(self, request, pk= None):
        lease = self.get_object()
        if lease.tenant != request.user:
            return Response({"error":"Permission denied."})
        if lease.status != "Pending Acceptance":
            return Response({"error":"Lease already processed."})

        reason = request.data.get("reason","")
        lease.status = "Declined"
        lease.decline_reason = reason
        lease.save(update_fields=["status","decline_reason"])

        if lease.lease_type == "Application" and lease.application:
            lease.application.status = "Rejected"
            lease.application.rejection_reason=reason
            lease.application.save(update_fields=["status","rejection_reason"])
    
        Notification.objects.create(
            user=lease.owner,
            title="Lease Declined",
            message = f"{lease.tenant.full_name} declined the lease.\nReason : {reason}",
            notification_type="Lease"
        )
        return Response({"message":"Lease declined successfully."})

    @action(detail=False, methods=["get"])
    def history(self, request):
        leases = self.get_queryset().filter(
            status__in=["Completed", "Terminated"]
        ).order_by("-lease_end", "-created_at")

        serializer = self.get_serializer(
        leases,
        many=True,
        context={"request": request}
        )
 
        return Response(serializer.data)

    @action(detail=False,methods=["post"])
    def create_lease(self,request):
        if request.user.role != "Owner":
            return Response({"error":"Permission denied."})
        
        application_id = request.data.get("application")
        lease_start = request.data.get("lease_start")
        lease_end = request.data.get("lease_end")
        
        if not lease_start:
            return Response({"error":"Lease start date is required."})
        if not lease_end:
            return Response({"error":"Lease end date is required."})
        
        try:
            application = RentalApplication.objects.get(id=application_id,property__owner=request.user,status="Approved")
        except RentalApplication.DoesNotExist:
            return Response({"error":"Approved rental application not found."})
    
        if Lease.objects.filter(application=application).exists():
            return Response({"error":"A lease has already been created for this application."},status=400)
                
        property = application.property
        
        if Lease.objects.filter(property=property,status__in=["Pending Acceptance","Active"]).exists():
            return Response({"error":"Lease already exists for this property."})
                
        if Lease.objects.filter(tenant=application.renter,status="Active").exists():
            return Response({"error":"Tenant already has an active lease."})
        
        
        lease = Lease.objects.create(
            owner=request.user,
            tenant = application.renter,
            property=property,
            application=application,
            visit_request = application.visit_request,
            lease_start = lease_start,
            lease_end = lease_end,
            monthly_rent = application.property.monthly_rent,
            security_deposit = application.property.security_deposit,
            status = "Pending Acceptance"
        )
        Notification.objects.create(
            user=request.user,
            title="Lease Created",
            message = f"Lease created for {application.renter.full_name}. Waiting for tenant acceptance.",
            notification_type = "Lease"
        )
        
        Notification.objects.create(
            user=application.renter,
            title="Lease Ready",
            message = f"A lease agreement for {property.title} is ready. Please review and accept it.",
            notification_type = "Lease"
        )
        
        serializer = self.get_serializer(lease,context={"request":request})
        return Response(serializer.data)

    @action(detail=False,methods=["post"])
    def create_direct(self,request):
        if request.user.role != "Owner":
            return Response({"error":"Permission denied."})
        tenant_email = request.data.get("tenant_email")
        property_id = request.data.get("property_id")
        lease_start = request.data.get("lease_start")
        lease_end = request.data.get("lease_end")
        
        if not all([tenant_email,property_id,lease_start,lease_end]):
            return Response({"error":"All fields are required."})
    
        try:
            tenant = User.objects.get(email=tenant_email,role="Renter")
        except User.DoesNotExist:
            return Response({"error":"Tenant not found."})

        try:
            property=Property.objects.get(id=property_id,owner=request.user,status="Available")
        except Property.DoesNotExist:
            return Response({"error":"Property not found."})

        try:
            lease_start_date = date.fromisoformat(str(lease_start))
            lease_end_date = date.fromisoformat(str(lease_end))
        except ValueError:
            return Response({"error":"Invalid lease dates."})

        if lease_start_date >= lease_end_date:
            return Response({"error":"Lease end date must be after lease start date."})
        
        if Lease.objects.filter(property=property,status__in=["Pending Acceptance","Active"]).exists():
            return Response({"error":"Lease already exists for this property."})
                
        if Lease.objects.filter(tenant=tenant,status__in=["Active","Pending Acceptance"]).exists():
            return Response({"error":"Tenant already has an active or pending lease."})
        
        lease = Lease.objects.create(
            owner=request.user,
            tenant = tenant,
            property=property,
            lease_type = "Direct",
            lease_start = lease_start_date,
            lease_end = lease_end_date,
            monthly_rent = property.monthly_rent,
            security_deposit = property.security_deposit,
            status = "Pending Acceptance"
        )
        
        Notification.objects.create(
            user=tenant,
            title="Direct Lease Agreement",
            message = f"{request.user.full_name} has created a direct lease agreement for {property.title}. Please review the lease details and accept or decline it.",
            notification_type = "Lease"
        )
        
        serializer = self.get_serializer(lease,context={"request":request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def available_renters(self, request):
        if request.user.role != "Owner":
            return Response({"error": "Permission denied."})

        active_or_pending_leases = Lease.objects.filter(tenant=OuterRef("pk"),status__in=["Active", "Pending Acceptance"])

        renters = (User.objects.filter(role="Renter").annotate(has_lease=Exists(active_or_pending_leases)).filter(has_lease=False).order_by("full_name"))

        data = [{
            "id": renter.id,
            "full_name": renter.full_name,
            "email": renter.email,
            }
            for renter in renters
       ]

        return Response(data)

    @action(detail=False,methods=["get"])
    def previous_tenants(self,request):
        if request.user.role !="Owner":
            return Response({"error":"Permissaion denied"})
        leases = (Lease.objects.filter(owner=request.user,status__in=["Completed","Terminated"]).select_related("tenant","property").order_by("-lease_end","-created_at"))
        data = []

        for lease in  leases:
            data.append({
                "id": lease.id,

                "property_id": lease.property.id,
                "property_title": lease.property.title,
                "property_city": lease.property.city,
                "property_state": lease.property.state,

                "tenant_id": lease.tenant.id,
                "tenant_name": lease.tenant.full_name,
                "tenant_email": lease.tenant.email,

                "lease_type": lease.lease_type,

                "lease_start": lease.lease_start,
                "lease_end": lease.lease_end,

                "monthly_rent": lease.monthly_rent,
                "security_deposit": lease.security_deposit,

                "status": lease.status,

                "termination_reason": (
                    lease.termination_reason
                    if lease.status == "Terminated"
                    else None
                ),

                "completed_at": lease.completed_at,
                "terminated_at": lease.terminated_at,
            })
        return Response(data)

    @action(detail=False, methods=["get"])
    def property_history(self,request):
        if request.user.role != "Owner":
            return Response({"error":"Permission denied."})

        property_id = request.query_params.get("property_id")
        if not property_id:
            return Response({"error":"Property ID is required."})
        try:
            property = Property.objects.get(id=property_id,owner=request.user)
        except Property.DoesNotExist:
            return Response({"error":"Property not found."})
        leases = (Lease.objects.filter(property=property,status__in=["Completed","Terminated"]).select_related("tenant").order_by("-lease_end"))
        previous_tenants = []
        for lease in leases:
            previous_tenants.append({
                "lease_id": lease.id,

                "tenant_id": lease.tenant.id,
                "tenant_name": lease.tenant.full_name,
                "tenant_email": lease.tenant.email,

                "lease_type": lease.lease_type,

                "lease_start": lease.lease_start,
                "lease_end": lease.lease_end,

                "monthly_rent": lease.monthly_rent,

                "status": lease.status,

                "termination_reason": (
                    lease.termination_reason
                    if lease.status == "Terminated"
                    else None
                )
            })
        return Response({"property":{
            "id":property.id,
            "title":property.title,
            "city":property.city,
            "stats":property.state,
        },"previous_tenants":previous_tenants})

    
    @action(detail=True,methods=["post"])
    def complete(self, request,pk=None):
        lease = self.get_object()

        if lease.owner != request.user:
            return Response({"error":"Permission denied."})
        
        if lease.status!="Active":
            return Response({"error":"Only active leases can be completed."})
        lease.completed_at = timezone.now()
        
        lease.status = "Completed"
        lease.lease_end = date.today()
        lease.save(update_fields = ["status","lease_end","completed_at"])

        property=lease.property
        property.status = "Available"
        property.save(update_fields=["status"])
        
        Notification.objects.create(
            user=lease.tenant,
            title="Lease Completed",
            message=f"Your lease for {property.title} has been completed.",
            notification_type ="Lease"
        )

        return Response({"message":"Lease completed successfully."})
    
    @action(detail=True,methods=["post"])
    def terminate(self, request,pk=None):
        lease = self.get_object()

        if lease.owner != request.user:
            return Response({"error":"Permission denied."})
        
        if lease.status!="Active":
            return Response({"error":"Only active leases can be terminated."})

        if lease.lease_end and date.today() < lease.lease_end:
            reason = request.data.get("reason")
            if not reason:
                return Response({"error":"Termination reason is required."})
            
            lease.termination_reason =reason

        lease.status = "Terminated"
        lease.lease_end = date.today()
        lease.terminated_at = timezone.now()
        lease.save(update_fields=["status","lease_end","termination_reason","terminated_at"])

        property=lease.property
        property.status = "Available"
        property.save(update_fields=["status"])
        
        Notification.objects.create(
            user=lease.tenant,
            title="Lease terminated",
            message=f"Your lease for {property.title} has been terminated by the owner.",
            notification_type ="Lease"
        )

        RentPayment.objects.filter(lease=lease,status__in=["Pending","Late"]).update(status="Cancelled")

        return Response({"message":"Lease terminated successfully."})


class LeaseExtensionRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaseExtensionRequest.objects.all()
    serializer_class = LeaseExtensionRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = LeaseExtensionRequest.objects.select_related("owner","tenant","lease","lease__property").order_by("-created_at")
        if user.role == "Owner":
            return queryset.filter(owner=user)
        return queryset.filter(tenant=user)
    
    @action(detail=False, methods=["post"])
    def request_extension(self, request):

        lease_id = request.data.get("lease")
        try:
            lease=Lease.objects.get(id=lease_id,tenant=request.user.id,status="Active")
        except Lease.DoesNotExist:
            return  Response({"error":"Active lease not found."})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        requested_end_date = serializer.validated_data["requested_end_date"]

        if requested_end_date <= lease.lease_end:
            return Response({"error":"Requested end date musst be after the current lease end date."})

        if LeaseExtensionRequest.objects.filter(
            lease=lease,
            status="Pending"
        ).exists():
            return Response(
                {"error": "A pending extension request already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save(
            tenant=request.user,
            owner=lease.owner,
            lease=lease,
            current_end_date=lease.lease_end,
        )

        Notification.objects.create(
            user=lease.owner,
            title="Lease Extension Request",
            message=f"{request.user.full_name or request.user.username} requested a lease extension.",
            notification_type="Lease",
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True,methods=["delete"])
    def cancel_request(self,request,pk=None):
        extension = self.get_object()
        if extension.tenant != request.user:
            return Response({"error":"Permission denied."})
        if extension.status != "Pending":
            return Response({"error":"Only pending requests can be cancelled."})
        
        extension.delete()

        return Response({"message":"Lease extension request cancelled successfully."})
    
    @action(detail=False,methods=["get"])
    def active(self,request):
        extension = LeaseExtensionRequest.objects.filter(tenant=request.user).exclude(status="Pending")

        serializer = self.get_serializer(extension,many=True)
        return Response(serializer.data)
    
    @action(detail=True,methods=["post"])
    def approve(self,request,pk=None):
        extension = self.get_object()

        if extension.status != "Pending":
            return Response({"error":"Request already processed"})
        
        lease = extension.lease
        lease.lease_end = extension.requested_end_date
        lease.save(update_fields=["lease_end"])

        extension.owner_response = request.data.get("owner_response","")
        extension.status = "Approved"
        extension.save()

        Notification.objects.create(
            user=lease.tenant,
            title="Lease Extension Approved",
            message=f"Your lease extension request for {lease.property.title} has been approved.",
            notification_type="Lease Extension"
        )
        serializer = self.get_serializer(extension,context={"request":request})
        return Response(serializer.data)
    
    @action(detail=True,methods=["post"])
    def reject(self,request,pk=None):
        extension = self.get_object()

        if extension.status != "Pending":
            return Response({"error":"Request already processed"})

        extension.owner_response = request.data.get("owner_response","")
        extension.status = "Rejected"
        extension.save()

        Notification.objects.create(
            user=extension.lease.tenant,
            title="Lease Extension Rejected",
            message=f"Your lease extension request for {extension.lease.property.title} has been rejected.",
            notification_type="Lease Extension"
        )
        serializer = self.get_serializer(extension,context={"request":request})
        return Response(serializer.data)

