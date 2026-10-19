from rest_framework import serializers
from .models import RentalApplication

class RentalApplicationSerializer(serializers.ModelSerializer):
    renter_name = serializers.CharField(source="renter.full_name",read_only=True)
    renter_email = serializers.EmailField(source="renter.email",read_only=True)

    owner_name = serializers.CharField(source="owner.full_name",read_only=True)
    property_title = serializers.CharField(source="property.title",read_only=True)
    property_city = serializers.CharField(source="property.city",read_only=True)
    property_state = serializers.CharField(source="property.state",read_only=True)
    property_image = serializers.SerializerMethodField()
    monthly_rent = serializers.DecimalField(source="property.monthly_rent",max_digits=10,decimal_places=2,read_only=True)
    property_status = serializers.CharField(source="property.status",read_only=True)

    visit_time = serializers.TimeField(source="visit_request.visit_time",read_only=True)
    visit_date = serializers.DateField(source="visit_request.visit_date",read_only=True)
    class Meta:
        model = RentalApplication
        fields = ["id","renter","renter_name","renter_email","owner","owner_name","property","property_title","property_city","property_state"
                  ,"property_image","property_status","visit_time","visit_date","monthly_rent","visit_request","status","rejection_reason","cancellation_reason",
                  "owner_message","message","created_at","updated_at"]
        read_only_fields = ("renter","owner","property","visit_request","status","created_at","updated_at")

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