from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import UserSerializer

from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator


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
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CheckAuthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Authenticated"})


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})