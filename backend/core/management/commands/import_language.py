import csv

from django.core.management.base import BaseCommand, CommandError

from suggestions.models import Suggestion, SuggestionStatus
from suggestions.service import sanitize_sentence


class Command(BaseCommand):
    help = "Import suggestions"

    def add_arguments(self, parser):
        parser.add_argument(
            "language",
            type=str,
            help="The language to import",
        )

    def handle(self, *args, **options):
        language = options["language"]
        filename = "core/word_list_{}.csv".format(language)

        try:
            with open(filename) as csvfile:
                self.import_file(csvfile, language)
        except FileNotFoundError:
            raise CommandError("file {} does not exist".format(filename))

    def import_file(self, csvfile, language):
        already_existing_suggestions = {
            sanitize_sentence(suggestion.sentence, language)
            for suggestion in Suggestion.objects.filter(language=language).all()
        }

        reader = csv.reader(csvfile, delimiter=",")
        suggestions_to_create = []
        for row in reader:
            for word in row:
                sanitized_word = sanitize_sentence(word, language)
                if not word or sanitized_word in already_existing_suggestions:
                    continue

                already_existing_suggestions.add(sanitized_word)
                suggestions_to_create.append(
                    Suggestion(
                        status=SuggestionStatus.ACTIVE.value,
                        sentence=word,
                        language=language,
                    )
                )

        print("{} suggestions will be added".format(len(suggestions_to_create)))
        Suggestion.objects.bulk_create(suggestions_to_create)
