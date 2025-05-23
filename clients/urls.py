from django.urls import path
from . import views

urlpatterns = [
    path('delete-client/<int:client_id>/', views.deleteClientView, name='deleteClient'),
]