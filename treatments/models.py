from django.db import models

from disciplines.models import Discipline
from places.models import Place


class Treatment(models.Model):
    name = models.CharField(max_length=30, unique=True)
    discipline = models.ForeignKey(Discipline, on_delete=models.CASCADE)
    rooms = models.ManyToManyField(Place, related_name="treatments")

    def __str__(self):
        return self.name