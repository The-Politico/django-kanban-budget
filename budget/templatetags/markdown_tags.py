from django import template

import markdown

register = template.Library()


@register.filter
def render_markdown(value):
    return markdown.markdown(value)
