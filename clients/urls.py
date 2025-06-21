from django.urls import path
from . import views

urlpatterns = [
    path('clients/date-options/', views.DateOptionsAPIView.as_view(), name='dateOptions'),
    path('clients/new/', views.RegisterClientAPIView.as_view(), name='registerClient'),
    path('clients/list/', views.ClientListAPIView.as_view(), name='clientList'),
    path('clients/delete/<int:client_id>/', views.ClientDeleteAPIView.as_view(), name='delete-client'),
]