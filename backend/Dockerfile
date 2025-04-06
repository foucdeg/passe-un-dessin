# Stage 2: Python
FROM python:3.12.0
ENV PYTHONPATH /code
# This is to print directly to stdout instead of buffering output
ENV PYTHONUNBUFFERED 1

# apt stuff
RUN apt-get update && apt-get -y --no-install-recommends install lsb-release && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
# Install PG client
RUN sh -c 'wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -'
RUN apt-get update && apt-get -y --no-install-recommends install postgresql-client-13 gettext && apt-get clean && rm -rf /var/lib/apt/lists/*
# Install poetry
RUN pip install --no-cache-dir poetry==2.1.1

WORKDIR /code

COPY pyproject.toml poetry.lock ./
ENV POETRY_VIRTUALENVS_CREATE=false
RUN poetry install --no-root
