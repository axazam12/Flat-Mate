from django.db import models
from accounts.models import User
from properties.models import Property
from leaseManagement.models import Lease
# Create your models here.    
class MaintenanceRequest(models.Model):

    MAINTENANCE_TYPE_CHOICES=[
        ("Plumbing","Plumbing"),
        ("Electrical", "Electrical"),
        ("Painting", "Painting"),
        ("Cleaning", "Cleaning"),
        ("Appliance Repair", "Appliance Repair"),
        ("Furniture Repair", "Furniture Repair"),
        ("AC Service", "AC Service"),
        ("Water Leakage", "Water Leakage"),
        ("Pest Control", "Pest Control"),
        ("Internet", "Internet"),
        ("Security", "Security"),
        ("Garden", "Garden"),
        ("General", "General"),
        ("Other", "Other"),
    ]
    PRIORITY_CHOICES = [
        ("Low","Low"),
        ("Medium","Medium"),
        ("High","High"),
        ("Emergency","Emergency")
    ]

    STATUS_CHOICES=[
        ("Open","Open"),
        ("In Progress","In Progress"),
        ("Resolved","Resolved"),
        ("Cancelled","Cancelled")
    ]
    tenant = models.ForeignKey(User,on_delete=models.CASCADE,related_name="maintenance_requests")

    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_maintenance_requests")
    lease = models.ForeignKey(Lease,on_delete=models.CASCADE,related_name="maintenance_requests")
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="maintenance_requests")
    maintenance_type = models.CharField(max_length=30,choices=MAINTENANCE_TYPE_CHOICES,default="General")

    title = models.CharField(max_length=200)
    description = models.TextField()
    owner_response = models.TextField(blank=True)
    priority = models.CharField(max_length=20,choices=PRIORITY_CHOICES,default="Medium")
    status =models.CharField(max_length=20,choices=STATUS_CHOICES,default="Open")
    image = models.ImageField(upload_to="maintenance/",blank=True,null=True)

    resolved_at = models.DateTimeField(null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.property.title} - {self.title}"
    
