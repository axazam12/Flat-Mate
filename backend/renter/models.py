from django.db import models
from accounts.models import User
from properties.models import Property

# Create your models here.
class Favorite(models.Model):
    renter = models.ForeignKey(User,on_delete=models.CASCADE,related_name="favorites")
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="favorites")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering =["-created_at"]
        unique_together = ["renter","property"]

    def __str__(self):
        return f"{self.renter.username} - {self.property.title}"

class Review(models.Model):
    
    RATING_CHOICES = [
        (1,"⭐"),
        (2,"⭐⭐"),
        (3,"⭐⭐⭐"),
        (4,"⭐⭐⭐⭐"),
        (5,"⭐⭐⭐⭐⭐"),
    ]

    REVIEW_TYPE_CHOICES = [
        ("Visited Review", "Visited Review"),
        ("Rented Review", "Rented Review"),
    ]

    renter = models.ForeignKey(User,on_delete=models.CASCADE,related_name="reviews")
    property = models.ForeignKey(Property,on_delete=models.CASCADE,related_name="reviews")
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    review_type = models.CharField(max_length=20, choices=REVIEW_TYPE_CHOICES,default="Visited Review")

    class Meta:
        ordering = ["-created_at"]
        unique_together = ["renter","property"]

    def __str__(self):
        return f"{self.renter.username} - {self.property.title}"
    
