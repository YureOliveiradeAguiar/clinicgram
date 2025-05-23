from django.db import models
from clients.models import Client

class Appointment(models.Model):  
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()