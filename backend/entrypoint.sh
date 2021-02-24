#!/bin/sh
# Not in use - creates issues with the debugger
python manage.py compilemessages
python /code/manage.py rundebugserver 0.0.0.0:80
