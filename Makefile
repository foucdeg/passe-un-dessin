deploy-front:
	cd frontend && NODE_ENV=production yarn build
	rsync -avz --delete-after ./frontend/build/ vps:/home/fouc/passe-un-dessin/build

deploy-back:
	cd backend && docker build -f ./docker/Dockerfile.prod . -t foucdeg/passe-un-dessin:latest
	docker push foucdeg/passe-un-dessin:latest

deploy: deploy-back deploy-front
