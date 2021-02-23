#!/bin/sh
python manage.py compilemessages
python /code/manage.py rundebugserver 0.0.0.0:80
