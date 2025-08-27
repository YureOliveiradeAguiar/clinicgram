from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import reversion
from .models import Client
from django.shortcuts import get_object_or_404
from datetime import datetime
from .serializers import ClientSerializer


class ClientListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        clients = Client.objects.all().order_by('name')
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data)


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
        serializer = ClientSerializer(data=request.data)

        if serializer.is_valid():
            with reversion.create_revision():
                client = serializer.save()
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            firstName = client.name.split()[0] if client.name else ''
            return Response({
                'success': True,
                'client': serializer.data,
                'message': f'{firstName} registrado com sucesso!'
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ClientDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, client_id):
        client = get_object_or_404(Client, id=client_id)

        with reversion.create_revision():
            reversion.set_user(request.user)
            reversion.set_comment("Deleted via API")
            client.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
        client.delete()
        return Response({"message": "Cliente excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)


class ClientUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, client_id):
        client = get_object_or_404(Client, id=client_id)
        serializer = ClientSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                client.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)