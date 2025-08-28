from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=15)
    dateOfBirth = models.DateField()
    observation = models.TextField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name