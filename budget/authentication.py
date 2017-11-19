from importlib import import_module

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.utils.decorators import method_decorator
from rest_framework import authentication, exceptions


class TokenAPIAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # Don't enforce if DEBUG
        if settings.DEBUG:
            return (AnonymousUser, None)
        try:
            # Per DRF token auth, token is prefixed by string
            # literal "Token" plus whitespace, e.g., "Token <AUTHTOKEN>"
            token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        except:
            raise exceptions.AuthenticationFailed(
                'No token or incorrect token format')

        if token == getattr(settings, 'BUDGET_SECRET_TOKEN'):
            return (AnonymousUser, None)
        raise exceptions.AuthenticationFailed('Unauthorized')


def import_class(val):
    """Attempt to import a class from a string representation.
    Pattern borrowed from Django REST Framework.
    See rest_framework/settings.py#L170-L182
    """
    try:
        parts = val.split('.')
        module_path, class_name = '.'.join(parts[:-1]), parts[-1]
        module = import_module(module_path)
        return getattr(module, class_name)
    except (ImportError, AttributeError) as e:
        msg = "Could not import auth/permission class '{}'. {}: {}.".format(
            val,
            e.__class__.__name__,
            e)
        raise ImportError(msg)


def secure(view):
    """Set an auth decorator applied for views.
    If DEBUG is on, we serve the view without authenticating.
    Default is 'django.contrib.auth.decorators.login_required'.
    Can also be 'django.contrib.admin.views.decorators.staff_member_required'
    or a custom decorator.
    """
    AUTH = getattr(
        settings,
        'BUDGET_AUTH_DECORATOR',
        'django.contrib.auth.decorators.login_required'
    )
    auth_decorator = import_class(AUTH)
    return (
        view if settings.DEBUG
        else method_decorator(auth_decorator, name='dispatch')(view)
    )
