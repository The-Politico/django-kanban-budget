from django.contrib import admin

from .forms import TypeForm
from .models import Board, Column, Project, Tag, Todo, Type


class TypeAdmin(admin.ModelAdmin):
    form = TypeForm
    list_display = [
        'name',
        'swatch',
    ]


class ColumnInlineAdmin(admin.TabularInline):
    model = Column
    extra = 0


class BoardAdmin(admin.ModelAdmin):
    inlines = [
        ColumnInlineAdmin,
    ]


class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'slug',
        'name',
        'status',
        'position',
        'archive',
    ]
    ordering = (
        'status',
        'status__position',
    )
    list_editable = [
        'archive',
    ]


admin.site.register(Project, ProjectAdmin)
admin.site.register(Tag)
admin.site.register(Todo)
admin.site.register(Type, TypeAdmin)
admin.site.register(Board, BoardAdmin)
