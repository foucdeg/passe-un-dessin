from django.http import HttpResponse

from core.models import Player


def requires_player(function):
    def wrap(request, *args, **kwargs):
        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(uuid=player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponse(status=401)

        return function(request, player, *args, **kwargs)

    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
