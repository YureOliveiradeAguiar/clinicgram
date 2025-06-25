from django.urls import path
from . import views

urlpatterns = [
    path('rooms/list/', views.RoomListAPIView.as_view(), name='roomList'),
]