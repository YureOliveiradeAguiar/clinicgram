from django.db import models
from simple_history.models import HistoricalRecords

# Create your models here.

class Client(models.Model):
    name = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=15)
    dateOfBirth = models.DateField()
    history = HistoricalRecords()