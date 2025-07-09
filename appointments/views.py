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

class RegisterAppointmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

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
        
        appointment = Appointment.objects.create(
            client=client,
            startTime=startDateTime,
            endTime=endDateTime,
            place=place,
            note=note,
        )

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