from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import Worker

@admin.register(Worker)
class WorkerAdmin(VersionAdmin):
    pass