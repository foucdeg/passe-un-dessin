from django.http import JsonResponse
from django.views.decorators.http import require_GET

from core.models import PadStep, Player
from core.serializers import PadStepSerializer, PlayerSerializer


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
        WHERE UNACCENT(name) ILIKE UNACCENT(%s)
        LIMIT 10
        OFFSET %s
        """,
        ["%" + name_filter + "%", (page_number - 1) * 10],
    )

    serialized_leaderboard = PlayerSerializer(players, many=True).data

    return JsonResponse(
        {"pageData": serialized_leaderboard, "pageNumber": page_number}
    )


@require_GET
def get_featured_pad_steps(request):
    pad_steps = PadStep.objects.filter(is_featured=True).all()
    data = PadStepSerializer(pad_steps, many=True).data
    return JsonResponse(data, safe=False)
