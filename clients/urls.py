from django.urls import path
from . import views

urlpatterns = [
    path('clients/date-options/', views.DateOptionsAPIView.as_view(), name='dateOptions'),
    path('clients/new/', views.RegisterClientAPIView.as_view(), name='registerClient'),
]