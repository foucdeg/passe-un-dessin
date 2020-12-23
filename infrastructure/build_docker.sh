#!/bin/bash

set -e

########################
### NAMING ARGUMENTS ###
########################

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -r|--region)
    REGION="$2"
    shift # past argument
    ;;
    -e|--env)
    ENV="$2"
    shift # past argument
    ;;
    -t|--tag)
    TAG="$2"
    shift # past argument
    ;;
    -p|--profile)
    PROFILE="$2"
    shift # past argument
    ;;
    *)
    printf "***************************\n"
    printf "* Error: Invalid argument.*\n"
    printf "***************************\n"
    exit 1
esac
shift # past argument or value
done

# We check if AWS Cli profile is in parameters to set env var
if [ -z "$PROFILE" ]
then
    echo "Profile parameter is empty, the default profile will be used !"
else
    export AWS_PROFILE=${PROFILE}
fi

if [ -z "$TAG" ]
then
    MY_TAG="latest"
else
    MY_TAG=$TAG
fi

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-repository-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${PasseUnDessinBackendRepository}
docker build --tag "${PasseUnDessinBackendRepository}:${MY_TAG}" -f ../backend/docker/Dockerfile.prod ../backend/
docker push "${PasseUnDessinBackendRepository}:${MY_TAG}"

# Delete untagged images
IMAGES_TO_DELETE=$(aws ecr list-images --region ${REGION} --repository-name ${PasseUnDessinBackendRepositoryName} --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json )
aws ecr batch-delete-image --region ${REGION} --repository-name ${PasseUnDessinBackendRepositoryName} --image-ids "$IMAGES_TO_DELETE" || true

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${PasseUnDessinDrawingRendererRepository}
docker build --tag "${PasseUnDessinDrawingRendererRepository}:${MY_TAG}" -f ../drawing-renderer/Dockerfile.prod ../drawing-renderer/
docker push "${PasseUnDessinDrawingRendererRepository}:${MY_TAG}"

# Delete untagged images
IMAGES_TO_DELETE=$(aws ecr list-images --region ${REGION} --repository-name ${PasseUnDessinDrawingRendererRepositoryName} --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json )
aws ecr batch-delete-image --region ${REGION} --repository-name ${PasseUnDessinDrawingRendererRepositoryName} --image-ids "$IMAGES_TO_DELETE" || true

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${PasseUnDessinPushpinRepository}
docker build --tag "${PasseUnDessinPushpinRepository}:${MY_TAG}" -f ../pushpin/Dockerfile ../pushpin/
docker push "${PasseUnDessinPushpinRepository}:${MY_TAG}"

# Delete untagged images
IMAGES_TO_DELETE=$(aws ecr list-images --region ${REGION} --repository-name ${PasseUnDessinPushpinRepositoryName} --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json )
aws ecr batch-delete-image --region ${REGION} --repository-name ${PasseUnDessinPushpinRepositoryName} --image-ids "$IMAGES_TO_DELETE" || true
