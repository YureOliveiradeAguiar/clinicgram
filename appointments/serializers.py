from rest_framework import serializers
from .models import Appointment
from clients.models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name']

class AppointmentSerializer(serializers.ModelSerializer):
    client = ClientSerializer()
    place = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['id', 'startTime', 'endTime', 'place', 'note', 'client']

    def get_place(self, obj):
        return {
            'id': obj.place.id,
            'name': obj.place.name,
            'icon' : obj.place.icon
        }
