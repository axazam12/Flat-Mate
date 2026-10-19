from rest_framework.routers import DefaultRouter
from .views import RentPaymentViewSet

router = DefaultRouter()
router.register("rent-payment",RentPaymentViewSet,basename="rent-payment")

urlpatterns = router.urls