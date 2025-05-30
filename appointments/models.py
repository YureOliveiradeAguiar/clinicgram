from django.db import models
from clients.models import Client

class Room(models.Model):  
    name = models.CharField(max_length=10, unique=True)

class Appointment(models.Model):  
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)