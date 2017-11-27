from django.conf.urls import include, url
from rest_framework import routers

from .views import BoardDetail, GithubWebhook, HomeView
from .viewsets import (BoardViewSet, ColumnViewSet, ProjectViewSet, TagViewSet,
                       TodoViewset, TypeViewSet, UserViewset)

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'boards', BoardViewSet)
router.register(r'columns', ColumnViewSet)
router.register(r'types', TypeViewSet)
router.register(r'tags', TagViewSet)
router.register(r'todos', TodoViewset)
router.register(r'users', UserViewset)


urlpatterns = [
    url(r'^$', HomeView.as_view(), name='budget-boards'),
    url(r'^api/', include(router.urls)),
    url(r'^webhook/github/$', GithubWebhook.as_view()),
    url(r'^(?P<slug>[-\w]+)/$', BoardDetail.as_view(),
        name='budget-boards-detail'),
]
