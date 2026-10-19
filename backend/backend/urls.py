
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/',include('accounts.urls')),
    path("api/properties/",include("properties.urls")),
    path('api/renter/',include('renter.urls')),
    path('api/visit/',include('visit.urls')),
    path('api/application/',include('rentalapplication.urls')),
    path('api/lease/',include('leaseManagement.urls')),
    path('api/payment/',include('payment.urls')),
    path('api/maintenance/',include('maintenance.urls')),
    path('api/notifications/',include('notification.urls')),
]

if settings.DEBUG : 
    urlpatterns += static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)