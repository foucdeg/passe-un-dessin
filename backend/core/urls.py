from django.urls import path

from core.views import auth, game, room_management

urlpatterns = [
    path("room", room_management.RoomCreationView.as_view(), name="room_creation"),
    path("player", room_management.PlayerView.as_view(), name="player"),
    path("player/me", auth.get_me, name="me"),
    path("room/<str:room_id>/join", room_management.join_room, name="join_room"),
    path("room/<str:room_id>/start", room_management.start_game, name="start_game"),
    path(
        "room/<str:uuid>",
        room_management.RoomRetrieveAPIView.as_view(),
        name="get_room",
    ),
    path("game/<str:uuid>", game.GameRetrieveAPIView.as_view(), name="get_game"),
    path("pad/<str:uuid>", game.PadRetrieveAPIView.as_view(), name="get_pad"),
    path("pad/<str:uuid>/save", game.save_pad, name="save_pad"),
    path(
        "pad-step/<str:uuid>",
        game.PadStepRetrieveAPIView.as_view(),
        name="get_pad_step",
    ),
    path("pad-step/<str:uuid>/save", game.save_step, name="save_dtep"),
]
