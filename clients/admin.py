from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import Client

@admin.register(Client)
class ClientAdmin(VersionAdmin):
    pass