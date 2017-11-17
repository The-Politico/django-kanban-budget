import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'budgetapp.settings')

app = Celery('budgetapp')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.update(
  task_serializer='json'
)
# Use synchronous tasks in local dev
if settings.DEBUG:
    app.conf.update(task_always_eager=True)
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS, related_name='celery')
