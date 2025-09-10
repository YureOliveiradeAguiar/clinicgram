from rest_framework import serializers
from .models import Treatment

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = ['id', 'name']