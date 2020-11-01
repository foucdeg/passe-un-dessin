"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""

import os

import django
import django_eventstream
from channels.routing import get_default_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "passe_un_dessin.settings.prod")
django.setup()
application = get_default_application()
