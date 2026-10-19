from rest_framework.routers import DefaultRouter
from .views import LeaseViewSet,LeaseExtensionRequestViewSet

router = DefaultRouter()
router.register("lease",LeaseViewSet,basename="lease")
router.register("lease-extension",LeaseExtensionRequestViewSet,basename="lease-extension")

urlpatterns = router.urls