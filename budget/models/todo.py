from budget.models import Project
from django.core.exceptions import ObjectDoesNotExist
from django.db import models


class TodoManager(models.Manager):
    def create_for_project(self, repo_url, issue_url, title):
        try:
            project = Project.objects.get(github=repo_url)
        except ObjectDoesNotExist:
            return None
        todo, created = self.update_or_create(
            project=project,
            github_url=issue_url,
            defaults={
                'title': title
            }
        )
        return todo

    def delete_for_project(self, issue_url):
        self.filter(github_url=issue_url).delete()


class Todo(models.Model):
    """Todos usually represent github issues
    but they can also be made manually."""
    project = models.ForeignKey(Project, related_name='todos')
    title = models.CharField(max_length=250)
    github_url = models.URLField(
        blank=True, null=True, unique=True, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    objects = TodoManager()

    def __str__(self):
        return self.title
