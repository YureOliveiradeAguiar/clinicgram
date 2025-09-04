from django.db import models
from clients.models import Client
from accounts.models import CustomUser
from places.models import Place

from django.utils.translation import gettext_lazy as _

class Appointment(models.Model):

    class Status(models.TextChoices):
        UNSCHEDULED = "unscheduled", _("Não Agendado")
        SCHEDULED   = "scheduled", _("Agendado")
        COMPLETED   = "completed", _("Concluído")
        MISSED      = "missed", _("Não Compareceu")
        CANCELED    = "canceled", _("Cancelado")
    
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    sus = models.BooleanField(_("SUS Patient"), default=False)
    observation = models.TextField(blank=True, null=True)
    priority = models.IntegerField(_("Priority"), default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UNSCHEDULED)

    startTime = models.DateTimeField(blank=True, null=True)
    endTime = models.DateTimeField(blank=True, null=True)
    worker = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    

    def __str__(self):
        return f"Agendamento de {self.client.name}"