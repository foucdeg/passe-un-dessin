from os import path

from django.core.management.base import BaseCommand, CommandError

from core.models import Game, PlayerGameParticipation, StepType
from core.service.game_service import vote

DRAWING_PATH = path.join(path.dirname(__file__), "burns.txt")


class Command(BaseCommand):
    help = "On <game-id>, make player <player-name> cast a valid vote."

    def add_arguments(self, parser):
        parser.add_argument("game-id", type=str, help="The game ID")
        parser.add_argument("player-name", type=str, help="The name of the player")

    def handle(self, *args, **options):
        game_id = options["game-id"]
        player_name = options["player-name"]

        try:
            game = Game.objects.get(uuid=game_id)
            player = game.participants.get(player__name=player_name).player
        except Game.DoesNotExist:
            raise CommandError("Game with id %s does not exist" % game_id)
        except PlayerGameParticipation.DoesNotExist:
            raise CommandError(
                "No player by name %s exists in game %s" % (player_name, game_id)
            )

        target_player = game.participants.exclude(player=player).first().player
        target_steps = [
            step
            for step in game.rounds
            if step.player == target_player
            and step.step_type == StepType.WORD_TO_DRAWING.value
        ]
        target_step = target_steps[0]

        vote(player, target_step)

        self.style.SUCCESS(
            "Player %s has voted on step %s on game %s"
            % (str(player), target_step.uuid.hex, game.uuid.hex)
        )
