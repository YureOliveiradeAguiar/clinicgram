from django.urls import path
from . import views

urlpatterns = [
    path('appointments/new/', views.RegisterAppointmentAPIView.as_view(), name='registerAppointment'),
]