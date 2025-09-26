from django.db import models

from accounts.models import CustomUser

from django.utils.translation import gettext_lazy as _


class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile")
    whatsapp = models.CharField(max_length=18)
    dateOfBirth = models.DateField()
    observation = models.TextField(max_length=200, blank=True, null=True)
    
    @property
    def name(self):
        return f"{self.user.firstName} {self.user.lastName}".strip()

    def __str__(self):
        return self.name or self.user.email