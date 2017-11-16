from django.db import models
from django.utils.html import format_html

from .slugged import SluggedModel


class Type(SluggedModel):
    """Types are a special type of tag with visual significance on a board."""

    def swatch(self):
        return format_html(
            '<i class="fa fa-square fa-2x" style="color:{};"></i>'.format(
                self.color
            )
        )

    color = models.CharField(max_length=7, unique=True)
