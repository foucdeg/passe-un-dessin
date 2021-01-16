from enum import Enum

from django.db import models

from core.models import BaseModel


class PollingStatus(Enum):
    PROCESSING = "PROCESSING"
    ERROR = "ERROR"
    SUCCESS = "SUCCESS"


# Create your models here.
class Streamer(BaseModel):
    twitch_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)


class Stream(BaseModel):
    twitch_id = models.CharField(max_length=20, unique=True)
    type = models.CharField(max_length=255)
    title = models.CharField(max_length=1000)
    viewer_count = models.IntegerField()
    started_at = models.DateTimeField()
    language = models.CharField(max_length=20)
    thumbnail_url = models.CharField(max_length=255)
    streamer = models.ForeignKey(
        Streamer, on_delete=models.CASCADE, related_name="streamers"
    )


class Polling(BaseModel):
    status = models.CharField(
        max_length=20,
        choices=[(status.value, status.value) for status in PollingStatus],
    )
    streams_count = models.IntegerField(null=True)
    new_streams_count = models.IntegerField(null=True)
    ended_at = models.DateTimeField(null=True)
    stacktrace = models.TextField(null=True, blank=True)
