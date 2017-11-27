import markdown
from django import template

register = template.Library()


@register.filter
def render_markdown(value):
    return markdown.markdown(value) if value else ''
