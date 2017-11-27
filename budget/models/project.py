from budget.github import Github
from budget.models import Column
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.db import models
from uuslug import uuslug


class Project(models.Model):
    """Projects are kanban cards. The atomic unit of our workflow."""

    def get_default_column():
        return Column.objects.get_or_create(name='Pitched')[0]

    def get_absolute_url(self):
        return reverse('budget-projects-edit', kwargs={'slug': self.slug})

    def get_repo(self):
        if self.github:
            client = Github()
            return client.get_repo_by_url(self.github)
        return None

    def get_open_issues(self):
        repo = self.get_repo()
        if repo:
            return repo.get_open_issues()
        return None

    name = models.CharField(max_length=250)
    slug = models.SlugField(
        blank=True, max_length=255, unique=True, editable=False
    )

    description = models.TextField(
        max_length=250,
        help_text="Short description of the project (250 characters)."
    )

    run_date = models.DateTimeField(
        null=True, blank=True,
        help_text="Estimated."
    )

    preview_url = models.URLField(blank=True, null=True)
    publish_url = models.URLField(blank=True, null=True)
    github = models.URLField(
        blank=True, null=True, unique=True,
        help_text="HTML url for repository")
    gdoc = models.URLField(blank=True, null=True)

    notes = models.TextField(blank=True, null=True)

    reporters = models.ManyToManyField(
        User,
        blank=True,
        related_name='reporters'
    )
    editors = models.ManyToManyField(
        User,
        blank=True,
        related_name='editors'
    )
    developers = models.ManyToManyField(
        User,
        blank=True,
        related_name='developers'
    )

    status = models.ForeignKey(
        'Column',
        default=get_default_column,
        on_delete=models.PROTECT,
        related_name='projects'
    )

    type = models.ForeignKey(
        'Type', blank=True, null=True, on_delete=models.SET_NULL
    )

    tags = models.ManyToManyField(
        'Tag', blank=True,
        related_name='tags'
    )

    position = models.PositiveSmallIntegerField(
        default=0,
        help_text='Top to bottom sort order of projects in a column'
    )

    archive = models.BooleanField(
        default=False, help_text="Removes project from all boards"
    )

    author = models.ForeignKey(
        User,
        null=True, on_delete=models.SET_NULL, related_name="%(class)s_authors")

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = uuslug(
                self.name,
                instance=self,
                max_length=255,
                separator='-',
                start_no=2
            )
        return super(Project, self).save(*args, **kwargs)
