from django.urls import path

from . import views


urlpatterns = [
    path('', views.DictionaryListView.as_view(), name='foreign_dict_list_url'),
    path('create_dict', views.create_dict, name='create_dict_url'),
    path('delete_dict', views.delete_dict, name='delete_dict_url'),
    path('edit_dict', views.edit_dict, name='edit_dict_url'),
    path('create_word', views.create_word, name='create_word_url'),
    path('delete_word', views.delete_word, name='delete_word_url'),
    path('edit_word', views.edit_word, name='edit_word_url'),
]