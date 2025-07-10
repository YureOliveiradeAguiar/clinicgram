from django.urls import path
from . import views

urlpatterns = [
    path('appointments/new/', views.RegisterAppointmentAPIView.as_view(), name='registerAppointment'),
    path('appointments/list/', views.AppointmentListAPIView.as_view(), name='appointmentsList'),
    path('appointments/list/', views.AppointmentListAPIView.as_view(), name='appointmentsList'),
    path('appointments/delete/<int:appointment_id>/', views.AppointmentDeleteAPIView.as_view(), name='deleteAppointment'),
]