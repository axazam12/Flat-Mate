from django.db import models
from accounts.models import User
from properties.models import Property
from visit.models import VisitRequest

# Create your models here.
class RentalApplication(models.Model):
    STATUS_CHOICES=[    
        ("Pending","Pending"),
        ("Approved","Approved"),
        ("Rejected","Rejected"),
        ("Cancelled","Cancelled")
    ]

    renter = models.ForeignKey(User,on_delete=models.CASCADE,related_name="rental_applications")
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="rental_applications")
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_rental_applications")
    visit_request = models.OneToOneField(VisitRequest,on_delete=models.CASCADE,related_name="rental_application")

    message = models.TextField(blank=True)
    owner_message = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.renter.username} - {self.property.title}"
