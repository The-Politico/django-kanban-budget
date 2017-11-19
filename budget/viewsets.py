from django.contrib.auth.models import User
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .authentication import TokenAPIAuthentication
from .models import Board, Column, Project, Tag, Todo, Type
from .serializers import (BoardSerializer, ColumnSerializer, ProjectSerializer,
                          TagSerializer, TodoSerializer, TypeSerializer,
                          UserSerializer)


class TokenAuthedViewSet(viewsets.ModelViewSet):
    """
    ViewSet class that restricts views to our bots token.

    Also disables the default pagination.
    """

    authentication_classes = (TokenAPIAuthentication,)
    permission_classes = (IsAuthenticated,)
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


class ProjectViewSet(TokenAuthedViewSet):
    queryset = Project.objects.filter(archive=False)
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    filter_class = StatusFilter
    filter_backends = (filters.DjangoFilterBackend,)


class ColumnViewSet(TokenAuthedViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    lookup_field = 'slug'
    filter_class = BoardFilter
    filter_backends = (filters.DjangoFilterBackend,)


class BoardViewSet(TokenAuthedViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    lookup_field = 'slug'


class TagViewSet(TokenAuthedViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'


class TypeViewSet(TokenAuthedViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    lookup_field = 'slug'


class TodoViewset(TokenAuthedViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class UserViewset(TokenAuthedViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
