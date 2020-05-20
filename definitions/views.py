from django.shortcuts import render
from django.shortcuts import redirect
from django.views.generic import ListView
from django.http import HttpResponse
from django.http import Http404

from . import models
from . import forms


class DictionaryListView(ListView):
    template_name = 'definitions/definitions.html'
    model = models.Dictionary

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
        return redirect('definitions_dict_list_url')
    else:
        raise Http404


def delete_dict(request):
    if request.is_ajax():
        data = request.POST
        dict_slug = data.get('dict_slug')
        print(dict_slug)
        dictionary = models.Dictionary.objects.get(slug=dict_slug)
        dictionary.delete()
        return HttpResponse('')
    else:
        raise Http404


def edit_dict(request):
    if request.is_ajax():
        data = request.POST

        dict_slug = data.get('dict_slug')
        new_title = data.get('new_title')

        dictionary = models.Dictionary.objects.get(slug=dict_slug)

        dictionary.title = new_title

        dictionary.save()
        return HttpResponse('')
    else:
        raise Http404


def create_word(request):
    if request.is_ajax():
        data = request.POST
        value = data.get('value')
        definition = data.get('definition')
        dict_slug = data.get('dict_slug')
        dict = models.Dictionary.objects.get(slug=dict_slug)
        new_word = models.Word(value=value, definition=definition, dictionary=dict)
        new_word.save()
        return HttpResponse(new_word.slug)
    else:
        raise Http404


def delete_word(request):
    if request.is_ajax():
        data = request.POST
        word_slug = data.get('word_slug')
        print(word_slug)
        word = models.Word.objects.get(slug=word_slug)
        word.delete()
        return HttpResponse('')
    else:
        raise Http404


def edit_word(request):
    if request.is_ajax():
        data = request.POST

        word_slug = data.get('word_slug')
        new_value = data.get('new_value')
        new_definition = data.get('new_definition')

        word = models.Word.objects.get(slug=word_slug)

        word.value = new_value
        word.definition = new_definition

        word.save()
        return HttpResponse('')
    else:
        raise Http404
