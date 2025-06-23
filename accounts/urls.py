from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('profile/', views.UserProfileView.as_view(), name='userProfile'),
    path("check-auth/", views.CheckAuthView.as_view(), name="checkAuth"),
    path('logout/', views.LogoutView.as_view(), name='logout'),
]