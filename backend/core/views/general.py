from django.http import JsonResponse
from django.views.decorators.http import require_GET

from core.service.suggestions import SuggestionEngine


@require_GET
def get_suggestions(request):
    language = request.GET.get("language")
    engine = SuggestionEngine()
    suggestions = engine.get_random(language, 3)

    return JsonResponse({"suggestions": suggestions})
