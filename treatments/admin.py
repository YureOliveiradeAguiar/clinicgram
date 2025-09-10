from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import Treatment


@admin.register(Treatment)
class TreatmentAdmin(VersionAdmin):
    pass