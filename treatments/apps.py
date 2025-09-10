from django.apps import AppConfig
import reversion


class TreatmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'treatments'

    def ready(self):
        from .models import Treatment
        if not reversion.is_registered(Treatment):
            reversion.register(Treatment)