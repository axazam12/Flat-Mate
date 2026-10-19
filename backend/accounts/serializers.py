from rest_framework import serializers
from .models import User,OwnerProfile,RenterProfile
from django.contrib.auth.password_validation import validate_password
from properties.models import Property

class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = "__all__"
        read_only_fields = ["user"]

class RenterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RenterProfile
        fields = "__all__"
        read_only_fields = ["user"]

class UserSerializer(serializers.ModelSerializer):
    owner_profile = OwnerProfileSerializer(read_only=True)
    renter_profile = RenterProfileSerializer(read_only = True)
    class Meta:
        model = User
        fields = ["id","username","full_name","email","phone","role","profile_picture","owner_profile","renter_profile"]
        

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,validators = [validate_password])
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields= [
            "username","full_name","email","phone","role","password","confirm_password",
        ]

    def validate_username(self, value):
        if User.objects.filter(username = value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email = value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate(self,data):
        if data.get("password")!=data.get("confirm_password"):
            raise serializers.ValidationError(
                {
                    "confirm_password":"Passwords do not match."
                }
            )
        return data
    
    def create(self,validated_data):
        validated_data.pop("confirm_password",None)
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password,**validated_data)

        if user.role == "Owner":
            OwnerProfile.objects.create(user=user)

        elif user.role == "Renter":
            RenterProfile.objects.create(user=user)
        
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only = True,validators= [validate_password])
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self,data):
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError({
                "confirm_new_password":"Passwords do not match."
            })
        return data
    
class PublicOwnerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField(read_only=True)
    bio = serializers.CharField(source = "owner_profile.bio",read_only=True)
    address = serializers.CharField(source = "owner_profile.address",read_only=True)
    city = serializers.CharField(source = "owner_profile.city",read_only=True)
    state = serializers.CharField(source = "owner_profile.state",read_only=True)
    pincode = serializers.CharField(source = "owner_profile.pincode",read_only=True)
    total_properties = serializers.SerializerMethodField()
    available_properties = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id","full_name","profile_picture","bio","city","pincode","state","address","email","total_properties","available_properties"]

    def get_profile_picture(self,obj):
        request = self.context.get("request")
        if obj.profile_picture:
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None
    
    def get_total_properties(self,obj):
        return Property.objects.filter(owner=obj).count()
    
    def get_available_properties(self,obj):
        return Property.objects.filter(owner=obj,status="Available").count()

class PublicRenterSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    occupation = serializers.CharField(source="renter_profile.occupation",read_only=True)
    class Meta:
        model = User
        fields=["id","full_name","profile_picture","occupation"]

    def get_profile_picture(self,obj):
        request = self.context.get("request")
        if obj.profile_picture:
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None