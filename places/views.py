from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from .serializers import PlaceSerializer
from .models import Place
import reversion


class PlaceListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        places = Place.objects.all().order_by('name')
        serializer = PlaceSerializer(places, many=True)
        return Response(serializer.data)


class RegisterPlaceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PlaceSerializer(data=request.data)
        if serializer.is_valid():
            with reversion.create_revision():
                place = serializer.save()
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            return Response({
                'id': place.id,
                'name': place.name,
                'place': serializer.data,
            })
        return Response(serializer.errors)


class DeletePlaceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, place_id):
        try:
            place = Place.objects.get(id=place_id)
        except Place.DoesNotExist:
            return Response({"detail": "Lugar não encontrado."})
        
        with reversion.create_revision():
            reversion.set_user(self.request.user)
            reversion.set_comment("Deleted via API")
            place.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
        place.delete()
        return Response({"detail": "Lugar deletado com sucesso."})


class PlaceUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, place_id):
        place = get_object_or_404(Place, id=place_id)
        serializer = PlaceSerializer(place, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                place.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)