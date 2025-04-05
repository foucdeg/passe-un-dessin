"""
Django settings for passe_un_dessin project.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

import dj_database_url
import sentry_sdk
from django.core.exceptions import ImproperlyConfigured
from sentry_sdk.integrations.django import DjangoIntegration

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "memoize",
    "rest_framework",
    "django_rest_passwordreset",
    "django_eventstream",
    "anymail",
    "corsheaders",
    # Our apps
    "suggestions",
    "twitch",
    "core",
]

AUTHENTICATION_BACKENDS = [
    # Django ModelBackend is the default authentication backend.
    "django.contrib.auth.backends.ModelBackend",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.gzip.GZipMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django_grip.GripMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "passe_un_dessin.sentry.RequestIdMiddleware",
]

ROOT_URLCONF = "passe_un_dessin.urls"

AUTH_USER_MODEL = "core.User"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "passe_un_dessin.wsgi.application"
ASGI_APPLICATION = "passe_un_dessin.routing.application"

EVENTSTREAM_STORAGE_CLASS = "django_eventstream.storage.DjangoModelStorage"
GRIP_URL = "http://{}:5561".format(os.environ.get("PUSHPIN_HOST"))

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {"default": dj_database_url.config()}

# Social auth
AUTH_GOOGLE_CLIENT_ID = os.getenv("AUTH_GOOGLE_CLIENT_ID")
AUTH_FACEBOOK_APP_ID = "2622893511372846"
AUTH_FACEBOOK_APP_SECRET = os.environ.get("AUTH_FACEBOOK_APP_SECRET")

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

USE_X_FORWARDED_HOST = True
# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/London"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "djangostatic")
STATIC_URL = "/djangostatic/"

# Base primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# Emails

EMAIL_BACKEND = "django_mailgun.MailgunBackend"
MAILGUN_SERVER_NAME = "email.passeundessin.com"

ANYMAIL = {
    "MAILGUN_API_KEY": os.getenv("MAILGUN_API_KEY"),
    "MAILGUN_SENDER_DOMAIN": MAILGUN_SERVER_NAME,
    "MAILGUN_API_URL": "https://api.eu.mailgun.net/v3",
}
EMAIL_BACKEND = "anymail.backends.mailgun.EmailBackend"

DEFAULT_FROM_EMAIL = "Passe un Dessin <noreply@{}>".format(MAILGUN_SERVER_NAME)
DEV_EMAILS = ["foucdeg@gmail.com", "quentin.somerville@gmail.com"]

TWITCH_CONFIG = {
    "CLIENT_ID": os.getenv("CLIENT_ID"),
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    "GAME_ID": 2094895819,
}

# Sentry
if "SENTRY_BACKEND_DSN" not in os.environ:
    raise ImproperlyConfigured("Missing SENTRY_BACKEND_DSN in environment")

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_BACKEND_DSN"),
    integrations=[DjangoIntegration()],
    environment=os.environ.get("ENVIRONMENT"),
    release=os.environ.get("VERSION"),
)

DJANGO_REST_PASSWORDRESET_NO_INFORMATION_LEAKAGE = True
DJANGO_REST_PASSWORDRESET_IP_ADDRESS_HEADER = "HTTP_X_FORWARDED_FOR"
DJANGO_REST_MULTITOKENAUTH_REQUIRE_USABLE_PASSWORD = False

# Drawing renderer
if "DRAWING_RENDERER_HOST" not in os.environ:
    raise ImproperlyConfigured("Missing DRAWING_RENDERER_HOST in environment")

DRAWING_RENDERER_HOST = "http://{}/".format(os.environ.get("DRAWING_RENDERER_HOST"))
