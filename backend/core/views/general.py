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

    players = Player.objects.raw(
        """
        SELECT * from (
            SELECT
                *,
                RANK() OVER (ORDER BY total_score DESC) AS rank
            FROM core_player
            ORDER BY rank, uuid
        ) sub
        WHERE name ILIKE %s
        LIMIT 10
        OFFSET %s
    """,
        ["%" + name_filter + "%", (page_number - 1) * 10],
    )

    serialized_leaderboard = PlayerInRankingSerializer(players, many=True).data

    return JsonResponse(
        {"pageData": serialized_leaderboard, "pageNumber": page_number}
    )
