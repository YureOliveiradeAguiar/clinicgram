from django.db import models
from treatments.models import Treatment
from accounts.models import CustomUser
from places.models import Place
from clients.models import Client

from django.utils.translation import gettext_lazy as _


class Appointment(models.Model):

    class Status(models.TextChoices):
        UNSCHEDULED = "unscheduled", _("Não Agendado")
        SCHEDULED = "scheduled", _("Agendado")
        COMPLETED = "completed", _("Concluído")
        MISSED = "missed", _("Não Compareceu")
        CANCELED = "canceled", _("Cancelado")
        RESERVATION = "reservation", _("Reserva")
    
    # Always mandatory fields
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UNSCHEDULED)
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE)
    worker = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    startTime = models.DateTimeField(blank=True, null=True)
    endTime = models.DateTimeField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    # Mandatory for apointments but not reservations
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    sus = models.BooleanField(_("SUS Patient"), default=False)
    priority = models.IntegerField(_("Priority"), default=0)
    # Aways optional fields
    observation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Agendamento de {self.client.name}"