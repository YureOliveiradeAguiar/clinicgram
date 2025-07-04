from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Place

class PlaceListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        places = Place.objects.all().order_by('name')
        placeData = [
            {
                'id': place.id,
                'name': place.name,
            }
            for place in places
        ]
        return Response(placeData)