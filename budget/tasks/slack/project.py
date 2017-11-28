import os
import time

from budget.models import Project
from budget.tasks.slack import DOMAIN, get_client
from celery import shared_task
from django.urls import reverse


@shared_task
def new_project(pk):
    client = get_client()
    if not client:
        return

    project = Project.objects.get(pk=pk)
    board = project.status.board

    if not board.slack_channel:
        return

    board_url = os.path.join(
        DOMAIN,
        reverse('budget-boards-detail', kwargs={'slug': board.slug})[1:]
    )

    attachment_data = [{
        'fallback': '🚨 New project on the budget:',
        'color': '#6DA9CC',
        'pretext': '🚨 New project on the budget:',
        'mrkdwn_in': ['fields'],
        'title': board.name,
        'title_link': board_url,
        'fields': [{
            'title': project.name,
            'value': project.description,
            'short': False
        }],
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
