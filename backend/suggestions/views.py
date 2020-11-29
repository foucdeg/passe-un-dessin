from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from suggestions.models import Suggestion

from .service import get_random


@require_GET
def get_suggestions(request):
    language = request.GET.get("language")
    return JsonResponse({"suggestions": get_random(language, 3)})
