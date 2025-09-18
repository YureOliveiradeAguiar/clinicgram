from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from .serializers import DisciplineSerializer
from .models import Discipline
import reversion


class DisciplineListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        disciplines = Discipline.objects.all().order_by('name')
        serializer = DisciplineSerializer(disciplines, many=True)
        return Response(serializer.data)


class RegisterDisciplineAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DisciplineSerializer(data=request.data)
        if serializer.is_valid():
            with reversion.create_revision():
                discipline = serializer.save()
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            return Response({
                'success': True,
                'discipline': serializer.data,
                'message': f'{discipline.name} registrado com sucesso!'
            })
        return Response(serializer.errors)


class DeleteDisciplineAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, discipline_id):
        try:
            discipline = Discipline.objects.get(id=discipline_id)
        except Discipline.DoesNotExist:
            return Response({"detail": "Lugar não encontrado."})
        
        with reversion.create_revision():
            reversion.set_user(self.request.user)
            reversion.set_comment("Deleted via API")
            discipline.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
        discipline.delete()
        return Response({"detail": "Lugar deletado com sucesso."})


class DisciplineUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, discipline_id):
        discipline = get_object_or_404(Discipline, id=discipline_id)
        serializer = DisciplineSerializer(discipline, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                discipline.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)