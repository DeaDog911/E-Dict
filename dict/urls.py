from django.urls import path

from . import views


urlpatterns = [
    path('', views.DictionaryListView.as_view(), name='dict_list_url'),
    path('create_dict', views.create_dict, name='create_dict_url'),
    path('create_word', views.create_word, name='create_word_url'),
]