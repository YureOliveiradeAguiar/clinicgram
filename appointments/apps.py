from django.apps import AppConfig
import reversion

class AppointmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'appointments'

    def ready(self):
        from .models import Appointment
        if not reversion.is_registered(Appointment):
            reversion.register(Appointment)