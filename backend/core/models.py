import random
import uuid
from enum import Enum

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from core.constants import COLORS


def random_color():
    return random.choice(COLORS)


class GamePhase(Enum):
    INIT = "INIT"  # deprecated
    ROUNDS = "ROUNDS"
    REVEAL = "REVEAL"
    DEBRIEF = "DEBRIEF"
    VOTE_RESULTS = "VOTE_RESULTS"


class StepType(Enum):
    INITIAL = "INITIAL"
    WORD_TO_DRAWING = "WORD_TO_DRAWING"
    DRAWING_TO_WORD = "DRAWING_TO_WORD"


class BaseModel(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        get_latest_by = "created_at"

    def __str__(self):
        return f"{self.__class__.__name__.lower()}:{str(self.uuid)[:6]}"


class UserManager(BaseUserManager):
    """A custom model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class Room(BaseModel):
    admin = models.ForeignKey(
        "Player", on_delete=models.CASCADE, related_name="room_as_admin"
    )
    current_game = models.ForeignKey(
        "Game",
        on_delete=models.SET_NULL,
        related_name="room_as_current_game",
        null=True,
        blank=True,
    )

    friendly_name = models.CharField(
        max_length=128,
        default="",
    )


class Player(BaseModel):
    name = models.CharField(max_length=30)
    room = models.ForeignKey(
        Room, on_delete=models.SET_NULL, related_name="players", null=True, blank=True
    )
    color = models.CharField(max_length=10)
    avatar_url = models.CharField(max_length=500, blank=True, null=True)

    total_score = models.IntegerField(default=0)


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    player = models.OneToOneField(
        Player, on_delete=models.CASCADE, related_name="user", null=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def save(self, *args, **kwargs):
        "Set username to email when it's empty."
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class Game(BaseModel):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="games")
    phase = models.CharField(
        max_length=12,
        choices=[(phase.value, phase.value) for phase in GamePhase],
        default="ROUNDS",
    )
    round_duration = models.IntegerField(default=60)
    current_round = models.IntegerField(default=0)
    pads_done = models.IntegerField(default=0)
    draw_own_word = models.BooleanField(default=True)
    controlled_reveal = models.BooleanField(default=False)

    @property
    def rounds(self):
        def sort_fn(step: PadStep):
            return step.round_number

        all_pad_steps = [
            pad_step for pad in self.pads.all() for pad_step in pad.steps.all()
        ]
        all_pad_steps.sort(key=sort_fn)

        return all_pad_steps

    def has_player(self, player: Player):
        return player in [participant.player for participant in self.participants.all()]


class PlayerGameParticipation(BaseModel):
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name="participations"
    )
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="participants"
    )
    order = models.IntegerField()
    vote_count = models.IntegerField(default=0)

    class Meta:
        unique_together = (
            "player",
            "game",
        )
        ordering = ("order",)


class Pad(BaseModel):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="pads")
    order = models.IntegerField()

    class Meta:
        ordering = ("order",)


class PadStep(BaseModel):
    pad = models.ForeignKey(Pad, on_delete=models.CASCADE, related_name="steps")
    step_type = models.CharField(
        max_length=50,
        choices=[(step_type.value, step_type.value) for step_type in StepType],
    )
    round_number = models.IntegerField()
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="steps")

    sentence = models.CharField(max_length=100, blank=True, null=True)
    drawing_url = models.CharField(max_length=500, blank=True, null=True)

    is_featured = models.BooleanField(default=False)

    class Meta:
        unique_together = ("pad", "round_number")
        ordering = ("round_number",)
        indexes = [
            models.Index(
                name="padstep_is_featured_idx",
                fields=["is_featured"],
            )
        ]


class Vote(BaseModel):
    pad_step = models.ForeignKey(
        PadStep,
        on_delete=models.CASCADE,
        related_name="votes",
    )
    player = models.ForeignKey(Player, on_delete=models.CASCADE)


@receiver(models.signals.pre_save, sender=Player)
def pick_color(sender, **kwargs):
    instance = kwargs["instance"]
    if instance.color is None or instance.color == "":
        instance.color = random_color()
