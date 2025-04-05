from django.db.models.functions import Now

from twitch.client import get_streams
from twitch.models import Stream, Streamer


def fetch_and_handle_streams(polling):
    live_streams = get_streams()

    # Handle streamers
    live_streamers = [
        {"id": stream["user_id"], "name": stream["user_name"]}
        for stream in live_streams
    ]
    existing_streamers_by_id = {
        streamer.twitch_id: streamer for streamer in Streamer.objects.all()
    }
    for streamer in live_streamers:
        if streamer["id"] not in existing_streamers_by_id:
            new_streamer = Streamer.objects.create(
                twitch_id=streamer["id"], name=streamer["name"]
            )
            existing_streamers_by_id[new_streamer.twitch_id] = new_streamer

    # Handle streams
    live_streams_in_db_by_id = {
        stream.twitch_id: stream for stream in Stream.objects.filter(type="live").all()
    }
    new_streams_count = 0
    for stream in live_streams:
        if stream["id"] not in live_streams_in_db_by_id:
            Stream.objects.create(
                twitch_id=stream["id"],
                type=stream["type"],
                title=stream["title"],
                viewer_count=stream["viewer_count"],
                started_at=stream["started_at"],
                language=stream["language"],
                thumbnail_url=stream["thumbnail_url"],
                streamer=existing_streamers_by_id[stream["user_id"]],
            )
            new_streams_count += 1
        else:
            stream_in_db = live_streams_in_db_by_id[stream["id"]]
            stream_in_db.type = stream["type"]
            stream_in_db.title = stream["title"]
            stream_in_db.viewer_count = stream["viewer_count"]
            stream_in_db.thumbnail_url = stream["thumbnail_url"]
            stream_in_db.save()

    # Handle ended streams
    for stream in live_streams_in_db_by_id.values():
        if stream.twitch_id not in [stream["id"] for stream in live_streams]:
            stream.type = "ended"
            stream.save()

    # Handle polling
    polling.streams_count = len(live_streams)
    polling.new_streams_count = new_streams_count
    polling.ended_at = Now()
    polling.save()
    return polling
