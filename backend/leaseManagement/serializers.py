from rest_framework import serializers
from .models import Lease,LeaseExtensionRequest

class LeaseSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.full_name",read_only=True)
    tenant_email = serializers.CharField(source="tenant.email",read_only=True)
    tenant_phone = serializers.CharField(source="tenant.phone",read_only=True)
    profile_picture = serializers.ImageField(source="tenant.profile_picture",read_only=True)
    tenant_occupation = serializers.CharField(source="tenant.renter_profile.occupation",read_only=True)
    perferred_location = serializers.CharField(source="tenant.renter_profile.preferred_location",read_only=True)
    budget = serializers.DecimalField(source="tenant.renter_profile.budget",max_digits=10,decimal_places=2,read_only=True)

    owner_name = serializers.CharField(source="owner.full_name",read_only=True)
    owner_email = serializers.CharField(source="owner.email",read_only=True)

    property_title = serializers.CharField(source="property.title",read_only=True)
    property_address = serializers.CharField(source="property.address",read_only=True)
    property_city = serializers.CharField(source="property.city",read_only=True)
    property_state = serializers.CharField(source="property.state",read_only=True)
    property_image = serializers.SerializerMethodField()

    property_type = serializers.CharField(source="property.property_type",read_only=True)

    class Meta:
        model = Lease
        fields = "__all__"
        read_only_fields = ("owner","tenant","property","application","visit_request","lease_type",
                            "monthly_rent","status","terminated_at","accepted_at","completed_at","security_deposit",
                            "created_at","updated_at")

    def get_property_image(self,obj):
        image = obj.property.images.filter(is_cover=True).first()
        if not image:
            image = obj.property.images.first()
        if not image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url

class LeaseExtensionRequestSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.full_name",read_only=True)
    tenant_email = serializers.CharField(source="tenant.email",read_only=True)
    
    property_title = serializers.CharField(source="lease.property.title",read_only=True)
    property_city = serializers.CharField(source="lease.property.city",read_only=True)
    property_state = serializers.CharField(source="lease.property.state",read_only=True)
    property_image = serializers.SerializerMethodField()
    class Meta:
        model = LeaseExtensionRequest
        fields = "__all__"
        read_only_fields = ["tenant","owner","lease","current_end_date","status","created_at","updated_at"]

    def get_property_image(self,obj):
            if not obj.lease or not obj.lease.property:
                return None
            property_obj = obj.lease.property

            image = property_obj.images.filter(is_cover=True).first()
            if not image:
                image = property_obj.images.first()
            if not image:
                return None
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url