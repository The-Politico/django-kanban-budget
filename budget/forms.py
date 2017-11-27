from django import forms

from .models import Type
from .widgets import ColorInput


class TypeForm(forms.ModelForm):
    class Meta:
        model = Type
        fields = [
            'name',
            'color',
        ]
        widgets = {
            'color': ColorInput(),
        }
