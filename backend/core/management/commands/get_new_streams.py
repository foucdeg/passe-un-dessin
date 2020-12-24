import traceback

from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand

from twitch.client import get_streams
from twitch.models import Polling, PollingStatus, Stream, Streamer
from twitch.service import fetch_and_handle_streams


class Command(BaseCommand):
    help = "Get new streams"

    def handle(self, *args, **options):
        polling = Polling.objects.create(status=PollingStatus.PROCESSING.value)
        try:
            polling = fetch_and_handle_streams(polling)
            polling.status = PollingStatus.SUCCESS.value
        except Exception as e:
            stacktrace = traceback.format_exc()
            polling.status = PollingStatus.ERROR.value
            polling.stacktrace = stacktrace
            send_mail(
                "Failed to import streams",
                stacktrace,
                from_email=None,
                recipient_list=settings.DEV_EMAILS,
            )
        polling.save()
