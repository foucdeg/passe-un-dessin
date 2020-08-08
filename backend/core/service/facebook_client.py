import requests
from django.conf import settings

# class FacebookClient:
#     class __FacebookClient:
#         _auth_token = None

#         def get_token(self):
#             if self._auth_token and not is_expired(self._auth_token):
#                 return self._auth_token

#             response = requests.get(
#                 "https://graph.facebook.com/oauth/access_token",
#                 params={
#                     "client_id": settings.AUTH_FACEBOOK_APP_ID,
#                     "client_secret": settings.AUTH_FACEBOOK_APP_SECRET,
#                     "grant_type": "client_credentials",
#                 },
#             )

#     instance = None

#     def __init__(self):
#         if not FacebookClient.instance:
#             FacebookClient.instance = FacebookClient.__FacebookClient()

#     def __getattr__(self, name):
#         return getattr(self.instance, name)


def verify_token(token: str):
    response = requests.get(
        "https://graph.facebook.com/debug_token",
        params={
            "input_token": token,
            "access_token": "{}|{}".format(
                settings.AUTH_FACEBOOK_APP_ID, settings.AUTH_FACEBOOK_APP_SECRET
            ),
        },
    )
    return response.json().get("data")


def get_user_email(token: str):
    response = requests.get(
        "https://graph.facebook.com/me",
        params={"access_token": token, "fields": "email"},
    )

    return response.json().get("email")
