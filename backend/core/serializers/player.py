from rest_framework import serializers

from core.models import Player


class PlayerSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")

    class Meta:
        model = Player
        fields = ("uuid", "name")
