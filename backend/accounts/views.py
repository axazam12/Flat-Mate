from django.contrib.auth import authenticate,login,logout,update_session_auth_hash
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny

from properties.models import Property
from properties.serializers import PropertySerializer

from .models import User
from . serializers import UserSerializer,RegisterSerializer,LoginSerializer,ChangePasswordSerializer,PublicOwnerSerializer

from django.http import JsonResponse
from django.middleware.csrf import get_token

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ["csrf","register","user_login","public_profile","public_renter","owner_properties"]:
            return[AllowAny()]
        return [IsAuthenticated()]
    
    #csrf token
    @action(detail=False, methods=["get"])
    def csrf(self,request):
        return JsonResponse({"csrfToken":get_token(request)})

    #register
    @action(detail= False,methods = ["post"])
    def register(self,request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message":"Registered Successful","user":UserSerializer(user).data},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    #LOGIN
    @action(detail= False,methods = ["post"])
    def user_login(self,request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username =  serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            user = authenticate(username=username, password=password)

            if user:
                login(request,user)
                return Response({"message":"Login Successfully", "user": UserSerializer(user).data})
            return Response({"error":"Invalid username or password"},status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    #logout
    @action(detail= False,methods = ["post"])
    def user_logout(self,request):
        logout(request)
        return Response({"message":"Logged out Successufully"})

    #get profile
    @action(detail= False,methods = ["get"])
    def profile(self,request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
  
    @action(detail= False,methods = ["put"])
    def edit_profile(self,request):
        user = request.user
        
        user.username = request.data.get("username",user.username)
        user.full_name = request.data.get("full_name",user.full_name)
        user.email = request.data.get("email",user.email)
        user.phone = request.data.get("phone",user.phone)
        user.save()

        if user.role == "Owner":
            profile = user.owner_profile
            profile.bio = request.data.get("bio",profile.bio)
            profile.address = request.data.get("address",profile.address)
            profile.state = request.data.get("state",profile.state)
            profile.city = request.data.get("city",profile.city)
            profile.pincode = request.data.get("pincode",profile.pincode)
            profile.save()

        else:
            profile = user.renter_profile
            profile.occupation = request.data.get("occupation",profile.occupation)
            profile.preferred_location = request.data.get("preferred_location",profile.preferred_location)
            budget = request.data.get("budget")
            if budget not in["",None]:
                profile.budget = budget
            profile.save()

        return Response({"message":"Profile Updated successfully","user":UserSerializer(user).data})
    
    @action(detail= False,methods = ["put"])
    def change_password(self,request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]

            if not request.user.check_password(old_password):
                 return Response({"error":"Old password is incorrect."},status=status.HTTP_400_BAD_REQUEST)
            request.user.set_password(new_password)
            request.user.save()
    #keep the user loged in after password change
            update_session_auth_hash(request,request.user)
            return Response({"message":"Password Changed Successfully"})
        return Response( serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    @action(detail= False,methods = ["put"])
    def upload_profile_picture(self,request):
        image = request.FILES.get("profile_picture")
        if not image:
            return Response({"error":"No image uploaded"},status=status.HTTP_400_BAD_REQUEST)

        if request.user.profile_picture:
            request.user.profile_picture.delete(save=False)
        request.user.profile_picture= image
        request.user.save()
        serializer = UserSerializer(request.user)
        return Response({"message":"Profile image Uploaded successfully","user":serializer.data})
    
    @action(detail=True,methods=["get"],permission_classes=[AllowAny],url_path="public_profile")
    def public_profile(self, request,pk=None):
        try:
            owner = User.objects.get(pk=pk,role="Owner")
        except User.DoesNotExist:
            return Response({"error":"Owner not found"},status=status.HTTP_404_NOT_FOUND)
        
        serializer = PublicOwnerSerializer(owner,context={"request":request})
        return Response(serializer.data)
    
    @action(detail=True,methods=["get"],permission_classes=[AllowAny],url_path="properties")
    def owner_properties(self, request, pk=None):
        try:
            owner = User.objects.get(pk=pk,role="Owner")
        except User.DoesNotExist:
            return Response({"error":"Owner not found."},status=status.HTTP_404_NOT_FOUND,)
        properties = Property.objects.filter(owner=owner,status="Available").order_by("-created_at")
        serializer = PropertySerializer(properties,many=True,context={"request":request})

        return Response(serializer.data)

    @action(detail=False,methods=["get"])
    def renters(self,request):
        renters= User.objects.filter(role="Renter").order_by("full_name")
        serializer = UserSerializer(renters,many=True)
        return Response(serializer.data)