from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Client

from django.shortcuts import get_object_or_404

from datetime import datetime


class DateOptionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        currentYear = datetime.now().year
        monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        return Response({
            'days': list(range(1, 32)),
            'months': monthNames,
            'years': list(range(currentYear, 1899, -1))
        })


class RegisterClientAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            client = Client.objects.create(
                name = data['name'],
                whatsapp = data['whatsapp'],
                dateOfBirth = data['dateOfBirth']
            )
            firstName = client.name.split()[0] if client.name else ''
            return Response({'success': True, 'client_id': client.id, 'message': f'{firstName} registrado!'})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)
     
        
class ClientListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clients = Client.objects.all().order_by('name')
        clientData = [
            {
                'id': client.id,
                'name': client.name,
                'whatsapp': client.whatsapp,
                'dateOfBirth': client.dateOfBirth.strftime('%d/%m/%Y')
            }
            for client in clients
        ]
        return Response(clientData)


class ClientDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, client_id):
        client = get_object_or_404(Client, id=client_id)
        client.delete()
        return Response({"message": "Cliente excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)