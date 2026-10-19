from django.db import models

# Create your models here.
from django.db import models
from accounts.models import User

# Create your models here.
class Notification(models.Model):
    NOTIFICATION_TYPE=[
        ("Visit","Visit"),
        ("Review","Review"),
        ("Lease","Lease"),
        ("Rent","Rent"),
        ("Maintenance","Maintenance"),
        ("Application","Application"),
        ("Payment","Payment"),
        ("Lease Extension","Lease Extension"),
        ("General","General")
    ]

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="notifications")

    title = models.CharField(max_length=150)

    message = models.TextField()
    notification_type = models.CharField(max_length=30,choices=NOTIFICATION_TYPE,default="General")

    is_read = models.BooleanField(default=False)
    created_at= models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.title}"