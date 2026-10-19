from django.db import models
from accounts.models import User
from properties.models import Property

# Create your models here.
class VisitRequest(models.Model):
    STATUS_CHOICES =[
        ("Pending","Pending"),
        ("Approved","Approved"),
        ("Reschedule Requested","Reschedule Requested"),
        ("Rejected","Rejected"),
        ("Completed","Completed"),
        ("Cancelled","Cancelled")
    ]

    REQUESTED_BY_CHOICES = [
        ("Owner","Owner"),
        ("Renter","Renter")
    ]

    renter = models.ForeignKey(User,on_delete=models.CASCADE,related_name="visit_requests")
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="visit_requests")
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_visit_requests")
    visit_date = models.DateField()
    visit_time = models.TimeField()

    proposed_visit_date = models.DateField(null=True,blank=True)
    proposed_visit_time = models.TimeField(null=True,blank=True)

    message = models.TextField(blank=True)

    rejection_reason = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    reschedule_reason = models.TextField(blank=True)

    requested_by = models.CharField(max_length=10,choices=REQUESTED_BY_CHOICES,blank=True)

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="Pending")
    previous_status = models.CharField(max_length=20,blank=True,default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now=True)

    class Meta:
        ordering =["-created_at"]

    def __str__(self):
        return f"{self.renter.username} -> {self.property.title}"