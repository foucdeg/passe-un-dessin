from django.http import JsonResponse

from core.service.suggestions import SuggestionEngine


def get_suggestions(request):
    engine = SuggestionEngine()
    suggestions = engine.get_random(3)

    return JsonResponse({"suggestions": suggestions})
