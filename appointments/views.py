from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Appointment
from .serializers import AppointmentSerializer

from django.shortcuts import get_object_or_404

import reversion


class RegisterAppointmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            with reversion.create_revision():
                appointment = serializer.save()
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            return Response({
                'success': True,
                'appointment': serializer.data,
                'message': f'{appointment} registrado com sucesso!'
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    

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