from django.urls import path
from django.contrib.auth import views as authenticationView

urlpatterns = [
    path('login/', authenticationView.LoginView.as_view(template_name="login.html"), name="login"),
    path('logout/', authenticationView.LogoutView.as_view(), name="logout")
]
