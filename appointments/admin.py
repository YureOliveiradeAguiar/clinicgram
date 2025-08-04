from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(VersionAdmin):
    pass