from django.core.management.base import BaseCommand, CommandError

from core.models import Suggestion


class Command(BaseCommand):
    help = "Update suggestion"

    def add_arguments(self, parser):
        parser.add_argument(
            "old_sentence",
            type=str,
            help="The old sentence",
        )
        parser.add_argument(
            "old_language",
            type=str,
            help="The old language",
        )
        parser.add_argument(
            "new_sentence",
            type=str,
            help="The new sentence",
        )
        parser.add_argument(
            "new_language",
            type=str,
            help="The new language",
        )

    def handle(self, *args, **options):
        old_sentence = options["old_sentence"]
        new_sentence = options["new_sentence"]
        old_language = options["old_language"]
        new_language = options["new_language"]

        try:
            suggestion = Suggestion.objects.get(
                sentence=old_sentence, language=old_language
            )
        except Suggestion.DoesNotExist:
            raise CommandError("This sentence does not exist")

        suggestion.sentence = new_sentence
        suggestion.language = new_language
        suggestion.save()
