from django_filters import rest_framework as filters
from rest_framework import viewsets

from .authentication import InteractivesBotAuthentication
from .models import Board, Column, Project, Tag, Type
from .permissions import InteractivesBotPermission
from .serializers import (BoardSerializer, ColumnSerializer, ProjectSerializer,
                          TagSerializer, TypeSerializer)


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
