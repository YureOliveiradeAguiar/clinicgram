from django.urls import path
from . import views

urlpatterns = [
    path('disciplines/list/', views.DisciplineListAPIView.as_view(), name='disciplineList'),
    path('disciplines/new/', views.RegisterDisciplineAPIView.as_view(), name='disciplinesNew'),
    path('disciplines/delete/<int:discipline_id>/', views.DeleteDisciplineAPIView.as_view(), name='disciplineDelete'),
    path('disciplines/<int:discipline_id>/', views.DisciplineUpdateAPIView.as_view(), name='disciplineUpdate'),
]