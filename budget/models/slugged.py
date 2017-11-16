from django.contrib.auth.models import User
from django.db import models

from uuslug import uuslug


class SluggedModel(models.Model):
    """Model slugged from a name field."""

    name = models.CharField(max_length=250)
    slug = models.SlugField(
        blank=True, max_length=255, unique=True, editable=False
    )

    def save(self, *args, **kwargs):
        self.slug = uuslug(
            self.name,
            instance=self,
            max_length=255,
            separator='-',
            start_no=2
        )
        return super(SluggedModel, self).save(*args, **kwargs)

    def __str__(self): # noqa
        return self.name

    class Meta:
        abstract = True


class SluggedContentModel(SluggedModel):
    """Some basic fields for all kinds of content."""

    author = models.ForeignKey(
        User,
        null=True, on_delete=models.SET_NULL, related_name="%(class)s_authors")

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
