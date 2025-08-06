from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from clients.models import Client
from appointments.models import Appointment
from places.models import Place

from reversion.models import Version, Revision

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
    # Terms: reversion("reverter"), versions(snapshots)(by object), object(model object), revision(act of creating a version for a object).
    def post(self, request, version_id):
        targetVersion = Version.objects.get(id=version_id)
        targetDate = targetVersion.revision.date_created

        vertionsToRevert = Version.objects.all().filter(
            revision__date_created__gte=targetDate # gte = greater than or equal => X
        ).select_related("revision").order_by("-revision__date_created")
        print("vertionsToRevert: ", vertionsToRevert)

        for version in vertionsToRevert:
            firstVersion = Version.objects.filter(
                object_id=version.object_id,
                content_type=targetVersion.content_type
            ).order_by("revision__date_created").first() # Not a loop, just a query limited to one row in SQL.
            print("version.id: ", version.id)
            print("firstVersion.id: ", firstVersion.id)

            isFirst = version.id == firstVersion.id
            if (isFirst): # If the version checked is the first, then deletion.
                modelClass = version.content_type.model_class()
                try:
                    instance = modelClass.objects.get(pk=version.object_id)
                    instance.delete()
                    print(f"Deleted {modelClass.__name__} id={version.object_id}")
                except:
                    print(f"{modelClass.__name__} id={version.object_id} already deleted")
            else:
                obj = version._object_version.object # Reverts the tracked object properties to the version (snapshot)(obj = targetVersion._object_version.object).
                obj.pk = version.object_id # Keeps the same primary key it had before (each version has a history id based on the history model table).
                obj.save() # Actually writes the rollback to the database.
                print(f"{obj} reverted.")
            version.delete()

        return Response({"message": "Rollback successful."})