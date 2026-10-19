from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES=(
        ("Owner","Owner"),
        ("Renter","Renter"),
    )
    full_name = models.CharField(max_length=150,blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15,blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES,default="Renter")
    profile_picture = models.ImageField(upload_to="profile_pictures/",blank=True,null=True)

    def __str__(self):
        return self.username
 
class OwnerProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="owner_profile")
    bio = models.CharField(max_length=100,blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100,blank=True)
    state = models.CharField(max_length=20,blank=True)
    pincode = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.user.username} - Owner"
    
class RenterProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="renter_profile")
    occupation = models.CharField(max_length=100,blank=True)
    preferred_location = models.CharField(max_length=100,blank=True)
    budget = models.DecimalField(max_digits=10,decimal_places=2,blank=True,null=True)

    def __str__(self):
        return f"{self.user.username} - Renter"
