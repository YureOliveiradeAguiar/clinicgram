from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('profile/', views.UserProfileAPIView.as_view(), name='userProfile'),
    path("check-auth/", views.CheckAuthAPIView.as_view(), name="checkAuth"),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
]