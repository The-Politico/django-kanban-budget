from django.db import models

from .slugged import SluggedModel


class Tag(SluggedModel):
    """Arbitrary tags associated with projects."""

    name = models.CharField(max_length=250, unique=True)
