from os import path

from django.core.management.base import BaseCommand, CommandError

from core.models import Game, PlayerGameParticipation, StepType
from core.service.game_service import save_drawing_step, save_sentence_step
from suggestions.service import get_random

DRAWING_PATH = path.join(path.dirname(__file__), "burns.txt")


class Command(BaseCommand):
    help = "On <game-id>, make player <player-name> submit their step <round-number>"

    def add_arguments(self, parser):
        parser.add_argument("game-id", type=str, help="The game ID")
        parser.add_argument("player-name", type=str, help="The name of the player")
        parser.add_argument(
            "round-number",
            type=int,
            help="The round number of the step to submit",
        )

    def handle(self, *args, **options):
        game_id = options["game-id"]
        player_name = options["player-name"]
        round_number = options["round-number"]

        try:
            game = Game.objects.get(uuid=game_id)
            player = game.participants.get(player__name=player_name).player
            steps = [
                step
                for step in game.rounds
                if step.player == player and step.round_number == round_number
            ]
            step = steps[0]
        except Game.DoesNotExist:
            raise CommandError("Game with id %s does not exist" % game_id)
        except PlayerGameParticipation.DoesNotExist:
            raise CommandError(
                "No player by name %s exists in game %s" % (player_name, game_id)
            )
        except IndexError:
            raise CommandError(
                "No round %d exists in game %s" % (round_number, game_id)
            )

        if step.step_type in [StepType.INITIAL.value, StepType.DRAWING_TO_WORD.value]:
            sentences = get_random("en", 1)
            save_sentence_step(step, sentences[0])
        else:
            with open(DRAWING_PATH, "r") as reader:
                drawing = reader.readline()
                save_drawing_step(step, drawing)

        self.style.SUCCESS(
            "Player %s has submitted step %d on game %s"
            % (str(player), round_number, game.uuid.hex)
        )
