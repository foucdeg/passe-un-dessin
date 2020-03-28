# Stage 1: Watchman
ARG WATCHMAN_VERSION=4.9.0
FROM jotadrilo/watchman:$WATCHMAN_VERSION AS watchman

# Stage 2: Python
FROM python:3.8
ENV PYTHONPATH /code
# This is to print directly to stdout instead of buffering output
ENV PYTHONUNBUFFERED 1

RUN pip install poetry pywatchman

# Install Watchman
ARG WATCHMAN_VERSION
COPY --from=watchman /usr/local/bin/watchman* /usr/local/bin/
COPY --from=watchman /usr/local/share/doc/watchman-$WATCHMAN_VERSION /usr/local/share/doc/watchman-$WATCHMAN_VERSION
COPY --from=watchman /usr/local/var/run/watchman /usr/local/var/run/watchman

WORKDIR /code

COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false
RUN poetry install
