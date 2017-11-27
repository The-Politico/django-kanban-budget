from budget.models import Board
from django.db import models

from .slugged import SluggedModel


class Column(SluggedModel):
    """Columns represent different statuses within a workflow."""

    board = models.ForeignKey(
        Board,
        on_delete=models.PROTECT,
        related_name='columns'
    )
    position = models.PositiveSmallIntegerField(
        default=0,
        help_text='Left to right position of status column'
    )

    @property
    def project_count(self):
        return self.projects.filter(archive=False).count()

    def __str__(self): # noqa
        return '{} - {}'.format(self.board.name, self.name)

    class Meta:
        ordering = ['board', 'position']
