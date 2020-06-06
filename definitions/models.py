from django.db import models
from django.contrib.auth.models import User

import datetime
import time


def get_slug(value):
    time_slug = time.time()
    time_slug = str(time_slug).replace('.', '')
    return f'{value}_{time_slug}'


class Dictionary(models.Model):
    title = models.CharField(max_length=50, blank=False)
    slug = models.SlugField(max_length=50, blank=True)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='definitions_dictionaries')
    date_create = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_create = datetime.datetime.now()
            self.slug = get_slug(self.title)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['date_create']

    def __str__(self):
        return self.title


class Word(models.Model):
    value = models.CharField(max_length=50, blank=False, null=False)
    definition = models.CharField(max_length=500, blank=True)
    slug = models.SlugField(max_length=50, blank=True)
    dictionary = models.ForeignKey(Dictionary, related_name='words', on_delete=models.CASCADE)
    date_create = models.DateTimeField()
    color = models.CharField(max_length=7, blank=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_create = datetime.datetime.now()
            self.slug = get_slug(self.value)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['date_create']

    def __str__(self):
        return self.value
