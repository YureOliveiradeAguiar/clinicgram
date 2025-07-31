from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.HistoryAPIView.as_view(), name='history'),
]