from django.core.exceptions import ObjectDoesNotExist

import random

import dict
import definitions


def stir(sort_list):
    return sorted(sort_list, key=lambda *args: random.random())


def queryset_to_list_slugs(queryset):
    result_list = []
    for item in queryset:
        result_list.append(item.slug)
    return result_list


def get_values_list(queryset):
    values = []
    for word in queryset:
        values.append(word.value)
    return values


def get_transcriptions_list(queryset):
    transcriptions = []
    for word in queryset:
        transcriptions.append(word.transcription)
    return transcriptions


def get_translations_list(queryset):
    translations = []
    for word in queryset:
        translations.append(word.translation)
    return translations


def get_question_type_foreign():
    questions = [
        ['choose_translation', 'choose'],
        ['choose_transcriptions', 'choose'],
        ['input_translation', 'input'],
        ['choose_value', 'choose'],
        ['input_value', 'input'],
    ]

    return random.choice(questions)
    # return questions[1]


def get_question_type_definitions():
    questions = [
        ['choose_value', 'choose'],
        ['choose_definition', 'choose'],
        ['input_value', 'input'],
    ]

    return random.choice(questions)


def get_options_base(correct_field_value, field_values_from_dict):
    incorrect_field_values = []
    for field_value in field_values_from_dict:
        if field_value != correct_field_value:
            incorrect_field_values.append(field_value)

    options = stir(incorrect_field_values)[::2]
    options.append(correct_field_value)
    options = stir(options)

    return options


def get_options_translations(word: dict.models.Word, dict):
    correct_field_value = word.translation
    field_values_from_dict = stir([word.translation for word in dict.words.all()])
    return {'correct_field_value': correct_field_value,
            'options': get_options_base(correct_field_value, field_values_from_dict),
            }


def get_options_transcriptions(word: dict.models.Word, dict):
    correct_field_value = word.transcription
    field_values_from_dict = stir([word.transcription for word in dict.words.all()])
    return {'correct_field_value': correct_field_value,
            'options': get_options_base(correct_field_value, field_values_from_dict),
            }


def get_options_values(word, dict):
    correct_field_value = word.value
    field_values_from_dict = stir([word.value for word in dict.words.all()])
    return {'correct_field_value': correct_field_value,
            'options': get_options_base(correct_field_value, field_values_from_dict),
            }


def get_options_definitions(word, dict):
    correct_field_value = word.definition
    field_values_from_dict = stir([word.definition for word in dict.words.all()])
    return {'correct_field_value': correct_field_value,
            'options': get_options_base(correct_field_value, field_values_from_dict),
            }


def make_choose(word, question_type):
    dict = word.dictionary

    try:
        options_switcher = {
            'choose_translation': get_options_translations(word, dict),
            'choose_transcriptions': get_options_transcriptions(word, dict),
            'choose_value': get_options_values(word, dict),
        }
    except AttributeError:
        options_switcher = {
            'choose_definition': get_options_definitions(word, dict),
            'choose_value': get_options_values(word, dict),
        }

    options = options_switcher.get(question_type)

    question = {
        'question_type': question_type,
        'word_slug': word.slug,
        'base_field_value': word.value,
        'options': options,
    }

    if question_type == 'choose_value':
        try:
            question = {
                'question_type': question_type,
                'word_slug': word.slug,
                'base_field_value': word.translation,
                'options': options,
            }
        except AttributeError:
            question = {
                'question_type': question_type,
                'word_slug': word.slug,
                'base_field_value': word.definition,
                'options': options,
            }

    return question


def make_input(word, question_type):
    try:
        field_switcher = {
            'input_translation': {'base_field': word.value, 'current_filed_value': word.translation, },
            'input_value': {'base_field': word.translation, 'current_filed_value': word.value, },
        }
    except AttributeError:
        field_switcher = {
            'input_value': {'base_field': word.definition, 'current_filed_value': word.value, },
        }

    field_value = field_switcher.get(question_type)

    question = {
        'question_type': question_type,
        'word_slug': word.slug,
        'field_value': field_value,
    }

    return question


def make_question(word, question_type, question_group):
    question = {}

    if question_group == 'choose':
        question = make_choose(word, question_type)
    elif question_group == 'input':
        question = make_input(word, question_type)

    question['question_group'] = question_group

    return question


def make_question_foreign(word: dict.models.Word):
    question_type, question_group = get_question_type_foreign()

    return make_question(word, question_type, question_group)


def make_question_definitions(word: definitions.models.Word):
    question_type, question_group = get_question_type_definitions()

    return make_question(word, question_type, question_group)


# Check answers


def is_correct(question, answer):
    word_slug, question_type = question.split('?')
    try:
        word = dict.models.Word.objects.get(slug=word_slug)
        switcher = {
            'choose_translation': word.translation,
            'choose_transcriptions': word.transcription,
            'input_translation': word.translation,
            'choose_value': word.value,
            'input_value': word.value,
        }
    except ObjectDoesNotExist:
        word = definitions.models.Word.objects.get(slug=word_slug)
        switcher = {
            'choose_definition': word.definition,
            'choose_value': word.value,
            'input_value': word.value,
        }

    if answer == switcher.get(question_type):
        return True
    else:
        return False


def check_answers(data):
    answers_count = 0
    correct_answers_count = 0

    for key in data.keys():
        if key != 'csrfmiddlewaretoken':
            answers_count += 1
            if is_correct(key, data.get(key)):
                correct_answers_count += 1

    return answers_count, correct_answers_count
