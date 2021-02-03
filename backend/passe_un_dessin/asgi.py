"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""
import os

import django
from channels.routing import get_default_application
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "passe_un_dessin.settings.prod")
django.setup()
application = SentryAsgiMiddleware(get_default_application())
