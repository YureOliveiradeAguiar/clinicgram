from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('profile/', views.UserProfileAPIView.as_view(), name='userProfile'),
    path("check-auth/", views.CheckAuthAPIView.as_view(), name="checkAuth"),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),

    path('staff/list/', views.StaffListAPIView.as_view(), name='staffList'),
    path('staff/new/', views.RegisterStaffAPIView.as_view(), name='staffRegister'),
    path('staff/delete/<int:staff_id>/', views.StaffDeleteAPIView.as_view(), name='staffDelete'),
    path('staff/<int:staff_id>/', views.StaffUpdateAPIView.as_view(), name='staffUpdate'),
]