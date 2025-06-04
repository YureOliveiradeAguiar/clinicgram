from django.urls import path
from . import views

urlpatterns = [
    path('registerRoom/', views.registerRoomView, name='registerRoom'),
    path('delete-room/', views.deleteRoomView, name='deleteRoom')
]