from django.db import models

class Room(models.Model):  
    name = models.CharField(max_length=10, unique=True)