# flake8: noqa
import os

import requests

from .base import *

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = False

ALLOWED_HOSTS = [
    "passeundessin.com",
]

if "ALLOWED_HOST" in os.environ:
    ALLOWED_HOSTS.append(os.environ.get("ALLOWED_HOST"))

CORS_ORIGIN_WHITELIST = [
    "https://passeundessin.fouc.net",
    "https://drawaround.fouc.net"
]

INSTALLED_APPS = INSTALLED_APPS + ["storages"]

# Secure connection
SECURE_REDIRECT_EXEMPT = [r"/?health"]

DEFAULT_FROM_EMAIL = "contact@passeundessin.com"
EVENTSTREAM_ALLOW_ORIGIN = "passeundessin.com"

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
