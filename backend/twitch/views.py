from django.http import JsonResponse
from django.views.decorators.http import require_GET

from twitch.models import Stream
from twitch.serializers import StreamSerializer


@require_GET
def get_current_streams(request):
    current_streams = (
        Stream.objects.prefetch_related("streamer").filter(type="live").all()
    )
    return JsonResponse(StreamSerializer(current_streams, many=True).data, safe=False)


@require_GET
def get_current_streams_count(request):
    current_streams_count = Stream.objects.filter(type="live").count()
    return JsonResponse(current_streams_count, safe=False)
