from django.core.management.base import BaseCommand, CommandError

from core.models import Player, User
from core.service.auth_service import merge_players


class Command(BaseCommand):
    help = "Associates the existing players named <player_name> into the user with email <email>, \
        and renames the player of that user to <player_name>"

    def add_arguments(self, parser):
        parser.add_argument(
            "player_name",
            type=str,
            help="The case-insensitive name of players to find",
        )
        parser.add_argument(
            "email", type=str, help="The exact email of the user account"
        )

    def handle(self, *args, **options):
        player_name = options["player_name"]
        email = options["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise CommandError("User with email %s does not exist" % email)

        players = Player.objects.filter(name__iexact=player_name, user__isnull=True)

        if not len(players):
            self.stdout.write(
                self.style.WARNING(
                    "No orphaned players found by player name %s" % player_name
                )
            )

        for player in players:
            if player != user.player:
                self.stdout.write(
                    self.style.SUCCESS(
                        "Merging player %s into user %s" % (str(player), str(user))
                    )
                )
                merge_players(from_player=player, into_player=user.player)

        user.player.name = player_name
        user.player.save()
