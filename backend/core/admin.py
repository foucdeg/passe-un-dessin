from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from core.models import User


class CustomUserAdmin(UserAdmin):
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )


admin.site.register(User, CustomUserAdmin)
