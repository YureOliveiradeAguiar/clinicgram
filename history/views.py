from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from clients.models import Client
from appointments.models import Appointment
from places.models import Place

from reversion.models import Version
import reversion

from .serializers import HistorySerializer

class HistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        versions = Version.objects.filter(
            content_type__model__in=[
                Client._meta.model_name.lower(),
                Appointment._meta.model_name.lower(),
                Place._meta.model_name.lower(),
            ]
        ).select_related("revision", "content_type").order_by("-revision__date_created")

        serializer = HistorySerializer(versions, many=True)
        return Response(serializer.data)


class RollbackAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, version_id):
        version = Version.objects.get(id=version_id)
        obj = version._object_version.object
        obj.pk = version.object_id  # restore same PK

        with reversion.create_revision():
            obj.save()
            reversion.set_user(request.user)
            reversion.set_comment(f"Rollback to version {version_id}")

        return Response({"message": "Rollback successful."})