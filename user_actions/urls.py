from django.urls import path
from django.urls import include

from . import views


urlpatterns = [
    path('settings', views.UserChangeView.as_view(), name='profile_url'),
    path('registration', views.UserCreateView.as_view(), name='registration_url'),
    path('delete_profile', views.delete_profile, name='delete_profile_url'),
    path('', include('django.contrib.auth.urls')),
]

