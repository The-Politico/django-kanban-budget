from django.conf import settings

from rest_framework import permissions


class InteractivesBotPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        # Don't enforce if DEBUG
        if settings.DEBUG:
            return True
        return True  # TODO
