from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .service import get_random


@require_GET
def get_suggestions(request):
    language = request.GET.get("language")
    return JsonResponse({"suggestions": get_random(language, 3)})
