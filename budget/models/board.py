from django.db import models

from .slugged import SluggedModel


class Board(SluggedModel):
    """Boards reflect separate workflows."""

    position = models.PositiveSmallIntegerField(
        default=0,
        help_text='Board sort order'
    )

    description = models.CharField(blank=True, null=True, max_length=250)

    slack_channel = models.CharField(
        blank=True, null=True,
        max_length=250,
        help_text="A channel to notify with activity, e.g., #my-channel."
    )

    @property
    def project_count(self):
        return sum([b.project_count for b in self.columns.all()])

    class Meta:
        ordering = ['position']
