import datetime
import os
import time

import pytz

from budget.models import Board
from budget.tasks.slack import DOMAIN, get_client
from celery import shared_task
from django.conf import settings
from django.urls import reverse


def format_developers(project):
    if project.developers.count() == 0:
        return ''
    devs = [
        dev.last_name for dev in project.developers.all()
    ]
    if len(devs) == 0:
        return ''
    dev_string = ', '.join([
        dev for dev in list(set(devs))
        if dev is not None and dev is not ''
    ])
    return ' | _{}_'.format(dev_string)


def build_fields(board):
    fields = []
    for column in board.columns.all().order_by('position'):
        if column.projects.count() == 0:
            continue
        projects = '\n'.join([
            '✅ {}{}'.format(
                project.name,
                format_developers(project)
            )
            for project in column.projects.all()
        ])
        fields.append({
            "title": column.name,
            "value": projects,
            "short": False
        })
    return fields


def greeting():
    cur_time = datetime.datetime.now(
        tz=pytz.timezone(str(settings.TIME_ZONE))
    )
    if cur_time.hour < 12:
        return '☀️ Good morning!'
    elif 12 <= cur_time.hour < 18:
        return '🕶️ Good afternoon!'
    else:
        return '🌙 Good evening!'


@shared_task
def board_status(pk):
    client = get_client()
    if not client:
        return

    board = Board.objects.get(pk=pk)

    if not board.slack_channel:
        return

    board_url = os.path.join(
        DOMAIN,
        reverse('budget-boards-detail', kwargs={'slug': board.slug})[1:]
    )
    budget_url = os.path.join(
        DOMAIN,
        reverse('budget-boards')[1:]
    )
    attachment_data = [{
        'fallback': '{} Here\'s what we\'re working on:'.format(greeting()),
        'author_name': 'The Budget',
        'author_link': budget_url,
        'color': '#6DA9CC',
        'pretext': '{} Here\'s what we\'re working on:'.format(greeting()),
        'mrkdwn_in': ['fields'],
        'title': board.name,
        'title_link': board_url,
        'fields': build_fields(board),
        'footer': 'django-kanban-budget',
        'ts': int(time.time())
    }]
    client.chat.post_message(
        board.slack_channel,
        '',
        attachments=attachment_data,
        as_user=False,
        username='The Budget'
    )
