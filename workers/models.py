from django.db import models

from accounts.models import CustomUser


class Worker(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="worker_profile")
    ra = models.CharField(max_length=11, unique=True)
    whatsapp = models.CharField(max_length=15)

    def __str__(self):
        return self.name