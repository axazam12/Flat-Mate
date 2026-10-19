from django.contrib import admin
from .models import Lease,LeaseExtensionRequest

# Register your models here.
admin.site.register(Lease)
admin.site.register(LeaseExtensionRequest)