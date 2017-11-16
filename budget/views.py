from django.urls import reverse
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from django_filters import rest_framework as filters
from rest_framework import viewsets

from .authentication import InteractivesBotAuthentication, get_bot_token
from .forms import FullProjectForm, ShortProjectForm
from .mixins import LoginRequiredMixin, StaffRequiredMixin
from .models import Board, Column, Project, Tag, Type
from .permissions import InteractivesBotPermission
from .serializers import (BoardSerializer, ColumnSerializer, ProjectSerializer,
                          TagSerializer, TypeSerializer)


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


############
# ViewSets #
############


class BotAuthedViewSet(viewsets.ModelViewSet):
    """
    ViewSet class that restricts views to our bots token.

    Also disables the default pagination.
    """

    authentication_classes = (InteractivesBotAuthentication,)
    permission_classes = (InteractivesBotPermission,)
    paginator = None


class StatusFilter(filters.FilterSet):
    status = filters.CharFilter(name='status__slug')

    class Meta:
        model = Project
        fields = ['status']


class BoardFilter(filters.FilterSet):
    board = filters.CharFilter(name='board__slug')

    class Meta:
        model = Column
        fields = ['board']


class ProjectViewSet(BotAuthedViewSet):
    queryset = Project.objects.filter(archive=False)
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    filter_class = StatusFilter


class ColumnViewSet(BotAuthedViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    lookup_field = 'slug'
    filter_class = BoardFilter


class BoardViewSet(BotAuthedViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    lookup_field = 'slug'


class TagViewSet(BotAuthedViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'


class TypeViewSet(BotAuthedViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    lookup_field = 'slug'
