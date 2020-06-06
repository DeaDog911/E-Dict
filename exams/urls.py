from django.urls import path

from . import views


urlpatterns = [
    path('', views.StartExamView.as_view(), name='start_exam_url'),
#     path('foreign/<slug:slug>/', views.ForeignDictExam.as_view(), name='foreign_dict_exam_url'),
#     path('definitions/<slug:slug>/', views.DefinitionsDictExam.as_view(), name='definitions_dict_exam_url'),
    path('foreign/<slug:slug>/', views.exam, name='foreign_dict_exam_url'),
    path('foreign/<slug:slug>/done/', views.done_exam),
    path('definitions/<slug:slug>/done/', views.done_exam),
    path('definitions/<slug:slug>/', views.exam, name='definitions_dict_exam_url'),
]