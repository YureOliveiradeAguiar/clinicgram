from django.urls import path
from . import views

urlpatterns = [
    path('places/list/', views.PlaceListAPIView.as_view(), name='placeList'),
]