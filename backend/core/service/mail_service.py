import os

import requests

MAILGUN_DOMAIN_NAME = "email.passeundessin.com"
MAILGUN_HOST = "https://api.eu.mailgun.net/v3/{}".format(MAILGUN_DOMAIN_NAME)
DEV_EMAILS = ["foucdeg@gmail.com", "quentin.somerville@gmail.com"]


def send_simple_message(subject, text, to=DEV_EMAILS):
    MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")

    if MAILGUN_API_KEY is None:
        print("No Api key : email will not be sent")

    return requests.post(
        "{}/messages".format(MAILGUN_HOST),
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": "Passe Un Dessin <mailgun@{}>".format(MAILGUN_DOMAIN_NAME),
            "to": to,
            "subject": subject,
            "text": text,
        },
    )
