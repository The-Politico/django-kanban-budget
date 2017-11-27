from budget.celery import board_status
from budget.models import Board
from django.core.exceptions import ObjectDoesNotExist
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('slug', nargs='+')

    def handle(self, *args, **options):
        for slug in options['slug']:
            try:
                board = Board.objects.get(slug=slug)
            except ObjectDoesNotExist:
                print('Couldn\'t find board {}.'.format(slug))
            board_status.delay(board.pk)
