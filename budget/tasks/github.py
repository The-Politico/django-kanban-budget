from celery import shared_task

from budget.github import Github
from budget.models import Todo


@shared_task
def close_issue(repo_url, issue_url):
    client = Github()
    repo = client.get_repo_by_url(repo_url)
    instance = repo.get_issue_by_url(issue_url)
    if instance and instance.state == 'open':
        instance.edit(state='closed')


@shared_task
def create_todo(repo_url, issue_url, title):
    Todo.objects.create_for_project(repo_url, issue_url, title)


@shared_task
def delete_todo(issue_url):
    Todo.objects.delete_for_project(issue_url)


@shared_task
def sync_issue_title(repo_url, issue_url, title):
    client = Github()
    repo = client.get_repo_by_url(repo_url)
    instance = repo.get_issue_by_url(issue_url)
    if instance and instance.title != title:
        instance.edit(title=title)
