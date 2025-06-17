from django.urls import path
from .views import LoginAPIView, UserProfileView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='api-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]