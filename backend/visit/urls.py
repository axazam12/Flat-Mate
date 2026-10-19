from rest_framework.routers import DefaultRouter
from .views import VisitRequestViewSet

router = DefaultRouter()
router.register("visit-request", VisitRequestViewSet, basename="visit-request")

urlpatterns = router.urls