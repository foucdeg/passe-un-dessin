#!/bin/sh
python manage.py collectstatic --noinput
python manage.py compilemessages
python manage.py migrate

gunicorn --workers=1 --threads=5 passe_un_dessin.wsgi:application -b 0.0.0.0:9001 --access-logfile /var/log/gunicorn/access.log --error-logfile /var/log/gunicorn/error.log
