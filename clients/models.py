from django.db import models

from accounts.models import CustomUser


class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile")
    whatsapp = models.CharField(max_length=15)
    dateOfBirth = models.DateField()
    observation = models.TextField(max_length=200, blank=True, null=True)
    
    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}".strip()

    def __str__(self):
        return self.full_name or self.user.email