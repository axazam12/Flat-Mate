from rest_framework import serializers
from .models import VisitRequest
from properties.serializers import PropertySerializer

class VisitRequestSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source="property",read_only=True)
    owner_name = serializers.CharField(source="owner.full_name",read_only=True)
    renter_name = serializers.CharField(source="renter.full_name",read_only=True)
    renter_email = serializers.CharField(source="renter.email",read_only=True)
    class Meta:
        model = VisitRequest
        fields = ["id","renter","renter_name","renter_email","owner_name","owner","property","property_details","visit_date","visit_time",
                  "proposed_visit_date","proposed_visit_time","message","status","rejection_reason","cancellation_reason",
                  "reschedule_reason","created_at","updated_at","requested_by"]
        read_only_fields =["renter","owner","status","created_at","updated_at"]