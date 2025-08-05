from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.HistoryAPIView.as_view(), name='history'),
    path('history/clear/', views.ClearHistoryAPIView.as_view(), name='clearHistory'),
    path('history/rollback/<int:version_id>/', views.RollbackAPIView.as_view(), name='rollback'),
]