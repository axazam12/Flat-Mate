from django.db import models
from accounts.models import User
from leaseManagement.models import Lease

# Create your models here.

class RentPayment(models.Model):
    STATUS_CHOICES=[
        ("Pending","Pending"),
        ("Paid","Paid"),
        ("Late","Late"),
        ("Cancelled","Cancelled")
    ]

    PAYMENT_METHODS = [
        ("Cash","Cash"),
        ("Card","Card"),
        ("Bank Transfer","Bank Transfer"),
        ("UPI","UPI"),
    ]
    lease = models.ForeignKey(Lease,on_delete=models.CASCADE,related_name="payments")
    tenant = models.ForeignKey(User,on_delete=models.CASCADE,related_name="rent_payments")
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    month = models.PositiveSmallIntegerField()
    year = models.PositiveIntegerField()

    due_date = models.DateField(null=True,blank=True)

    paid_date= models.DateField(null=True,blank=True)
    payment_method = models.CharField(max_length=30,choices=PAYMENT_METHODS,blank=True)
    receipt = models.ImageField(upload_to="rent_receipts/",blank=True,null=True)

    paid_amount = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)

    transaction_id = models.CharField(max_length=100,blank=True)
    owner_notes =models.TextField(blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL,null=True,blank=True,related_name="verified_payments")
    verified_at = models.DateTimeField(null=True,blank=True)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("lease","month","year")
        ordering = ["-year","-month"]

    def __str__(self):
        return f"{self.tenant.username} - {self.month}/{self.year}"