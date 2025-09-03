from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('profile/', views.UserProfileAPIView.as_view(), name='userProfile'),
    path("check-auth/", views.CheckAuthAPIView.as_view(), name="checkAuth"),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    # Staff urls:
    path('workers/list/', views.WorkerListAPIView.as_view(), name='workerList'),
    path('workers/new/', views.RegisterWorkerAPIView.as_view(), name='workerRegister'),
    path('workers/delete/<int:worker_id>/', views.WorkerDeleteAPIView.as_view(), name='workerDelete'),
    path('workers/<int:worker_id>/', views.WorkerUpdateAPIView.as_view(), name='workerUpdate'),
]