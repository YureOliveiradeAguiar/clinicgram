from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            # Optionally generate token here
            return Response({"detail": "Login bem-sucedido"}, status=status.HTTP_200_OK)
        return Response({"detail": "Usuário ou senha inválidos"}, status=status.HTTP_401_UNAUTHORIZED)