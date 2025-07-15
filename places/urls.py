from django.urls import path
from . import views

urlpatterns = [
    path('places/list/', views.PlaceListAPIView.as_view(), name='placeList'),
    path('places/new/', views.RegisterPlaceAPIView.as_view(), name='placesNew'),
    path('places/delete/<int:place_id>/', views.DeletePlaceAPIView.as_view(), name='placeDelete'),
    path('places/<int:place_id>/', views.PlaceUpdateAPIView.as_view(), name='placeUpdate'),
]