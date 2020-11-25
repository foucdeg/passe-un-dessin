from django.contrib import admin
from django.db import models

from core.models import Suggestion


class SuggestionAdmin(admin.ModelAdmin):
    fields = ("sentence", "language", "is_active")
    list_display = ("uuid", "sentence", "language", "is_active")
    ordering = ["language", "sentence"]
    search_fields = ["sentence"]


admin.site.register(Suggestion, SuggestionAdmin)
