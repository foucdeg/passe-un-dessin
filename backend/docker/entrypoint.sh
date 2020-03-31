#!/bin/sh
python manage.py collectstatic --noinput
python manage.py migrate

sh -c \
  "uvicorn passe_un_dessin.asgi:application --host 0.0.0.0 --port 9002 & \
  uwsgi --http :9001 --wsgi-file passe_un_dessin/wsgi.py --master --processes 4 --threads 2"
