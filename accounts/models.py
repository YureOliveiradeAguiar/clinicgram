from django.contrib.auth.models import AbstractUser
from django.db import models


# Custom user model extends from Django's AbstractUser. So it already includes the fields from AbstractUser:
# username, password, first_name, last_name, email, is_staff, is_superuser, is_active, last_login, date_joined
class CustomUser(AbstractUser):
    whatsapp = models.CharField(max_length=20, blank=True, null=True)
    is_worker = models.BooleanField(default=False)

    def __str__(self):
        return self.username