from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from clients.models import Client
from appointments.models import Appointment
from places.models import Place

from reversion.models import Version, Revision
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
    
class ClearHistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Version.objects.all().delete()
        Revision.objects.all().delete()
        return Response({"message": "History cleared successfully"})


class RollbackAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, version_id):
        target_version = Version.objects.get(id=version_id)
        obj = target_version._object_version.object
        obj.pk = target_version.object_id  # keep same primary key

        # Actually restore the object
        with reversion.create_revision():
            obj.save()
            reversion.set_user(request.user)
            reversion.set_comment(f"Rollback to version {version_id}")
        
        # Optionally remove newer versions
        Version.objects.filter(
            content_type=target_version.content_type,
            object_id=target_version.object_id,
            revision__date_created__gt=target_version.revision.date_created
        ).delete()

        return Response({"message": "Rollback successful."})