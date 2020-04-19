from django.http import JsonResponse

from core.service.suggestions import SuggestionEngine


def get_suggestions(request):
    language = request.GET.get("language")
    engine = SuggestionEngine()
    suggestions = engine.get_random(language, 3)

    return JsonResponse({"suggestions": suggestions})
