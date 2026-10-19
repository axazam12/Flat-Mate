from rest_framework.routers import DefaultRouter
from .views import RentalApplicationViewSet

router = DefaultRouter()
router.register("rental-application",RentalApplicationViewSet,basename="rental-application"
)

urlpatterns = router.urls