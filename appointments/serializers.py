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
    clientId = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source="client",
        write_only=True,
    )
    worker = WorkerSerializer(read_only=True)
    workerId = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.filter(is_worker=True),
        source="worker",
        write_only=True,
    )
    place = PlaceSerializer(read_only=True)  # Nested for display.
    placeId = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(),
        source="place",
        write_only=True,
    )

    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'client', 'clientId', 'worker', 'workerId', 'place', 'placeId',
                    'startTime', 'endTime', 'priority','status','status_display', 'observation']