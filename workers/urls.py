from django.urls import path
from . import views

urlpatterns = [
    path('workers/list/', views.WorkerListAPIView.as_view(), name='workerList'),
    path('workers/new/', views.RegisterWorkerAPIView.as_view(), name='workerRegister'),
    path('workers/delete/<int:worker_id>/', views.WorkerDeleteAPIView.as_view(), name='workerDelete'),
    path('workers/<int:worker_id>/', views.WorkerUpdateAPIView.as_view(), name='workerUpdate'),
]