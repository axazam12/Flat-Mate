from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet,PropertyImageViewSet,AmenityViewSet

router = DefaultRouter()

router.register("properties",PropertyViewSet)
router.register("property-images",PropertyImageViewSet)
router.register("amenities",AmenityViewSet)

urlpatterns = router.urls