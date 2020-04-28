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

export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-repository-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

$(aws ecr get-login --no-include-email --region ${REGION})
yarn build
docker build --no-cache --tag "${Job4ApiRepository}:${MY_TAG}" ../.
docker push "${Job4ApiRepository}:${MY_TAG}"
rm -rf ../dist

# Delete untagged images
IMAGES_TO_DELETE=$( aws ecr list-images --region ${REGION} --repository-name ${Job4ApiRepositoryName} --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json )
aws ecr batch-delete-image --region ${REGION} --repository-name ${Job4ApiRepositoryName} --image-ids "$IMAGES_TO_DELETE" || true
