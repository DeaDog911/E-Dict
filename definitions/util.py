import requests


def make_request(word, lang):
    response = requests.get(f'https://api.dictionaryapi.dev/api/v1/entries/{lang}/{word}')
    return response.json()


def find_definition(word, lang):
    google_response = make_request(word, lang)

    definition = ''

    try:
        definitions = google_response[0]['meaning']

        for meaning in definitions.keys():
            definition += f"{meaning}: {definitions[meaning][0]['definition']} \n"
    except KeyError:
        pass

    return definition
