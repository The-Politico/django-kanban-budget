from django.db import models

from budget.models import Project


class Todo(models.Model):
    project = models.ForeignKey(Project, related_name='todos')
    title = models.CharField(max_length=250)
    github_url = models.URLField(blank=True, null=True)
