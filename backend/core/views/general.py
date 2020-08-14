from django.core.paginator import Paginator
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from core.models import Player
from core.serializers import PlayerInRankingSerializer
from core.service.suggestions import SuggestionEngine


@require_GET
def get_suggestions(request):
    language = request.GET.get("language")
    engine = SuggestionEngine()
    suggestions = engine.get_random(language, 3)

    return JsonResponse({"suggestions": suggestions})


@require_GET
def get_leaderboard(request):
    page_number = request.GET.get("page", 1)

    qs = Player.objects.annotate(vote_count=Count("steps__votes")).order_by(
        "-vote_count"
    )
    paginator = Paginator(qs, 10)
    page = paginator.get_page(page_number)

    serialized_leaderboard = PlayerInRankingSerializer(
        page.object_list, many=True
    ).data

    return JsonResponse(
        {
            "pageData": serialized_leaderboard,
            "totalCount": paginator.count,
            "numPages": paginator.num_pages,
            "pageNumber": page.number,
        }
    )
