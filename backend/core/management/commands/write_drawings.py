from django.core.management.base import BaseCommand
from django.core.paginator import Paginator

from core.models import PadStep, StepType
from core.service.game_service import save_drawing


class Command(BaseCommand):
    help = "Writes drawings into PNG files."

    def add_arguments(self, parser):
        parser.add_argument(
            "--game",
            type=str,
            default=None,
            help="A game ID to restrict execution.",
        )

    def handle(self, *args, **options):
        game_id = options["game"]

        step_ids = (
            PadStep.objects.values_list("pk", flat=True)
            .filter(step_type=StepType.WORD_TO_DRAWING.value)
            .filter(drawing_url__isnull=True)
            .exclude(drawing__isnull=True)
            .exclude(drawing="")
        )
        if game_id:
            step_ids = step_ids.filter(pad__game=game_id)

        paged_step_ids = Paginator(step_ids, 100)

        self.stdout.write("%d steps to process" % paged_step_ids.count)

        i = 0

        for page_number in paged_step_ids.page_range:
            page = paged_step_ids.page(page_number)

            self.stdout.write("Processing steps %d-%d" % (i, i + 99))
            i += 100

            for step_id in page.object_list:
                step = PadStep.objects.get(pk=step_id)
                try:
                    drawing_url = save_drawing(step, step.drawing)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(str(e)))
                    continue

                step.drawing_url = drawing_url
                step.save(update_fields=["drawing_url"])

                next_step = PadStep.objects.get(
                    pad=step.pad, round_number=step.round_number + 1
                )
                next_step.drawing_url = drawing_url
                next_step.save(update_fields=["drawing_url"])
