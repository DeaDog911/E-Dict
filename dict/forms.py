from django import forms

from . import models


class CreateDictForm(forms.ModelForm):
    class Meta:
        model = models.Dictionary
        fields = ['title', 'language']

        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-controller'}),
            'language': forms.TextInput(attrs={'class': 'form-controller'}),
        }