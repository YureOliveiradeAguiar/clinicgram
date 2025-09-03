from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from django.shortcuts import get_object_or_404

from .models import CustomUser
from .serializers import WorkerSerializer

from rest_framework import status
import reversion


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)  # Ensures CSRF cookie is set on GET
    def get(self, request):
        return Response({'message': 'CSRF cookie set'})

    def post(self, request):
        data = request.data  # DRF handles parsing
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Creates the session
            return Response({'message': 'Logged in'})
        else:
            return Response({'error': 'Usuário ou senha inválidos'}, status=400)


class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response ({
            "username": user.username,
        })


class CheckAuthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Authenticated"})


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})


# STAFF MANAGEMENT: LISTING, REGISTER, DELETE, PATCH:
class WorkerListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        worker_users = CustomUser.objects.filter(is_worker=True).order_by('username')
        serializer = WorkerSerializer(worker_users, many=True)
        return Response(serializer.data)

class RegisterWorkerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WorkerSerializer(data=request.data)
        if serializer.is_valid():
            with reversion.create_revision():
                worker = serializer.save(is_worker=True) # Sets is_worker to True
                reversion.set_user(self.request.user)
                reversion.set_comment("Created via API")
            workerUsername = worker.username
            return Response({
                'success': True,
                'worker': serializer.data,
                'message': f'{workerUsername} registrado com sucesso!'
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class WorkerDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, worker_id):
        worker = get_object_or_404(CustomUser, id=worker_id)

        with reversion.create_revision():
            reversion.set_user(request.user)
            reversion.set_comment("Deleted via API")
            worker.save() # Save() causes an update that doesnt modify nothing but triggers the revision.
        worker.delete()
        return Response({"message": "Estagiário excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)

class WorkerUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, worker_id):
        worker = get_object_or_404(CustomUser, id=worker_id)
        serializer = WorkerSerializer(worker, data=request.data, partial=True)
        if serializer.is_valid():
            with reversion.create_revision():
                reversion.set_user(self.request.user)
                reversion.set_comment("Updated via API")
                worker.save() # Save() has to be used here to trigger reversion and save with with old data to be reverted to.
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)