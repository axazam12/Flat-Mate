from rest_framework import serializers
from .models import Favorite,Review
from properties.serializers import PropertySerializer
from leaseManagement.models import Lease

class FavoriteSerializer(serializers.ModelSerializer):
    property_details = PropertySerializer(source="property",read_only=True)
    class Meta:
        model = Favorite
        fields = ["id","renter","property","property_details","created_at"]
        read_only_fields = ["renter","created_at"]

class ReviewSerializer(serializers.ModelSerializer):
    renter_profile_picture = serializers.SerializerMethodField()
    renter_name = serializers.CharField(source="renter.full_name",read_only=True)
    property_details = serializers.SerializerMethodField()
    class Meta:
        model = Review
        fields = ["id","renter","renter_name","property","renter_profile_picture","property_details","rating","comment","created_at","updated_at","review_type"]
        read_only_fields=["renter","created_at","updated_at"]

    def get_renter_profile_picture(self, obj):
        request = self.context.get("request")
        if obj.renter.profile_picture:
            if request:
                return request.build_absolute_uri(obj.renter.profile_picture.url)
            return obj.renter.profile_picture.url
        return None
    
    def get_property_details(self, obj):
        request = self.context.get("request")

        cover_image = obj.property.images.filter(is_cover=True).first()

        return {
            "id": obj.property.id,
            "title": obj.property.title,
            "city": obj.property.city,
            "state": obj.property.state,
            "status":obj.property.status,
            "property_type":obj.property.property_type,
            "monthly_rent":obj.property.monthly_rent,
            "cover_image": (
                request.build_absolute_uri(cover_image.image.url)
                if cover_image and cover_image.image
                else None
            ),
        }
