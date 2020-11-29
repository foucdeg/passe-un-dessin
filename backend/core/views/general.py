from django.core.paginator import Paginator
from django.db.models import Count
from django.db.models.expressions import F, Window
from django.db.models.functions.window import Rank
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from core.models import Player
from core.serializers import PlayerInRankingSerializer
from suggestions.service import sanitize_sentence


@require_GET
def get_leaderboard(request):
    page_number = int(request.GET.get("page", 1))
    name_filter = request.GET.get("filter", "")

    players = (
        Player.objects.annotate(
            rank=Window(expression=Rank(), order_by=F("total_score").desc())
        )
        .order_by("rank", "uuid")
        .all()
    )

    players_matching_filters = (
        [
            player
            for player in players
            if sanitize_sentence(name_filter) in sanitize_sentence(player.name)
        ]
        if name_filter
        else players
    )

    startIndex = 10 * (page_number - 1)
    endIndex = 10 * page_number
    serialized_leaderboard = PlayerInRankingSerializer(
        players_matching_filters[startIndex:endIndex], many=True
    ).data

    return JsonResponse(
        {"pageData": serialized_leaderboard, "pageNumber": page_number}
    )
