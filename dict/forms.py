from django import forms

from . import models


class CreateDictForm(forms.ModelForm):
    class Meta:
        model = models.Dictionary
        fields = ['title', ]

        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-controller'}),
        }
