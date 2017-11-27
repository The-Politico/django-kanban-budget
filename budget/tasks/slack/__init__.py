from slacker import Slacker
from django.conf import settings

SLACK_TOKEN = getattr(settings, 'BUDGET_SLACK_TOKEN', None)
DOMAIN = getattr(settings, 'BUDGET_DOMAIN', 'http://localhost:8000')


def get_client():
    if SLACK_TOKEN:
        return Slacker(SLACK_TOKEN)
    return None
