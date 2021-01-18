# Installing and running the project

## Prerequisites

- Node 12.19.0 (requires approx. version specified in `frontend/.nvmrc`, but LTS is fine)
- python 3 (requires exact version in `backend/pyproject.toml`)
- [yarn v1](https://classic.yarnpkg.com/en/docs/install/)
- docker
- docker-compose
- [mkcert](https://github.com/FiloSottile/mkcert)

## Installation

**Install the frontend:**

```
make certs
cd frontend && yarn
```

**Install drawing-renderer dependencies locally:**

```
cd drawing-renderer && yarn
```

**Install backend dependencies locally:**

This is optional, but recommended for VSCode to be able to help with Python modules

```
cd backend
poetry env use <python executable with the right version>
poetry install
```

Copy `.env.example` into `.env` and fill in the real values.

## Running

**Run all backend services:**

Start services using docker-compose:

```
docker-compose up -d --build
```

Unless you start with a database dump, the first time, the database will need to be initialized:

```
docker-compose exec backend python manage.py migrate
```

**Run the frontend:**

```
cd frontend
yarn start
```

Everything should now be up and running on https://localhost:3000/ :)
