from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from .serializers import TreatmentSerializer
from .models import Treatment
import reversion


class TreatmentListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        treatments = Treatment.objects.all().order_by('name')
        serializer = TreatmentSerializer(treatments, many=True)
        return Response(serializer.data)


class RegisterTreatmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TreatmentSerializer(data=request.data)
        if serializer.is_valid():
            with reversion.create_revision():
                treatment = serializer.save()
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            return Response({
                'success': True,
                'treatment': serializer.data,
                'message': f'{treatment.name} registrada com sucesso!'
            })
        return Response(serializer.errors)


class DeleteTreatmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, treatment_id):
        try:
            treatment = Treatment.objects.get(id=treatment_id)
        except Treatment.DoesNotExist:
            return Response({"detail": "Lugar não encontrado."})
        
        with reversion.create_revision():
            reversion.set_user(self.request.user)
            reversion.set_comment("Deleted via API")
            treatment.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
        treatment.delete()
        return Response({"detail": "Lugar deletado com sucesso."})


class TreatmentUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, treatment_id):
        treatment = get_object_or_404(Treatment, id=treatment_id)
        serializer = TreatmentSerializer(treatment, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                treatment.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)