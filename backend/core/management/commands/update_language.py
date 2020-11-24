from django.core.management.base import BaseCommand, CommandError

from core.models import Suggestion


class Command(BaseCommand):
    help = "Update language from sentence"

    def add_arguments(self, parser):
        parser.add_argument(
            "sentence",
            type=str,
            help="The sentence to update",
        )
        parser.add_argument(
            "old_language",
            type=str,
            help="The old language",
        )
        parser.add_argument(
            "new_language",
            type=str,
            help="The new language",
        )

    def handle(self, *args, **options):
        sentence = options["sentence"]
        old_language = options["old_language"]
        new_language = options["new_language"]

        try:
            suggestion = Suggestion.objects.get(
                sentence=sentence, language=old_language
            )
        except Suggestion.DoesNotExist:
            raise CommandError("This sentence does not exist")

        suggestion.language = new_language
        suggestion.save()
