"""passe_un_dessin URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import django_eventstream
from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path

from passe_un_dessin.views import health

admin.site.site_title = "Passe Un Dessin Site Admin"
admin.site.site_header = "Passe Un Dessin Administration"

urlpatterns = [
    re_path(r"^events/", include(django_eventstream.urls)),
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("health", health, name="health"),
]

if settings.DEBUG:
    import debug_toolbar
    from django.conf.urls.static import static

    urlpatterns = (
        [path("__debug__/", include(debug_toolbar.urls))]
        + static(settings.MEDIA_URL_PATH, document_root=settings.MEDIA_ROOT)
        + urlpatterns
    )
