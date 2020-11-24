from django.core.management.base import BaseCommand
from django.db import IntegrityError

from core.models import BlackList, Suggestion
from core.service.suggestions_service import sanitize_sentence


class Command(BaseCommand):
    help = "Blacklist a sentence"

    def add_arguments(self, parser):
        parser.add_argument(
            "sentence",
            type=str,
            help="The unsanitized sentence to blacklist",
        )

    def handle(self, *args, **options):
        sentence = options["sentence"]
        sanitized_sentence = sanitize_sentence(sentence)

        print("Start removing suggestions matching blacklisted sentence")
        for suggestion in Suggestion.objects.all():
            if sanitized_sentence == sanitize_sentence(suggestion.sentence):
                suggestion.delete()
                print("suggestion deleted")

        try:
            BlackList.objects.create(sentence=sentence)
            print("sentence added to blacklist")
        except IntegrityError:
            print("sentence already added to blacklist : skipped")
