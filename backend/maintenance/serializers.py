from rest_framework import serializers
from .models import MaintenanceRequest

class MaintenanceRequestSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.full_name",read_only=True)
    tenant_email = serializers.EmailField(source="tenant.email",read_only=True)
    owner_name = serializers.CharField(source="owner.full_name",read_only=True)
    owner_email=serializers.EmailField(source="owner.email",read_only=True)

    property_title = serializers.CharField(source="property.title",read_only=True)
    property_city = serializers.CharField(source="property.city",read_only=True)
    property_state = serializers.CharField(source="property.state",read_only=True)
    
    class Meta:
        model = MaintenanceRequest
        fields = "__all__"
        read_only_fields = ["tenant","owner","lease","property","resolved_at","created_at","updated_at"]
