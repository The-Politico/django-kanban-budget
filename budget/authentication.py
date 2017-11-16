from django.conf import settings
from django.contrib.auth.models import AnonymousUser, User
from django.db import connection

from rest_framework import authentication, exceptions
from rest_framework.authtoken.models import Token

BOT_USERNAME = BOT_EMAIL = 'interactives@politico.com'

BOT, created = User.objects.get_or_create(
    username=BOT_USERNAME,
    email=BOT_EMAIL,
) if 'auth_user' in connection.introspection.table_names() else (None, False)


def get_bot_token():
    BOT_TOKEN, created = Token.objects.get_or_create(user=BOT) \
        if 'authtoken_token' in connection.introspection.table_names() else \
        (None, False)
    return BOT_TOKEN


class InteractivesBotAuthentication(authentication.BaseAuthentication):
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

        try:
            token = Token.objects.get(key=token)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed('Unauthorized')

        if token == get_bot_token():
            return (token.user, None)
        # Fall through to default authentication schemes
        return None
