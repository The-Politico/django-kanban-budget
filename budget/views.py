from django.urls import reverse
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import get_bot_token
from .celery import create_todo, delete_todo
from .forms import FullProjectForm, ShortProjectForm
from .mixins import LoginRequiredMixin, StaffRequiredMixin
from .models import Board, Project


class SecureAuthorCreateView(LoginRequiredMixin, CreateView):
    """A login-required class-based create view that saves author from user."""

    def form_valid(self, form):
        redirect_url = super(SecureAuthorCreateView, self).form_valid(form)
        obj = form.save()
        if not obj.author:
            obj.author = self.request.user
            obj.save()
        return redirect_url


class HomeView(StaffRequiredMixin, TemplateView):
    template_name = "budget/home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['main_boards'] = Board.objects.filter(icon__isnull=False)
        context['project_boards'] = Board.objects.filter(icon__isnull=True)
        return context


class BoardDetail(StaffRequiredMixin, DetailView):
    model = Board
    context_object_name = 'board'

    def get_context_data(self, **kwargs):
        context = super(BoardDetail, self).get_context_data(**kwargs)
        context['token'] = get_bot_token()
        return context


class ProjectCreate(SecureAuthorCreateView):
    model = Project
    form_class = FullProjectForm

    def get_success_url(self):
        return reverse(
            'budget-boards-detail',
            args=[self.object.status.board.slug])


class ShortProjectCreate(SecureAuthorCreateView):
    model = Project
    form_class = ShortProjectForm
    template_name = 'budget/project_pitch.html'

    def get_success_url(self):
        return reverse(
            'budget-boards-detail',
            args=[self.object.status.board.slug])


class ProjectUpdate(StaffRequiredMixin, UpdateView):
    model = Project
    form_class = FullProjectForm

    def get_success_url(self):
        project = Project.objects.get(slug=self.kwargs['slug'])
        return reverse(
            'budget-boards-detail',
            args=[project.status.board.slug])


class ProjectDelete(StaffRequiredMixin, DeleteView):
    model = Project

    def get_success_url(self):
        return reverse(
            'budget-boards-detail',
            args=[self.object.status.board.slug])


class GithubWebhook(APIView):
    def post(self, request, *args, **kwargs):
        """
        Respond to incoming github webhook for issue events.
        """
        payload = request.data
        action = payload.get('action')
        repo = payload.get('repository')
        repo_url = repo.get('html_url')
        issue = payload.get('issue')
        title = issue.get('title')
        issue_url = issue.get('html_url')
        if action == 'opened' or action == 'reopened':
            create_todo.delay(repo_url, issue_url, title)
        elif action == 'closed':
            delete_todo.delay(issue_url)

        return Response(status=status.HTTP_200_OK)
