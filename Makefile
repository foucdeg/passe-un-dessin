include .env
DB_CONTAINER_ID := $(shell docker-compose ps -q db)

deploy-front:
	cd frontend && REACT_APP_ENV=production yarn build
	rsync -avz ./frontend/build/ vps:/home/fouc/passe-un-dessin/build

deploy-back:
	cd backend && docker build -f ./docker/Dockerfile.prod . -t foucdeg/passe-un-dessin:latest
	docker push foucdeg/passe-un-dessin:latest

deploy-drawing-renderer:
	cd drawing-renderer && docker build -f ./Dockerfile.prod . -t foucdeg/passe-un-dessin-drawing-renderer:latest
	docker push foucdeg/passe-un-dessin-drawing-renderer:latest

deploy: deploy-back deploy-front

load_prod_dump:
	ssh vps "PGPASSWORD=$(DB_PASSWORD) pg_dump -U passe_un_dessin_user -d passe_un_dessin  -c -f /tmp/dump.pgbackup"
	scp vps:/tmp/dump.pgbackup /tmp/dump.pgbackup
	docker cp /tmp/dump.pgbackup $(DB_CONTAINER_ID):/tmp/dump.pgbackup
	docker-compose exec db psql -U postgres -d postgres -f /tmp/dump.pgbackup

frontend/localhost-key.pem:
	mkcert -cert-file frontend/localhost.pem -key-file frontend/localhost-key.pem localhost

certs: frontend/localhost-key.pem
