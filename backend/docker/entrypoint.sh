#!/bin/sh
python manage.py collectstatic --noinput
python manage.py compilemessages
python manage.py migrate

daphne -b 0.0.0.0 -p 9001 passe_un_dessin.asgi:application
