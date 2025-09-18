from django.apps import AppConfig
import reversion


class DisciplinesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'disciplines'

    def ready(self):
        from .models import Discipline
        if not reversion.is_registered(Discipline):
            reversion.register(Discipline)