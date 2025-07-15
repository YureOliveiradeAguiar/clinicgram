from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import PlaceSerializer

from .models import Place

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
            place = serializer.save()
            return Response({
                'id': place.id,
                'name': place.name,
            })
        return Response(serializer.errors)
    
class DeletePlaceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, place_id):
        try:
            place = Place.objects.get(id=place_id)
        except Place.DoesNotExist:
            return Response({"detail": "Lugar não encontrado."})
        place.delete()
        return Response({"detail": "Lugar deletado com sucesso."})
    
class PlaceUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, place_id):
        place = get_object_or_404(Place, id=place_id)
        serializer = PlaceSerializer(place, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)