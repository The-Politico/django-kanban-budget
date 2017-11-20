from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .celery import close_issue, sync_issue
from .models import Todo


@receiver(post_delete, sender=Todo)
def deleted_todo(sender, instance, **kwargs):
    if instance.project.github:
        close_issue.delay(
            repo_url=instance.project.github,
            issue_url=instance.github_url
        )


@receiver(post_save, sender=Todo)
def saved_todo(sender, instance, created, **kwargs):
    if instance.project.github:
        sync_issue.delay(pk=instance.pk)
