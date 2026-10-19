from django.urls import path,include
from rest_framework.routers import DefaultRouter

from .views import FavoriteViewSet,ReviewViewSet

router = DefaultRouter()
router.register("favorites", FavoriteViewSet , basename="favorites")
router.register("reviews",ReviewViewSet,basename="reviews")

urlpatterns = [
    path("",include(router.urls)),
]