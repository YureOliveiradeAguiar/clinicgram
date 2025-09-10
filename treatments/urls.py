from django.urls import path
from . import views

urlpatterns = [
    path('treatments/list/', views.TreatmentListAPIView.as_view(), name='treatmentList'),
    path('treatments/new/', views.RegisterTreatmentAPIView.as_view(), name='treatmentsNew'),
    path('treatments/delete/<int:treatment_id>/', views.DeleteTreatmentAPIView.as_view(), name='treatmentDelete'),
    path('treatments/<int:treatment_id>/', views.TreatmentUpdateAPIView.as_view(), name='treatmentUpdate'),
]