import hmac
from hashlib import sha1

from django.conf import settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import secure
from .celery import create_todo, delete_todo
from .forms import FullProjectForm, ShortProjectForm
from .models import Board, Project


class SecureAuthorCreateView(CreateView):
    """A login-required class-based create view that saves author from user."""

    def form_valid(self, form):
        redirect_url = super(SecureAuthorCreateView, self).form_valid(form)
        obj = form.save()
        if not obj.author:
            obj.author = self.request.user
            obj.save()
        return redirect_url


@secure
class HomeView(TemplateView):
    template_name = "budget/home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['main_boards'] = Board.objects.filter(icon__isnull=False)
        context['project_boards'] = Board.objects.filter(icon__isnull=True)
        return context


@secure
class BoardDetail(DetailView):
    model = Board
    context_object_name = 'board'

    def get_context_data(self, **kwargs):
        context = super(BoardDetail, self).get_context_data(**kwargs)
        context['token'] = getattr(settings, 'BUDGET_SECRET_TOKEN')
        context['root'] = reverse('budget-boards')
        return context


@secure
class ProjectCreate(SecureAuthorCreateView):
    model = Project
    form_class = FullProjectForm

    def get_success_url(self):
        return reverse(
            'budget-boards-detail',
            args=[self.object.status.board.slug])


@secure
class ShortProjectCreate(SecureAuthorCreateView):
    model = Project
    form_class = ShortProjectForm
    template_name = 'budget/project_pitch.html'

    def get_success_url(self):
        return reverse(
            'budget-boards-detail',
            args=[self.object.status.board.slug])


@secure
class ProjectUpdate(UpdateView):
    model = Project
    form_class = FullProjectForm

    def get_success_url(self):
        project = Project.objects.get(slug=self.kwargs['slug'])
        return reverse(
            'budget-boards-detail',
            args=[project.status.board.slug])


@secure
class ProjectDelete(DeleteView):
    model = Project

    def get_success_url(self):
        return reverse(
            'budget-boards-detail',
            args=[self.object.status.board.slug])


class GithubWebhook(APIView):
    def verify_request(self, request):
        """
        Verify request is from Github using secret token.
        """
        SECRET = getattr(settings, 'BUDGET_SECRET_TOKEN', None)
        if not SECRET:
            return True
        header_signature = request.META.get('HTTP_X_HUB_SIGNATURE')
        if not header_signature:
            return False
        sha_name, signature = header_signature.split('=')
        if sha_name != 'sha1':
            return False
        mac = hmac.new(
            force_bytes(SECRET),
            msg=force_bytes(request.body),
            digestmod=sha1
        )
        if not hmac.compare_digest(
            force_bytes(mac.hexdigest()),
            force_bytes(signature)
        ):
            return False
        return True

    def post(self, request, *args, **kwargs):
        """
        Respond to incoming github webhook for issue events.
        """

        if not self.verify_request(request):
            return Response(status=status.HTTP_403_FORBIDDEN)

        payload = request.data
        action = payload.get('action')
        repo_url = payload.get('repository').get('html_url')
        title = payload.get('issue').get('title')
        issue_url = payload.get('issue').get('html_url')

        if action == 'opened' or action == 'reopened':
            create_todo.delay(repo_url, issue_url, title)
        elif action == 'closed':
            delete_todo.delay(issue_url)

        return Response(status=status.HTTP_200_OK)
