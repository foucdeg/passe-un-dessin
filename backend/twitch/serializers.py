from rest_framework import serializers

from twitch.models import Stream, Streamer


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class StreamerSerializer(BaseSerializer):
    class Meta:
        model = Streamer
        fields = ("twitch_id", "name")


class StreamSerializer(BaseSerializer):
    streamer = StreamerSerializer()

    class Meta:
        model = Stream
        fields = (
            "twitch_id",
            "type",
            "title",
            "viewer_count",
            "started_at",
            "language",
            "thumbnail_url",
            "streamer",
        )
