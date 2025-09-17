from .models import Appointment
from treatments.models import Treatment
from clients.models import Client
from places.models import Place

from rest_framework import serializers
from treatments.serializers import TreatmentSerializer
from accounts.serializers import WorkerSerializer
from places.serializers import PlaceSerializer

from django.contrib.auth import get_user_model


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name']

class AppointmentSerializer(serializers.ModelSerializer):
    treatment = TreatmentSerializer(read_only=True)
    treatmentId = serializers.PrimaryKeyRelatedField(
        queryset=Treatment.objects.all(),
        source="treatment",
    )
    client = ClientSerializer(read_only=True)
    clientId = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(),
        source="client",
        required=False,
        allow_null=True
    )
    worker = WorkerSerializer(read_only=True)
    workerId = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.filter(is_worker=True),
        source="worker",
    )
    place = PlaceSerializer(read_only=True)  # Nested for display.
    placeId = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(),
        source="place",
    )

    statusDisplay = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'treatment', 'treatmentId', 'client', 'clientId', 'worker', 'workerId', 'place', 'placeId',
            'startTime', 'endTime', 'priority','status','statusDisplay', 'observation', 'createdAt'
        ]
        read_only_fields = ['treatment', 'client', 'worker', 'place', 'statusDisplay']
    
    def validate(self, data):
        instance = getattr(self, "instance", None)
        # Get the new status if provided, else keep the old one
        status = data.get("status", getattr(instance, "status", None))
        # Get the new client if provided, else keep the old one
        client = data.get("client", getattr(instance, "client", None))
        if status != Appointment.Status.RESERVATION and not client:
            raise serializers.ValidationError("Client is required for non-reservation appointments.")
        return data

    def _set_status(self, instance):
        # Only auto-set status if it wasn’t explicitly set
        if instance.status not in (Appointment.Status.RESERVATION, Appointment.Status.SCHEDULED, Appointment.Status.UNSCHEDULED):
            instance.status = (
                Appointment.Status.SCHEDULED if instance.startTime else Appointment.Status.UNSCHEDULED
            )
            instance.save()
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        return self._set_status(instance)

    def create(self, validated_data):
        instance = super().create(validated_data)
        return self._set_status(instance)