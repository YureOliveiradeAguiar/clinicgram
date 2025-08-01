from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from clients.models import Client
from appointments.models import Appointment
from places.models import Place

from .serializers import HistorySerializer

class HistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = []

        # Collects history for each model.
        for model in [Client, Appointment, Place]:
            for obj in model.objects.all():
                records.extend(obj.history.all())

        # Sorts by history_date (descending).
        records.sort(key=lambda h: h.history_date, reverse=True)

        serializer = HistorySerializer(records, many=True)
        return Response(serializer.data)