from django.apps import AppConfig
import reversion

class PlacesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'places'

    def ready(self):
        from .models import Place
        if not reversion.is_registered(Place):
            reversion.register(Place)