from django.db import models

from .slugged import SluggedModel


class Board(SluggedModel):
    """Boards reflect separate workflows."""

    position = models.PositiveSmallIntegerField(
        default=0,
        help_text='Board sort order'
    )

    icon = models.CharField(
        blank=True, null=True, max_length=100,
        help_text="Add a fontawesome class to add icon and promote \
board on homepage.")

    description = models.CharField(blank=True, null=True, max_length=250)

    @property
    def project_count(self):
        return sum([b.project_count for b in self.column_set.all()])

    class Meta:
        ordering = ['position']
