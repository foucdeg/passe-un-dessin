from enum import Enum
from time import time

from django.conf import settings
from google.auth.transport import requests
from google.oauth2 import id_token

from .facebook_client import get_user_email, verify_token


class SocialAuthProvider(Enum):
    GOOGLE = "GOOGLE"
    FACEBOOK = "FACEBOOK"


class SocialAuthInvalidTokenException(BaseException):
    pass


class GoogleAuthInvalidTokenException(SocialAuthInvalidTokenException):
    pass


class FacebookAuthInvalidTokenException(SocialAuthInvalidTokenException):
    pass


def verify_user(auth_token: str, provider: SocialAuthProvider):
    if provider == SocialAuthProvider.GOOGLE.value:
        try:
            idinfo = id_token.verify_oauth2_token(
                auth_token, requests.Request(), settings.AUTH_GOOGLE_CLIENT_ID
            )

            return idinfo["email"]
        except ValueError:
            raise GoogleAuthInvalidTokenException("Invalid Google token provided")

    if provider == SocialAuthProvider.FACEBOOK.value:
        token_data = verify_token(auth_token)
        if not token_data.get("is_valid"):
            raise FacebookAuthInvalidTokenException("Invalid token")
        if token_data.get("app_id") != settings.AUTH_FACEBOOK_APP_ID:
            raise FacebookAuthInvalidTokenException("Wrong app ID")
        if token_data.get("expires_at") < time():
            raise FacebookAuthInvalidTokenException("Token expired")
        if token_data.get("type") != "USER":
            raise FacebookAuthInvalidTokenException("Invalid token type")
        if "email" not in token_data.get("scopes"):
            raise FacebookAuthInvalidTokenException("Invalid scope")

        return get_user_email(auth_token)

    raise ValueError("Incorrect social auth provider")
