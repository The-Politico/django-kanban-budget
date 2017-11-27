from budget.github import Github
from budget.models import Todo
from celery import shared_task


@shared_task
def close_issue(repo_url, issue_url):
    client = Github()
    if not client:
        return
    repo = client.get_repo_by_url(repo_url)
    issue = repo.get_issue_by_url(issue_url)
    if issue and issue.state == 'open':
        issue.edit(state='closed')


@shared_task
def create_todo(repo_url, issue_url, title):
    Todo.objects.create_for_project(repo_url, issue_url, title)


@shared_task
def delete_todo(issue_url):
    Todo.objects.filter(github_url=issue_url).delete()


@shared_task
def sync_todo(issue_url, title):
    Todo.objects.filter(github_url=issue_url).update(title=title)


@shared_task
def sync_issue(pk):
    """
    Sync an issue to github.

    Create an issue if one doesn't exist. Edit a title if changed.
    """
    todo = Todo.objects.get(pk=pk)
    client = Github()
    if not client:
        return
    repo = client.get_repo_by_url(todo.project.github)
    if todo.github_url:
        issue = repo.get_issue_by_url(todo.github_url)
        if issue and issue.title != todo.title:
            issue.edit(title=todo.title)
    else:
        issue = repo.create_issue(title=todo.title)
        Todo.objects.filter(pk=pk).update(github_url=issue.html_url)
