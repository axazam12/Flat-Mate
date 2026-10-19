from django.db import models
from accounts.models import User
from properties.models import Property
from visit.models import VisitRequest
from rentalapplication.models import RentalApplication

# Create your models here.
class Lease(models.Model):
    STATUS_CHOICES = [
        ("Pending Acceptance","Pending Acceptance" ),
        ("Active","Active"),
        ("Completed","Completed"),
        ("Terminated","Terminated"),
        ("Declined","Declined")
    ]
    LEASE_TYPE_CHOICES=[
        ("Application","Application"),
        ("Direct","Direct"),
    ]
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="leases_given")
    tenant = models.ForeignKey(User,on_delete=models.CASCADE,related_name="leases_taken")
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="leases")
    visit_request = models.OneToOneField(VisitRequest,on_delete=models.SET_NULL,null=True,blank=True,related_name="lease")
    application = models.OneToOneField(RentalApplication,on_delete=models.SET_NULL,null=True,blank=True,related_name="lease")
    lease_type = models.CharField(max_length=20,choices=LEASE_TYPE_CHOICES,default="Application")
    
    lease_start = models.DateField()
    lease_end = models.DateField(null=True,blank=True)

    monthly_rent = models.DecimalField(max_digits=10,decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10,decimal_places=2)

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="Pending Acceptance")
    accepted_at = models.DateTimeField(null=True,blank=True)
    completed_at = models.DateTimeField(null=True,blank=True)
    terminated_at = models.DateTimeField(null=True,blank=True)
    termination_reason = models.TextField(blank=True)
    decline_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tenant.username} - {self.property.title}"

class LeaseExtensionRequest(models.Model):
    STATUS_CHOICES  =[
        ("Pending","Pending"),
        ("Approved","Approved"),
        ("Rejected","Rejected")
    ]
    lease = models.ForeignKey(Lease,on_delete=models.CASCADE,related_name="extension_requests")
    tenant = models.ForeignKey(User,on_delete=models.CASCADE,related_name="lease_extension_requests")
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="received_extension_requests")

    current_end_date = models.DateField()
    requested_end_date = models.DateField()
    owner_response = models.TextField(blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.tenant.username} - {self.lease.property.title}"