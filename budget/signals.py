from django.db.models.signals import post_delete
from django.dispatch import receiver

from .celery import close_issue
from .models import Todo


@receiver(post_delete, sender=Todo)
def close_todo(sender, instance, **kwargs):
    if instance.project.github:
        close_issue.delay(
            repo_url=instance.project.github,
            issue_url=instance.github_url
        )
