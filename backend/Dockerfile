# Stage 1: Watchman
ARG WATCHMAN_VERSION=4.9.0
FROM jotadrilo/watchman:$WATCHMAN_VERSION AS watchman

# Stage 2: Python
FROM python:3.9.1-alpine
ENV PYTHONPATH /code
# This is to print directly to stdout instead of buffering output
ENV PYTHONUNBUFFERED 1

RUN apk add --no-cache gcc==10.2.1_pre1-r3 musl-dev==1.2.2-r0 postgresql-dev==13.1-r2 postgresql-client==13.1-r2 libressl-dev==3.1.5-r0 libffi-dev==3.3-r2 gettext==0.20.2-r2
RUN pip install poetry==1.1.4 pywatchman==1.4.1

# Install Watchman
ARG WATCHMAN_VERSION
COPY --from=watchman /usr/local/bin/watchman* /usr/local/bin/
COPY --from=watchman /usr/local/share/doc/watchman-$WATCHMAN_VERSION /usr/local/share/doc/watchman-$WATCHMAN_VERSION
COPY --from=watchman /usr/local/var/run/watchman /usr/local/var/run/watchman

WORKDIR /code

COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false
RUN poetry install
