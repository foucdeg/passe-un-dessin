from django.http import JsonResponse
from django.views.decorators.http import require_GET

from twitch.models import Stream
from twitch.serializers import StreamSerializer


@require_GET
def get_current_streams(request):
    current_streams = (
        Stream.objects.prefetch_related("streamer").filter(type="live").all()
    )
    data = [StreamSerializer(stream).data for stream in current_streams]
    return JsonResponse({"streams": data})


@require_GET
def get_current_streams_count(request):
    current_streams_count = Stream.objects.filter(type="live").count()
    return JsonResponse({"current_streams_count": current_streams_count})
