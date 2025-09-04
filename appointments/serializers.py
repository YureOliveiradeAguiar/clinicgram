from .models import Appointment
from clients.models import Client
from places.models import Place

from rest_framework import serializers
from accounts.serializers import WorkerSerializer
from places.serializers import PlaceSerializer

from django.contrib.auth import get_user_model


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name']

class AppointmentSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source="client",
        write_only=True,
    )
    worker = WorkerSerializer(read_only=True)
    worker_id = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.filter(is_worker=True),
        source="worker",
        write_only=True,
    )
    place = PlaceSerializer(read_only=True)
    place_id = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(),
        source="place",
        write_only=True,
    )

    class Meta:
        model = Appointment
        fields = ['id', 'client', 'client_id', 'worker', 'worker_id', 'place', 'place_id', 'startTime', 'endTime', 'observation']