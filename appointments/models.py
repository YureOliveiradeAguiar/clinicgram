from django.db import models
from clients.models import Client
from places.models import Place

class Appointment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Agendamento de {self.client.name} às {self.startTime.strftime('%d/%m/%Y %H:%M')} em {self.place.name}"