from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Appointment
from clients.models import Client
from places.models import Place
from .serializers import AppointmentSerializer

from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware, is_naive
from django.shortcuts import get_object_or_404

import reversion

class RegisterAppointmentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    # Data is received from API, formatted for saving, saved, and then some info is formated back to front.
    def post(self, request):
        data = request.data

        clientId = data.get("clientId")
        startDateTime = parse_datetime(data.get("startTime"))
        endDateTime = parse_datetime(data.get("endTime"))
        placeId = data.get("placeId")
        note = data.get("note")

        if is_naive(startDateTime):
            startDateTime = make_aware(startDateTime)
        if is_naive(endDateTime):
            endDateTime = make_aware(endDateTime)

        if not all([clientId, placeId, startDateTime, endDateTime]):
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
            place = Place.objects.get(id=placeId)
        except Place.DoesNotExist:
            return Response({
                "success": False,
                "message": "Lugar não encontrado."
            }, status=status.HTTP_404_NOT_FOUND)
        
        with reversion.create_revision():
            appointment = Appointment.objects.create(
                client=client,
                startTime=startDateTime,
                endTime=endDateTime,
                place=place,
                note=note,
            )
            reversion.set_user(self.request.user)
            reversion.set_comment("Created via API")

        firstName = client.name.split()[0] if client.name else ''
        startUTC = appointment.startTime
        endUTC = appointment.endTime
        return Response({
            "firstName": firstName,
            "startUTC": startUTC,
            "endUTC": endUTC,
            "placeName": appointment.place.name,
        }, status=status.HTTP_201_CREATED)
    

class AppointmentListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.select_related('client', 'place').order_by('startTime')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
class AppointmentDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, appointment_id):
        appointment = get_object_or_404(Appointment, id=appointment_id)

        with reversion.create_revision():
            reversion.set_user(request.user)
            reversion.set_comment("Deleted via API")
            appointment.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
        appointment.delete()
        
        return Response({"message": "Agendamento excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)
    
class AppointmentUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, appointment_id):
        appointment = get_object_or_404(Appointment, id=appointment_id)
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                appointment.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)