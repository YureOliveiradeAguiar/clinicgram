from django.urls import path
from . import views

urlpatterns = [
    path('registerAppointment/', views.scheduleAppointmentView, name='scheduleAppointment'),
    path('deleteAppointment/<int:appointment_id>/', views.deleteAppointmentView, name='deleteAppointment')
]