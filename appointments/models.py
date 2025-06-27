from django.db import models
from clients.models import Client
from rooms.models import Room

class Appointment(models.Model):  
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    note = models.TextField(blank=True, null=True)