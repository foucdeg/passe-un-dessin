from enum import Enum

from django.db import models

from core.models import BaseModel


class Language(Enum):
    FR = "fr"
    EN = "en"


class SuggestionStatus(Enum):
    INACTIVE = "INACTIVE"
    ACTIVE = "ACTIVE"
    BLACKLISTED = "BLACKLISTED"


# Create your models here.
class Suggestion(BaseModel):
    sentence = models.CharField(max_length=100)
    language = models.CharField(
        max_length=10,
        choices=[(language.value, language.value) for language in Language],
        default=Language.FR.value,
    )
    status = models.CharField(
        max_length=12,
        choices=[(status.value, status.value) for status in SuggestionStatus],
        default=SuggestionStatus.INACTIVE.value,
    )

    class Meta:
        unique_together = (
            "sentence",
            "language",
        )
