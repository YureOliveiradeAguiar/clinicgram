from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from clients.models import Client
from appointments.models import Appointment
from places.models import Place

from reversion.models import Version

from .serializers import HistorySerializer

class HistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def __str__(self):
        return f"Appointsment for {self.client.name} at {self.startTime.strftime('%d/%m/%Y %H:%M')} in {self.place.name}"

    def get(self, request):
        # Collects versions for specific models.
        versions = Version.objects.filter(
            content_type__model__in=[
                Client._meta.model_name,
                Appointment._meta.model_name,
                Place._meta.model_name,
            ]
        ).select_related("revision", "content_type")

        # Sorts by revision date (descending).
        versions = versions.order_by("-revision__date_created")

        serializer = HistorySerializer(versions, many=True)
        return Response(serializer.data)