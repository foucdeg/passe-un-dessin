from channels.routing import ProtocolTypeRouter, URLRouter

import core.routing

application = ProtocolTypeRouter({"http": URLRouter(core.routing.urlpatterns)})
