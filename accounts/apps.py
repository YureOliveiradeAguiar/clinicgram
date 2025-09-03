from django.apps import AppConfig
import reversion


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from .models import CustomUser
        if not reversion.is_registered(CustomUser):
            reversion.register(CustomUser)