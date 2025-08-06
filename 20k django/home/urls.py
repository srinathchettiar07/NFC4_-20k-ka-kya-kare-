from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/properties/', views.property_api, name='property_api'),
] 