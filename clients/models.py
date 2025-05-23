from django.db import models

# Create your models here.

class Client(models.Model):
    name = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=15)
    dateOfBirth = models.DateField()