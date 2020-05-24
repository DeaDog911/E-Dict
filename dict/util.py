import requests


def translate_words_set(value, lang_from, lang_to):
    translator_api_key = 'trnsl.1.1.20200508T062041Z.a814c1985c1ed913.6f70cecc0abbcf80662f4fdfda360ddc2544080b'

    response = requests.get(f'https://translate.yandex.net/api/v1.5/tr.json/translate'
                            f'?key={translator_api_key}'
                            f'&text={value}'
                            f'&lang={lang_from}-{lang_to}'
                            f'&format=plain')
    json_response = response.json()

    print()
    print(json_response)
    print()

    transcription = ''
    translation = json_response['text']
    return transcription, translation


def translate_word(value, lang_from, lang_to):
    dict_api_key = 'dict.1.1.20200522T165858Z.252c524b780fa89a.717dc9cdd22de1f375ef0f0d1c4c97ad7996cdd8'

    response = requests.get(f'https://dictionary.yandex.net/api/v1/dicservice.json/lookup'
                            f'?key={dict_api_key}'
                            f'&text={value}'
                            f'&lang={lang_from}-{lang_to}')
    json_response = response.json()

    transcription = ''
    translation = ''

    print()
    print(json_response)
    print()

    try:
        word_info = json_response['def'][0]

        translation = word_info['tr'][0]['text']
        transcription = word_info['ts']
    except KeyError:
        return translate_words_set(value, lang_from, lang_to)
    except IndexError:
        print('translate')
        # TODO Use yandex translation API to translate a text
        return translate_words_set(value, lang_from, lang_to)

    return transcription, translation


def translate(value, lang_from, lang_to):
    return translate_word(value, lang_from, lang_to)
