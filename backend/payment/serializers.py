from rest_framework import serializers
from .models import RentPayment

class RentPaymentSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.full_name",read_only=True)
    tenant_email = serializers.CharField(source="tenant.email",read_only=True)

    owner_name = serializers.CharField(source="lease.owner.full_name",read_only=True)
    owner_email = serializers.CharField(source="lease.owner.email",read_only=True)

    property_title = serializers.CharField(source="lease.property.title",read_only=True)
    property_address = serializers.CharField(source="lease.property.address",read_only=True)
    property_state = serializers.CharField(source="lease.property.state",read_only=True)
    property_city = serializers.CharField(source="lease.property.city",read_only=True)

    lease_id = serializers.IntegerField(source="lease.id", read_only=True)

    property_image = serializers.SerializerMethodField()

    receipt = serializers.SerializerMethodField()
    verified_by_name = serializers.CharField(source="verified_by.full_name",read_only=True)
    lease_status = serializers.CharField(source="lease.status",read_only=True)

    class Meta:
        model = RentPayment
        fields = "__all__"
        read_only_fields = ("tenant","lease","amount","created_at","verified_by","verified_at")

    def get_property_image(self,obj):
        image = obj.lease.property.images.filter(is_cover=True).first()
        
        if not image:
            image = obj.lease.property.images.first()
        if not image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url

    def get_receipt(self, obj):
            if not obj.receipt:
                return None
    
            request = self.context.get("request")
    
            if request:
                return request.build_absolute_uri(obj.receipt.url)
    
            return obj.receipt.url