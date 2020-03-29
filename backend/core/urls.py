from django.urls import path

from core.views import room_management

urlpatterns = [
    path("room", room_management.RoomCreationView.as_view(), name="room_creation"),
    path("player", room_management.PlayerView.as_view(), name="player"),
    path("room/<str:room_id>/join", room_management.join_room, name="join_room"),
    path("room/<str:room_id>/start", room_management.start_game, name="start_game"),
]
