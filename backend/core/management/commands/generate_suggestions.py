from django.core.management.base import BaseCommand

from core.constants import LANGUAGE_FR
from core.models import BlackList, Pad, PadStep, StepType, Suggestion
from core.service.suggestions_service import sanitize_sentence


class Command(BaseCommand):
    help = "Generate suggestions"

    def add_arguments(self, parser):
        parser.add_argument(
            "threshold", type=int, help="The threshold for suggestion adding"
        )

    def handle(self, *args, **options):
        threshold = options["threshold"]

        blacklisted_sentences = {
            sanitize_sentence(blacklist.sentence)
            for blacklist in BlackList.objects.all()
        }

        already_existing_suggestions = {
            sanitize_sentence(suggestion.sentence)
            for suggestion in Suggestion.objects.all()
        }

        # Build suggestions dictionnary
        print("Build suggestions dictionnary")
        pad_steps_sentence_list = (
            PadStep.objects.filter(step_type=StepType.WORD_TO_DRAWING.value)
            .exclude(sentence__isnull=True)
            .exclude(sentence__exact="")
            .values_list("sentence", flat=True)
        )
        pads_sentence_list = (
            Pad.objects.exclude(sentence__isnull=True)
            .exclude(sentence__exact="")
            .values_list("sentence", flat=True)
        )
        sentence_list = [sentence for sentence in pad_steps_sentence_list] + [
            sentence for sentence in pads_sentence_list
        ]
        print("{} suggestions to analyze".format(len(sentence_list)))
        suggestions = {}
        for sentence in sentence_list:
            sanitized_sentence = sanitize_sentence(sentence)

            if (
                sanitized_sentence == ""
                or sanitized_sentence in already_existing_suggestions
                or sanitized_sentence in blacklisted_sentences
            ):
                continue

            if sanitized_sentence not in suggestions:
                suggestions[sanitized_sentence] = []
            suggestions[sanitized_sentence].append(sentence)

        # Add new suggestions
        print("{} suggestions to analyze".format(len(suggestions)))
        suggestions_to_create = [
            Suggestion(
                is_active=False,
                sentence=max(sentence_list, key=sentence_list.count),
                language=LANGUAGE_FR,
            )
            for (
                sanitized_sentence,
                sentence_list,
            ) in suggestions.items()
            if len(sentence_list) >= threshold
        ]

        print("{} suggestions will be added".format(len(suggestions_to_create)))
        Suggestion.objects.bulk_create(suggestions_to_create)
