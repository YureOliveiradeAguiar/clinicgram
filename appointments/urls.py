from django.urls import path
from . import views

urlpatterns = [
    path('appointments/new/', views.RegisterAppointmentAPIView.as_view(), name='registerAppointment'),
    path('appointments/list/', views.AppointmentListAPIView.as_view(), name='appointmentsList'),
]