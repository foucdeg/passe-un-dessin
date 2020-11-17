# Installing and running the project

## Prerequisites

- Node 12.19.0 (see frontend/.nvmrc)
- [yarn v1](https://classic.yarnpkg.com/en/docs/install/)
- docker
- docker-compose
- [mkcert](https://github.com/FiloSottile/mkcert)

## Frontend

```
make certs
cd frontend
yarn # install dependencies
yarn start # run the frontend
```

## Drawing-renderer

```
cd drawing-renderer
yarn # install dependencies
```

## Backend and microservices

Copy `.env.example` into `.env` and fill in the real values.

Then run:

```
docker-compose up -d --build
```

Unless you start with a database dump, the database will need to be initialized:

```
docker-compose exec backend python manage.py migrate
```

Everything should now be up and running on https://localhost:3000/ :)
