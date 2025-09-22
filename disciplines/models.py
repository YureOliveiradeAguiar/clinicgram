from django.db import models


class Discipline(models.Model):
    name = models.CharField(max_length=30, unique=True)
    icon = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.name