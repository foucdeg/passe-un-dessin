from django.core.management.base import BaseCommand

from core.models import Suggestion


class Command(BaseCommand):
    help = "Validate inactive suggestions"

    def handle(self, *args, **options):
        Suggestion.objects.update(is_active=True)
