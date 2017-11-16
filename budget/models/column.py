from django.db import models

from budget.models import Board

from .slugged import SluggedModel


class Column(SluggedModel):
    """Columns represent different statuses within a workflow."""

    def get_default_board():
        return Board.objects.get_or_create(name="Pitches")[0]

    board = models.ForeignKey(
        'Board',
        default=get_default_board,
        on_delete=models.PROTECT
    )
    position = models.PositiveSmallIntegerField(
        default=0,
        help_text='Left to right position of status column'
    )

    @property
    def project_count(self):
        return self.project_set.filter(archive=False).count()

    def __str__(self): # noqa
        return '{} - {}'.format(self.board.name, self.name)

    class Meta:
        ordering = ['board', 'position']
