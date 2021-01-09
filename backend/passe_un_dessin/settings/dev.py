# flake8: noqa
from .base import *

SECRET_KEY = "7fa46eac0d17153de228807ea8f4c1202d99b8367140e3632c"
DEBUG = True
INTERNAL_IPS = ["127.0.0.1", "172.16.132.1"]

INSTALLED_APPS = INSTALLED_APPS + ["debug_toolbar", "django_extensions"]

MIDDLEWARE = MIDDLEWARE + ["debug_toolbar.middleware.DebugToolbarMiddleware"]

MAIN_FRONTEND = "https://localhost:3000"

# Uploaded files storage
MEDIA_ROOT = "/uploads/"
MEDIA_URL_PATH = "uploads/"
MEDIA_URL = "http://localhost:3000/" + MEDIA_URL_PATH

# Caching
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",
        "LOCATION": "/var/tmp/django_cache",
    }
}

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]", "192.168.1.72"]

DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": lambda request: request.META["SERVER_NAME"]
    != "testserver"
}

CORS_ALLOWED_ORIGINS = [
    "https://localhost:3000",
]
EVENTSTREAM_ALLOW_ORIGIN = "*"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler",},},
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
        },
        "core.service.game_service": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "DEBUG"),
        },
        "core.views.room_management": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "DEBUG"),
        },
    },
}
