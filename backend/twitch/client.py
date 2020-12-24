import requests
from django.conf import settings


def get_access_token():
    response = requests.post(
        "https://id.twitch.tv/oauth2/token",
        params={
            "client_id": settings.TWITCH_CONFIG["CLIENT_ID"],
            "client_secret": settings.TWITCH_CONFIG["SECRET_KEY"],
            "grant_type": "client_credentials",
        },
    )
    return response.json()["access_token"]


def get_streams_from_twitch(after, access_token):
    params = {"game_id": settings.TWITCH_CONFIG["GAME_ID"]}
    if after:
        params["after"] = after

    response = requests.get(
        "https://api.twitch.tv/helix/streams",
        params=params,
        headers={
            "Client-Id": settings.TWITCH_CONFIG["CLIENT_ID"],
            "Authorization": "Bearer {}".format(access_token),
        },
    )
    return response.json()


def get_streams():
    access_token = get_access_token()
    streams = []
    after = None

    while True:
        response = get_streams_from_twitch(after, access_token)
        data = response["data"]

        if len(data) == 0:
            break

        streams.extend(data)
        after = response["pagination"]["cursor"]

    return streams
