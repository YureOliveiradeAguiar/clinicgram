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