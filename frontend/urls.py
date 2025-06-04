from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("dashboard/", views.dashboardView, name="dashboard"),
    path("registerClient/", views.registerClientView, name="registerClient"),
    path("clients/", views.clientsView, name="clients"),
    path("schedule/", views.scheduleView, name="schedule"),
    path("scheduling/", views.schedulingView, name="scheduling"),
    path("roomManager/", views.roomManagerView, name="roomManager")
]