from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from notification.models import Notification

from datetime import datetime

from .models import VisitRequest
from .serializers import VisitRequestSerializer
from properties.models import Property
# Create your views here.

class VisitRequestViewSet(viewsets.ModelViewSet):
    serializer_class= VisitRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = VisitRequest.objects.select_related("property","owner","renter").order_by("-created_at")
        if user.role == "Owner":
            return queryset.filter(owner=user)
        return queryset.filter(renter=user)
    
    def create(self, request, *args, **kwargs):
        if request.user.role != "Renter":
            return Response({"error":"Only renters can request visits."})
        
        property_id = request.data.get("property")
        visit_date = request.data.get("visit_date")
        visit_time = request.data.get("visit_time")
        message = request.data.get("message","")

        if not property_id:
            return Response({"error":"Property ID is required"})
        
        if not visit_date:
            return Response({"error":"Visits date is required"})
        
        if not visit_time:
            return Response({"error":"Visits time is required"})
        
        try:
            prop = Property.objects.get(id=property_id,status="Available",is_active=True)
        except Property.DoesNotExist:
            return Response({"error":"This property is currently unavailable for visits."})
        
        if VisitRequest.objects.filter(renter=request.user,property=prop,status__in=["Pending","Approved","Reschedule Requested"]).exists():
            return Response({"error":"You already have a pending visit request for this property."})
        
        visit_request = VisitRequest.objects.create(renter=request.user,owner=prop.owner,property=prop,visit_date=visit_date,visit_time=visit_time,message=message)

        Notification.objects.create(user=prop.owner,title="New Visit Request",
                                    message =f"{request.user.full_name or request.user.username} requested a visit for '{prop.title}'.",
                                    notification_type="Visit")
        
        serializer = self.get_serializer(visit_request,context={"request":request})
        return Response({"message":"Visits request submitted successfully","visit_request":serializer.data})

    @action(detail=True,methods=["patch"])
    def cancel(self,request,pk=None):
        visit = self.get_object()
        if visit.renter != request.user:
            return Response({"error":"Permission denied"})
        if visit.status != "Pending":
            return Response({"error":"Only pending visit requests can be cancelled."})
        reason = request.data.get("reason","")
        visit.status = "Cancelled"
        visit.cancellation_reason = reason
        visit.save(update_fields=["status","cancellation_reason"])

        Notification.objects.create(
            user=visit.owner,
            title="Visit Cancelled",
            message=f"{request.user.full_name} cancelled the visit request.",
            notification_type="Visit"
        )
        return Response({"message":"Visit request cancelled successfully."})

    @action(detail=True,methods=["patch"])
    def approve(self, request, pk=None):
        visit = self.get_object()
        if visit.owner != request.user:
            return Response({"error":"Permission DEnied."})
    
        if visit.status != "Pending":
            return Response({"error":"Visit Request has already been processed."})
        if visit.property.status != "Available" or not visit.property.is_active:
            return Response({"error":"This property is no longer available"})
    
        visit.status = "Approved"
        visit.save(update_fields=["status"])
    
        Notification.objects.create(
                user=visit.renter,
                title="Visit Approved",
                message=f"Your visit request for {visit.property.title} has been approved.",
                notification_type ="Visit"
        )
        return Response({"message":"Visit approved successfully."})
    
    @action(detail=True,methods=["patch"])
    def reject(self,request,pk=None):
        visit = self.get_object()
        if visit.owner != request.user:
            return Response({"error":"Permission Denied."})
    
        if visit.status != "Pending":
            return Response({"error":"Application already processed."})
    
        reason = request.data.get("reason")
        if not reason:
            return Response({"error":"Rejection reason is required"})
    
        visit.status= "Rejected"
        visit.rejection_reason = reason
        visit.save(update_fields=["status","rejection_reason"])
    
        Notification.objects.create(
                user=visit.renter,
                title="Visit rejected",
                message=f"Your visit request for {visit.property.title} has been rejected.",
                notification_type ="Visit"
        )
        return Response({"message":"Visit rejected successfully."})

    @action(detail=True,methods=["patch"])
    def complete(self, request, pk=None):
        visit = self.get_object()
        if request.user !=visit.owner :
            return Response({"error":"Permission DEnied."})
    
        if visit.status != "Approved":
            return Response({"error":"Only approved visits can be completed."})
    
        visit.status = "Completed"
        visit.save(update_fields=["status"])
    
        Notification.objects.create(
            user=visit.renter,
            title="Visit Completed",
            message=f"Your visit request for '{visit.property.title}' has been marked as completed. You may now submit a rental application.",
            notification_type ="Visit"
        )
        return Response({"message":"Visit makeed as completed."})

    @action(detail=True,methods=["patch"])
    def request_reschedule(self,request,pk=None):
        visit = self.get_object()
        if request.user not in [visit.owner, visit.renter]:
            return Response({"error":"Permission Denied."})

        if visit.status == "Reschedule Requested":
            return Response({"error":"A reschedule request is already pending."})
        
                
        if visit.status not in ["Pending","Approved"]:
            return Response({"error":"Only pending requests can be rescheduled."})

        new_date = datetime.strptime(request.data.get("visit_date"), "%Y-%m-%d").date()
        new_time = datetime.strptime(request.data.get("visit_time"), "%H:%M").time()
        reason = request.data.get("reason")

        if not new_date or not new_time or not reason:
            return Response({"error":"visit_date, visit_time and reason are requried."})

        if visit.visit_date == new_date and visit.visit_time == new_time:
            return Response({"error":"Plase choose a different date or time."})

        visit.previous_status = visit.status

        visit.proposed_visit_date = new_date
        visit.proposed_visit_time = new_time
        visit.reschedule_reason = reason
        visit.status = "Reschedule Requested"

        if request.user == visit.owner:
            visit.requested_by = "Owner"
            notify_user = visit.renter
        else:
            visit.requested_by = "Renter"
            notify_user = visit.owner

        visit.save(update_fields=["previous_status","proposed_visit_date","proposed_visit_time","reschedule_reason","requested_by","status"])
        
        Notification.objects.create(
            user=notify_user,
            title="Visit Reschedule Requested",
            message=f"A new schedule for visit request for {visit.property.title} has been proposed.\n Reason: {reason}",
            notification_type ="Visit"
        )
        return Response({"message":"Reschedule request sent successfully."})

    @action(detail=True,methods=["patch"])
    def accept_reschedule(self,request,pk=None):
        visit = self.get_object()
        if request.user not in [visit.owner, visit.renter]:
            return Response({"error":"Permission Denied."})

        if  visit.status != "Reschedule Requested":
            return Response({"error":"No reschedule request found."})
                    
        if request.user.role == visit.requested_by:
            return Response({"error":"You cannot accept your own reschedule request."})
    
        visit.visit_date = visit.proposed_visit_date
        visit.visit_time = visit.proposed_visit_time   
            
        visit.proposed_visit_date = None
        visit.proposed_visit_time = None
        visit.reschedule_reason = ""
        visit.requested_by = ""
        visit.previous_status = ""
        visit.status = "Approved"
    
        visit.save(update_fields=["visit_date","visit_time","proposed_visit_date","proposed_visit_time","reschedule_reason","requested_by","previous_status","status"])
        notify_user = visit.owner if request.user == visit.renter else visit.renter
            
        Notification.objects.create(
            user=notify_user,
            title="Reschedule Accepted",
            message=f"A new visit schedule for '{visit.property.title}' has been accepted.",
            notification_type ="Visit"
        )
        return Response({"message":"Visit rescheduled successfully."})

    @action(detail=True,methods=["patch"])
    def decline_reschedule(self,request,pk=None):
        visit = self.get_object()
        if request.user not in [visit.owner, visit.renter]:
            return Response({"error":"Permission Denied."})
        
        if  visit.status != "Reschedule Requested":
                    return Response({"error":"No reschedule request found."})
                            
        if request.user.role == visit.requested_by:
            return Response({"error":"You cannot decline your own request."})

        previous_status = visit.previous_status or "Pending"

        visit.proposed_visit_date = None
        visit.proposed_visit_time = None
        visit.reschedule_reason = ""
        visit.requested_by = ""
        visit.previous_status =""
        visit.status = previous_status
            
        visit.save(update_fields=["proposed_visit_date","proposed_visit_time","reschedule_reason","requested_by","previous_status","status"])
        notify_user = visit.owner if request.user == visit.renter else visit.renter
                    
        Notification.objects.create(
            user=notify_user,
            title="Reschedule Declined",
            message=f"A proposed visit schedule for '{visit.property.title}' was declined.",
            notification_type ="Visit"
        )
        return Response({"message":"Reschedule request declined."})
    
    