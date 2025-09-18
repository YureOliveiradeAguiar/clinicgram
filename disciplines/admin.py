from django.contrib import admin
from reversion.admin import VersionAdmin
from .models import Discipline


@admin.register(Discipline)
class DisciplineAdmin(VersionAdmin):
    pass