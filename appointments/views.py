from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Room, Appointment, Client

from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware, is_naive
from django.utils.timezone import localtime

class RegisterAppointmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        clientId = data.get("clientId")
        roomId = data.get("roomId")
        startDateTime = parse_datetime(data.get("startTime"))
        endDateTime = parse_datetime(data.get("endTime"))
        note = data.get("note")

        if is_naive(startDateTime):
            startDateTime = make_aware(startDateTime)
        if is_naive(endDateTime):
            endDateTime = make_aware(endDateTime)

        if not all([clientId, roomId, startDateTime, endDateTime]):
            return Response({
                "success": False,
                "message": "Todos os campos são obrigatórios."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            client = Client.objects.get(id=clientId)
        except Client.DoesNotExist:
            return Response({
                "success": False,
                "message": "Cliente não encontrado."
            }, status=status.HTTP_404_NOT_FOUND)
        
        try:
            room = Room.objects.get(id=roomId)
        except Room.DoesNotExist:
            return Response({
                "success": False,
                "message": "Sala não encontrada."
            }, status=status.HTTP_404_NOT_FOUND)
        
        appointment = Appointment.objects.create(
            client=client,
            startTime=startDateTime,
            endTime=endDateTime,
            room=room,
            note=note,
        )

        firstName = client.name.split()[0] if client.name else ''
        day = localtime(appointment.startTime).strftime("%d")
        startLocal = localtime(appointment.startTime).strftime("%H:%M")
        endLocal = localtime(appointment.endTime).strftime("%H:%M")
        return Response({
            "success": True,
            "appointment_id": appointment.id,
            "message": (
                f"{firstName} agendado para o dia {day} das {startLocal} às {endLocal} "
                f"na sala: {appointment.room.name}."
            ),
        }, status=status.HTTP_201_CREATED)