from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist

import random

from . import util

import dict
import definitions


class StartExamView(LoginRequiredMixin, TemplateView):
    login_url = 'login'
    template_name = 'exams/start_exam.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        auth_user = self.request.user

        context['foreign_dictionaries'] = auth_user.foreign_dictionaries
        context['definitions_dictionaries'] = auth_user.definitions_dictionaries

        return context


def exam(request, **kwargs):
    dict_slug = kwargs['slug']
    questions_dict = {}

    try:
        dict = request.user.foreign_dictionaries.get(slug=dict_slug)
        questions = list(map(util.make_question_foreign, dict.words.all()))
    except ObjectDoesNotExist:
        dict = request.user.definitions_dictionaries.get(slug=dict_slug)
        questions = list(map(util.make_question_definitions, dict.words.all()))

    questions_dict['questions'] = questions
    return render(request, 'exams/exam.html', context={'question_dict': questions_dict})


def definitions_dict_exam(request, **kwargs):
    dict_slug = kwargs['slug']
    dict = request.user.definitions_dictionaries.get(slug=dict_slug)

    questions_dict = {}
    questions = list(map(util.make_question_definitions, dict.words.all()))

    questions_dict['questions'] = questions

    return render(request, 'exams/exam.html', context={'question_dict': questions_dict})


def done_exam(request, **kwargs):
    if request.POST:
        data = request.POST
        answers_count, correct_answers_count = util.check_answers(data)
        incorrect_answers_count = answers_count - correct_answers_count
        return render(request, 'exams/exam_done.html', context={
            'correct_answers_count': correct_answers_count,
            'incorrect_answers_count': incorrect_answers_count,
            'answers_count': answers_count,
        })
    else:
        raise Http404
