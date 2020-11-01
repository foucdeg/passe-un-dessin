"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""

import os

import django
import django_eventstream
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "passe_un_dessin.settings.prod")
django.setup()
# application = get_default_application()

application = ProtocolTypeRouter(
    {
        "http": URLRouter(
            [
                url(r"^events/", URLRouter(django_eventstream.routing.urlpatterns),),
                url(r"", get_asgi_application()),
            ]
        )
        # Just HTTP for now. (We can add other protocols later.)
    }
)
