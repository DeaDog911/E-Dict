from django.contrib import admin
from django.urls import path
from django.urls import include

from . import views


urlpatterns = [
    path('', views.landing),
    path('admin/', admin.site.urls),
    path('dictionary/foreign/', include('dict.urls')),
    path('dictionary/definitions/', include('definitions.urls')),
    path('user/', include('user_actions.urls')),
    path('exams/', include('exams.urls')),
]
