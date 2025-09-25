from django.db import models

from treatments.models import Treatment
from clients.models import Client
from workers.models import Worker
from places.models import Place


from django.utils.translation import gettext_lazy as _


class Appointment(models.Model):

    class Status(models.TextChoices):
        UNSCHEDULED = "unscheduled", _("Não Agendado")
        SCHEDULED = "scheduled", _("Agendado")
        UNCONFIRMED  = "unconfirmed", _("A Confirmar")
        COMPLETED = "completed", _("Concluído")
        MISSED = "missed", _("Não Compareceu")
        CANCELED = "canceled", _("Cancelado")
        RESERVATION = "reservation", _("Reserva")
        SOLICITATION = "solicitation", _("Solicitação")
    
    # Always mandatory fields
    isConfirmed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UNSCHEDULED)
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE)
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    startTime = models.DateTimeField(blank=True, null=True)
    endTime = models.DateTimeField(blank=True, null=True)
    # Mandatory for apointments but not reservations
    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, blank=True)
    sus = models.BooleanField(_("SUS Patient"), default=False)
    priority = models.IntegerField(_("Priority"), default=0)
    # Always optional fields
    observation = models.TextField(blank=True, null=True)
    # Added by system
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.status == Appointment.Status.RESERVATION:
            return f"Reserva em {self.place.name} ({self.startTime:%d/%m/%Y %H:%M})"
        elif self.client:
            return f"Agendamento de {self.client.name}"
        else:
            return "Agendamento sem cliente"
    
# null=True allows the DB to store NULL
# blank=True allows forms to submit empty values