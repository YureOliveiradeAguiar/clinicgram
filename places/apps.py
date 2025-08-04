from django.apps import AppConfig
import reversion

class PlacesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'places'

    def ready(self):
        from .models import Place
        reversion.register(Place)