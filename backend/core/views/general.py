import json

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.forms import ValidationError
from django.http import HttpResponseBadRequest, JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.http import require_GET, require_POST

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

    return JsonResponse({"pageData": serialized_leaderboard, "pageNumber": page_number})


@require_GET
def get_featured_pad_steps(request):
    pad_steps = PadStep.objects.filter(is_featured=True).all()
    data = PadStepSerializer(pad_steps, many=True).data
    return JsonResponse(data, safe=False)


@require_POST
def send_email_for_desktop_access(request):
    json_body = json.loads(request.body)

    try:
        email = json_body["email"]
        validate_email(email)
    except KeyError:
        return HttpResponseBadRequest("Email not provided")
    except ValidationError:
        return HttpResponseBadRequest("Invalid email")

    context = {
        "url": settings.MAIN_FRONTEND,
    }

    email_subject = render_to_string("general/desktop_access_subj.txt")
    email_body = render_to_string("general/desktop_access_body.txt", context)

    msg = EmailMultiAlternatives(
        email_subject,
        email_body,
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )
    msg.send()

    return JsonResponse({"status": "ok"})
