from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from core.models import Game, Pad, PadStep, Player, Room, User


class CustomUserAdmin(UserAdmin):
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )


admin.site.register(User, CustomUserAdmin)
admin.site.register(Room)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Pad)
admin.site.register(PadStep)
