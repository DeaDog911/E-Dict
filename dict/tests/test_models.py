from django.test import TestCase
from django.contrib.auth.models import User

from dict.models import Dictionary
from dict.models import get_slug


class DictionaryTestModels(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='user')
        self.dictionary = Dictionary.objects.create(
            title='dict',
            user=self.user
        )

    def test_slug(self):
        self.assertEquals(self.dictionary.slug, get_slug(self.dictionary.title))
