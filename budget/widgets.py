from django.forms.widgets import SelectMultiple, TextInput


class ColorInput(TextInput):
    input_type = 'color'


class DateInput(TextInput):
    input_type = 'date'


class MultiSelect(SelectMultiple):
    template_name = 'budget/forms/select.html'
