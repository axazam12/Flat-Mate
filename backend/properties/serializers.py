from rest_framework import serializers
from .models import Property,PropertyImage,Amenity

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = "__all__"

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = "__all__"

class PropertyImageMangeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model  =PropertyImage
        fields = ["id","image","image_url","is_cover","display_order","uploaded_at"]
        read_only_fields = ["uploaded_at"]

    def get_image_url(self,obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class PropertySerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.full_name",read_only=True)
    owner_profile_picture = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    class Meta:
        model = Property
        fields = ["id","owner","owner_name","owner_profile_picture","title","monthly_rent",
                  "city","state","property_type","bedrooms","bathrooms","max_occupants",
                  "area","furnishing","latitude","longitude","parking","floor","total_floors"
                  ,"description","security_deposit","address","pincode",
                  "address","area","status","cover_image","created_at","is_active"]
        read_only_fields =["owner"]

    def get_cover_image(self,obj):
        image = obj.images.filter(is_cover=True).first()
        request = self.context.get("request")
        if image:
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None   

    def get_owner_profile_picture(self,obj):
        request = self.context.get("request")

        if obj.owner.profile_picture:
            if request:
                return request.build_absolute_uri(obj.owner.profile_picture.url)
            return obj.owner.profile_picture.url
        return None    
        
class PropertyDetailSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.full_name",read_only=True)
    images = PropertyImageSerializer(many=True,read_only=True)
    owner_profile_picture = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    amenities = AmenitySerializer(many=True,read_only=True)

    class Meta:
        model = Property
        fields = ["id","owner","owner_name","owner_profile_picture","title","description","monthly_rent","security_deposit","address",
                  "city","state","pincode","country","property_type","bedrooms","bathrooms","max_occupants",
                  "area","furnishing","latitude","longitude","parking","floor","total_floors","status","images",
                  "amenities","cover_image","created_at","updated_at"]

    def get_cover_image(self,obj):
        image = obj.images.filter(is_cover=True).first()
        request = self.context.get("request")
        if image:
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None 
    
    def get_owner_profile_picture(self,obj):
        request = self.context.get("request")

        if obj.owner.profile_picture:
            if request:
                return request.build_absolute_uri(obj.owner.profile_picture.url)
            return obj.owner.profile_picture.url
        return None