from django.shortcuts import render
from django.shortcuts import redirect
from django.views.generic.list import ListView
from django.views.generic.list import View
from django.http import Http404
from django.http import HttpResponse

from . import models
from . import forms


class DictionaryListView(ListView):
    model = models.Dictionary
    template_name = 'dict/dict.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        context['dictionaries'] = context['object_list']
        context['create_dict_form'] = forms.CreateDictForm()
        return context


def create_dict(request):
    if request.POST:
        bound_form = forms.CreateDictForm(request.POST)
        if bound_form.is_valid():
            new_dict = bound_form.save()
            new_dict.user = request.user
            new_dict.save()
        return redirect('dict_list_url')
    else:
        raise Http404


def create_word(request):
    if request.is_ajax():
        data = request.POST
        value = data.get('value')
        transcription = data.get('transcription')
        translation = data.get('translation')
        dictionary_slug = data.get('dictionary_slug')
        dictionary = models.Dictionary.objects.get(slug=dictionary_slug)
        new_word = models.Word(value=value, transcription=transcription, translation=translation, dictionary=dictionary)
        new_word.save()
        return HttpResponse('')
    else:
        raise Http404
