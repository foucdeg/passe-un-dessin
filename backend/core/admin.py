from django.contrib import admin
from django.db.models import Count
from django.utils.html import mark_safe

from core.models import PadStep, StepType


class FeaturedPadStepAdmin(admin.ModelAdmin):
    fields = (
        "is_featured",
        "sentence",
    )
    list_display = (
        "sentence",
        "image_tag",
        "author",
        "creation_date",
        "votes",
        "is_featured",
    )
    list_editable = ("is_featured",)
    list_display_links = ("sentence",)
    list_filter = ["is_featured", "created_at"]

    def image_tag(self, obj):
        return mark_safe(
            '<img src="%s" width="100" height="100" />' % (obj.drawing_url)
        )

    image_tag.short_description = "Drawing"

    def votes(self, obj):
        return obj.votes.count()

    def author(self, obj):
        return obj.player.name

    def creation_date(self, obj):
        return obj.created_at.strftime("%d %b %Y")

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(count=Count("votes"))
            .filter(step_type=StepType.WORD_TO_DRAWING.value)
            .prefetch_related("votes", "player")
            .order_by("-count")
        )


admin.site.register(PadStep, FeaturedPadStepAdmin)
