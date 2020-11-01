import django_eventstream
from channels.http import AsgiHandler
from channels.routing import URLRouter
from django.conf.urls import url
from django.core.asgi import get_asgi_application
from django_eventstream.routing import consumers

urlpatterns = [
    url(r"^events/", URLRouter([url(r"^$", consumers.EventsConsumer.as_asgi())])),
    url(r"", get_asgi_application()),
]
