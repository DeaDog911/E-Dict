from django.urls import path
from django.urls import include

from . import views


urlpatterns = [
    path('settings', views.Profile_View.as_view(), name='profile_url'),
    path('', include('django.contrib.auth.urls')),
]

