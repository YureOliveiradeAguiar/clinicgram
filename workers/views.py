from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
import reversion

from .models import Worker
from .serializers import WorkerSerializer


class WorkerListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        workers = Worker.objects.all().order_by('user__firstName', 'user__lastName')
        serializer = WorkerSerializer(workers, many=True)
        return Response(serializer.data)


class RegisterWorkerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WorkerSerializer(data=request.data)
        if serializer.is_valid():
            with reversion.create_revision():
                worker = serializer.save()
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            return Response({
                'success': True,
                'worker': serializer.data,
                'message': f'Estagiário {worker.fullName} registrado com sucesso!'
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class WorkerDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, worker_id):
        try:
            worker = get_object_or_404(Worker, id=worker_id)
            with reversion.create_revision():
                reversion.set_user(request.user)
                reversion.set_comment("Deleted via API")
                worker.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
            if worker.user:
                worker.user.delete()
            else:
                worker.delete()
            return Response({"message": "Estagiário excluído com sucesso."}, status=status.HTTP_200_OK)
        
        except Worker.DoesNotExist:
            return Response({"error": "Estagiário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Erro interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkerUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, worker_id):
        worker = get_object_or_404(Worker, id=worker_id)
        serializer = WorkerSerializer(worker, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                worker.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)