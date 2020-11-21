# flake8: noqa
import os

import requests

from .base import *

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = False

ALLOWED_HOSTS = [
    "passe-un-dessin.fouc.net",
]

if "ALLOWED_HOST" in os.environ:
    ALLOWED_HOSTS.append(os.environ.get("ALLOWED_HOST"))

INSTALLED_APPS = INSTALLED_APPS + ["storages"]

CORS_ALLOWED_ORIGINS = [
    "https://passe-un-dessin.fouc.net",
    "https://passeundessin.com",
]

# Secure connection
SECURE_REDIRECT_EXEMPT = [r"/?health"]

DEFAULT_FROM_EMAIL = "contact@passe-un-dessin.fouc.net"
EVENTSTREAM_ALLOW_ORIGIN = "passe-un-dessin.fouc.net"

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler",}},
    "loggers": {"django": {"handlers": ["console"]},},
}


# Caching
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "application_cache",
    }
}
