from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Board, Column, Project, Tag, Type


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'last_name')


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
        )
