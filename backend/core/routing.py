import django_eventstream
from channels.http import AsgiHandler
from channels.routing import URLRouter
from django.conf.urls import url

urlpatterns = [
    url(r"^events/", URLRouter(django_eventstream.routing.urlpatterns),),
    url(r"", AsgiHandler),
]
