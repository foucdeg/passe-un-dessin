from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand

from core.models import PadStep, StepType
from suggestions.models import Language, Suggestion, SuggestionStatus
from suggestions.service import sanitize_sentence


class Command(BaseCommand):
    help = "Generate suggestions"

    def add_arguments(self, parser):
        parser.add_argument(
            "threshold", type=int, help="The threshold for suggestion adding"
        )

    def handle(self, *args, **options):
        threshold = options["threshold"]

        already_existing_suggestions = {
            sanitize_sentence(suggestion.sentence)
            for suggestion in Suggestion.objects.all()
        }

        # Build suggestions dictionnary
        print("Build suggestions dictionnary")
        sentence_list = (
            PadStep.objects.exclude(step_type=StepType.WORD_TO_DRAWING.value)
            .exclude(sentence__isnull=True)
            .exclude(sentence__exact="")
            .values_list("sentence", flat=True)
        )

        print("{} suggestions to analyze".format(len(sentence_list)))
        suggestions = {}
        for sentence in sentence_list:
            sanitized_sentence = sanitize_sentence(sentence)

            if (
                sanitized_sentence == ""
                or sanitized_sentence in already_existing_suggestions
            ):
                continue

            if sanitized_sentence not in suggestions:
                suggestions[sanitized_sentence] = []
            suggestions[sanitized_sentence].append(sentence)

        # Add new suggestions
        print("{} suggestions to analyze".format(len(suggestions)))
        suggestions_to_create = [
            Suggestion(
                status=SuggestionStatus.INACTIVE.value,
                sentence=max(sentence_list, key=sentence_list.count),
                language=Language.FR.value,
            )
            for (
                sanitized_sentence,
                sentence_list,
            ) in suggestions.items()
            if len(sentence_list) >= threshold
        ]

        print("{} suggestions will be added".format(len(suggestions_to_create)))
        Suggestion.objects.bulk_create(suggestions_to_create)

        inactive_suggestions = (
            Suggestion.objects.filter(status=SuggestionStatus.INACTIVE.value)
            .order_by("sentence")
            .all()
        )
        if len(inactive_suggestions) > 0:
            message = "Voici les nouvelles suggestions : \n"
            for suggestion in inactive_suggestions[:100]:
                message += "{}\n".format(suggestion.sentence)
            if len(inactive_suggestions) > 100:
                message += "...et {} autres".format(len(inactive_suggestions) - 100)
            message += (
                "\n\nPour évaluer ces suggestions, cliquer sur ce lien :"
                + " https://passeundessin.com/admin/suggestions/suggestion/?status__exact=INACTIVE"
            )

            send_mail(
                "Nouvelles suggestions à évaluer !",
                message,
                from_email=None,
                recipient_list=settings.DEV_EMAILS,
            )
            print("mail sent with all suggestion")
