from django.core.management.base import BaseCommand, CommandError

from core.models import Player, Room
from core.service.room_service import join_room


class Command(BaseCommand):
    help = "Creates a player by name <player-name> and makes them join <room-id>"

    def add_arguments(self, parser):
        parser.add_argument("room-id", type=str, help="The room ID")
        parser.add_argument(
            "player-name",
            type=str,
            help="The name of the player to create",
        )

    def handle(self, *args, **options):
        player_name = options["player-name"]
        room_id = options["room-id"]

        try:
            room = Room.objects.get(uuid=room_id)
        except Room.DoesNotExist:
            raise CommandError("Room with id %s does not exist" % room_id)

        player = Player.objects.create(name=player_name)

        join_room(room, player)

        self.style.SUCCESS("Player %s joined room %s" % (str(player), room.uuid.hex))
