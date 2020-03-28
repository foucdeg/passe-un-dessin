from rest_framework import serializers

from core.models import Room


class RoomSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")

    class Meta:
        model = Room
        fields = ("uuid",)
