from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


# Custom user model extends from Django's AbstractUser. So it already includes the fields from AbstractUser:
# username, password, first_name, last_name, email, is_staff, is_superuser, is_active, last_login, date_joined
class CustomUser(AbstractUser):
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    is_worker = models.BooleanField(default=False)

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username

    def clean(self):
        super().clean()
        # Conditional validation: WhatsApp is required for workers
        if self.is_worker and not self.whatsapp:
            raise ValidationError({"whatsapp": "O WhatsApp é obrigatório para trabalhadores."})
