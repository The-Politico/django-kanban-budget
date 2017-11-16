from django import forms
from django.contrib.auth.models import User

from .models import Project, Type
from .widgets import ColorInput, MultiSelect


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


class FullProjectForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        super(FullProjectForm, self).__init__(*args, **kwargs)
        self.fields['reporters'].queryset = User.objects.filter(is_staff=True)
        self.fields['editors'].queryset = User.objects.filter(is_staff=True)
        self.fields['developers'].queryset = User.objects.filter(
            is_superuser=True)

    class Meta:
        model = Project
        fields = [
            'name',
            'description',
            'run_date',
            'status',
            'preview_url',
            'publish_url',
            'github',
            'gdoc',
            'reporters',
            'editors',
            'developers',
            'tags',
            'type',
            'notes',
            'archive',
        ]
        widgets = {
            'reporters': MultiSelect(),
            'editors': MultiSelect(),
            'developers': MultiSelect(),
            'tags': MultiSelect(),
        }


class ShortProjectForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        super(ShortProjectForm, self).__init__(*args, **kwargs)
        self.fields['name'].label = "Title"
        self.fields['reporters'].queryset = User.objects.filter(is_staff=True)
        self.fields['editors'].queryset = User.objects.filter(is_staff=True)

    class Meta:
        model = Project
        fields = [
            'name',
            'run_date',
            'description',
            'reporters',
            'editors',
            'status',
        ]
        widgets = {
            'reporters': MultiSelect(),
            'editors': MultiSelect(),
            'status': forms.HiddenInput(),
        }
