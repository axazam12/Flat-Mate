from django.db import models
from accounts.models import User
# Create your models here.

class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ("Apartment","Apartment"),
        ("House","House"),
        ("Villa", "Villa"),
        ("Studio", "Studio"),
        ("Commercial","Commercial"),
        ("PG","PG"),
        ("Hostel","Hostel")
    ]

    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Occupied","Occupied"),
        ("Deactivated", "Deactivated")
    ]

    FURNISHING_CHOICES =[
        ("Unfurnished","Unfurnished"),
        ("Semi furnished","Semi furnished"),
        ("Fully furnished","Fully furnished")
    ]

    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="properties")
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    monthly_rent = models.DecimalField(max_digits=10,decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10,decimal_places=2,default = 0)

    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=50,default="India")

    property_type = models.CharField(max_length=20,choices=PROPERTY_TYPE_CHOICES)
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    max_occupants = models.PositiveIntegerField(default=1)
    area = models.DecimalField(max_digits=10,decimal_places=2,help_text="Area in square feet")
    latitude = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)
    longitude = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)

    furnishing = models.CharField(max_length=30,choices=FURNISHING_CHOICES, default="Unfurnished")

    parking = models.BooleanField(default=False)
    floor = models.PositiveIntegerField(default=0)
    total_floors = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="Available")

    is_active = models.BooleanField(default=True)
   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class PropertyImage(models.Model):
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="images")
    image = models.ImageField(upload_to="property_images/")
    is_cover = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    display_order = models.PositiveIntegerField(default=0)
    def __str__(self):
        return f"{self.property.title} Image"
    
class Amenity(models.Model):
    AMENITY_CHOICES = [
        ("WiFi","WiFi"),
        ("AC","AC"),
        ("Swimming Pool", "Swimming Pool"),
        ("Gym","Gym"),
        ("Power Backup","Power Backup"),
        ("Lift", "Lift"),
        ("Garden","Garden"),
        ("Security","Security"),
        ("Pet Friendly","Pet Friendly"),
        ("Children Play Area","Children Play Area"),
        ("Club House","Club House"),
        ("Water Supply", "24x7 Water Supply"),
        ("Balcony", "Balcony"),

    ]
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="amenities")
    name = models.CharField(max_length=50,choices=AMENITY_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.property}"
