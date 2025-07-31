from django.db import models
from simple_history.models import HistoricalRecords

class Place(models.Model):
    name = models.CharField(max_length=30, unique=True)
    icon = models.CharField(max_length=10, blank=True, null=True)
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.icon or ''} {self.name}"