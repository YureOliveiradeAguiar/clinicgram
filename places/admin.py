from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import Place

@admin.register(Place)
class PlaceAdmin(VersionAdmin):
    pass