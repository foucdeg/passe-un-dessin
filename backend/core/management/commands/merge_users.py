from django.core.management.base import BaseCommand, CommandError

from core.models import Player, User
from core.service.auth_service import merge_users, reset_creation_dates


class Command(BaseCommand):
    help = "Merges all users with the provided email in case-insensitive terms"

    def add_arguments(self, parser):
        parser.add_argument(
            "email", type=str, help="The exact email of the user account"
        )

    def handle(self, *args, **options):
        email = options["email"].lower()

        all_users = User.objects.filter(email__iexact=email)
        if all_users.count() == 0:
            raise CommandError("No user with email %s exists" % email)
        all_users = list(all_users)
        main_user = all_users.pop()

        for user in all_users:
            self.style.SUCCESS(
                "Merging user %s into user %s" % (str(user), str(main_user))
            )
            merge_users(from_user=user, into_user=main_user)

        main_user.email = main_user.email.lower()
        main_user.save()

        if main_user.player:
            reset_creation_dates(main_user.player)
