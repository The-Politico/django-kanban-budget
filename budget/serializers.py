import operator

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Board, Column, Project, Tag, Todo, Type

REPORTER_ATTR = getattr(settings, 'BUDGET_REPORTER_ATTR', 'is_staff')
EDITOR_ATTR = getattr(settings, 'BUDGET_EDITOR_ATTR', 'is_staff')
DEVELOPER_ATTR = getattr(settings, 'BUDGET_DEVELOPER_ATTR', 'is_superuser')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    reporter = serializers.SerializerMethodField()
    editor = serializers.SerializerMethodField()
    developer = serializers.SerializerMethodField()

    def get_reporter(self, obj):
        f = operator.attrgetter(REPORTER_ATTR)
        return f(obj) is True  # force to boolean

    def get_editor(self, obj):
        f = operator.attrgetter(EDITOR_ATTR)
        return f(obj) is True  # force to boolean

    def get_developer(self, obj):
        f = operator.attrgetter(DEVELOPER_ATTR)
        return f(obj) is True  # force to boolean

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'last_name',
            'first_name',
            'email',
            'reporter',
            'editor',
            'developer',
        )


class TodoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Todo
        fields = ('id', 'title', 'github_url', 'created')


class TagSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Tag
        fields = ('slug', 'name')


class TypeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Type
        fields = ('slug', 'name', 'color')


class BoardSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Board
        fields = (
            'slug',
            'name',
            'position',
        )


class ColumnSerializer(serializers.HyperlinkedModelSerializer):
    board = serializers.SlugRelatedField(
        many=False,
        slug_field='slug',
        queryset=Board.objects.all()
    )

    class Meta:
        model = Column
        fields = (
            'slug',
            'name',
            'board',
            'position',
        )


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    status = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Column.objects.all()
    )
    editors = UserSerializer(many=True, read_only=True)
    reporters = UserSerializer(many=True, read_only=True)
    developers = UserSerializer(many=True, read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Tag.objects.all()
    )
    type = TypeSerializer(read_only=True)
    edit_url = serializers.URLField(source='get_absolute_url')
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            'slug',
            'name',
            'description',
            'status',
            'run_date',
            'preview_url',
            'publish_url',
            'edit_url',
            'github',
            'gdoc',
            'reporters',
            'editors',
            'developers',
            'notes',
            'type',
            'tags',
            'position',
            'todos'
        )
