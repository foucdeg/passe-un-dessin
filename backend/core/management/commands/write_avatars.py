from django.core.management.base import BaseCommand

from core.models import Player
from core.service.auth_service import save_avatar


class Command(BaseCommand):
    help = "Writes avatars into PNG files."

    def add_arguments(self, parser):
        parser.add_argument(
            "--player",
            type=str,
            default=None,
            help="A player ID to restrict execution.",
        )

    def handle(self, *args, **options):
        player_id = options["player"]

        players = Player.objects.exclude(avatar__isnull=True).exclude(avatar="")
        if player_id:
            players = players.filter(pk=id)

        self.stdout.write("%d players to process" % players.count())
        i = 0

        for player in players:
            i += 1

            if i % 100 == 0:
                self.stdout.write("Processing player %d" % i)

            try:
                avatar_url = save_avatar(player, player.avatar)
            except Exception as e:
                self.stdout.write(self.style.WARNING(str(e)))
                continue

            player.avatar_url = avatar_url
            player.save()
