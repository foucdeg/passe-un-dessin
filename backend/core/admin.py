from django.contrib import admin
from django.db import models

from core.models import Suggestion, SuggestionStatus


def activate(modeladmin, request, queryset):
    queryset.update(status=SuggestionStatus.ACTIVE.value)


def blacklist(modeladmin, request, queryset):
    queryset.update(status=SuggestionStatus.BLACKLISTED.value)


activate.short_description = "Activate suggestions"
blacklist.short_description = "Blacklist suggestions"


class SuggestionAdmin(admin.ModelAdmin):
    fields = ("sentence", "language", "status")
    list_display = ("uuid", "sentence", "language", "status")
    list_editable = ("sentence", "language", "status")
    list_display_links = ("uuid",)
    ordering = ["language", "sentence"]
    search_fields = ["sentence"]
    list_filter = ("status", "language")
    actions = [activate, blacklist]


admin.site.register(Suggestion, SuggestionAdmin)
