from django.db import models
from clients.models import Client
from places.models import Place
from simple_history.models import HistoricalRecords

class Appointment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    note = models.TextField(blank=True, null=True)
    history = HistoricalRecords()