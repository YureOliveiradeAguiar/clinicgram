from django.apps import AppConfig
import reversion

class ClientsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'clients'

    def ready(self):
        from .models import Client
        reversion.register(Client)