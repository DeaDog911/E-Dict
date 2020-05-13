from django.db import models
from django.contrib.auth.models import User
import datetime


def get_slug(value, date):
    return f'{value}-{date}'


class Dictionary(models.Model):
    title = models.CharField(max_length=50, blank=False)
    slug = models.SlugField(max_length=50, blank=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    date_create = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_create = datetime.datetime.now()
            self.slug = get_slug(self.title, self.date_create)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['date_create']

    def __str__(self):
        return self.title


class Word(models.Model):
    value = models.CharField(max_length=50, blank=False, null=False)
    transcription = models.CharField(max_length=50, blank=True)
    translation = models.CharField(max_length=50, blank=True)
    slug = models.SlugField(max_length=50, blank=True)
    dictionary = models.ForeignKey(Dictionary, related_name='words', on_delete=models.CASCADE)
    date_create = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_create = datetime.datetime.now()
            self.slug = get_slug(self.value, self.date_create)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['date_create']

    def __str__(self):
        return self.value
