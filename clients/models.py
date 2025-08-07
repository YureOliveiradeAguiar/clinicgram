from django.db import models

class Client(models.Model):
    name = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=15)
    dateOfBirth = models.DateField()

    def __str__(self):
        return self.name