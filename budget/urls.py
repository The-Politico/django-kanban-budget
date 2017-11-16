from django.conf.urls import include, url
from rest_framework import routers

from .views import (BoardDetail, BoardViewSet, ColumnViewSet, HomeView,
                    ProjectCreate, ProjectDelete, ProjectUpdate,
                    ProjectViewSet, ShortProjectCreate, TagViewSet,
                    TypeViewSet)

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'boards', BoardViewSet)
router.register(r'columns', ColumnViewSet)
router.register(r'types', TypeViewSet)
router.register(r'tags', TagViewSet)


urlpatterns = [
    url(r'^$', HomeView.as_view(), name='budget-boards'),
    url(r'^(?P<slug>[-\w]+)/$', BoardDetail.as_view(),
        name='budget-boards-detail'),
    url(r'^projects/create/$', ProjectCreate.as_view(),
        name='budget-projects-create'),
    url(r'projects/pitch/$', ShortProjectCreate.as_view(),
        name='budget-projects-pitch'),
    url(r'^projects/edit/(?P<slug>[-\w]+)/$', ProjectUpdate.as_view(),
        name='budget-projects-edit'),
    url(r'^projects/delete/(?P<slug>[-\w]+)/$', ProjectDelete.as_view(),
        name='budget-projects-delete'),
    url(r'^api/', include(router.urls)),
]
