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
    -t|--tag)
    TAG="$2"
    shift # past argument
    ;;
    -e|--env)
    ENV="$2"
    shift # past argument
    ;;
    -p|--profile)
    PROFILE="$2"
    shift # past argument
    ;;
    -s|--secret)
    SECRET_KEY="$2"
    shift # past argument
    ;;
    --db-password)
    DB_PASSWORD="$2"
    shift # past argument
    ;;
    *)
    printf "***************************\n"
    printf "* Error: Invalid argument $key.*\n"
    printf "***************************\n"
    exit 1
esac
shift # past argument or value
done

# We check if AWS Cli profile is in parameters to set env var
if [ -z "${PROFILE}" ]
then
echo "Profile parameter is empty, the default profile will be used!"
else
    export AWS_PROFILE=${PROFILE}
fi

if [ -z "$TAG" ]
then
    MY_TAG="latest"
else
    MY_TAG=$TAG
fi

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-monitoring-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-iam-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-repository-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-cluster-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-service-api-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-postgres-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
AccountId=$(aws sts get-caller-identity --output text --query Account)

echo "[{\"name\":\"PasseUnDessinApiContainer-${ENV}\",\"image\":\"${PasseUnDessinApiRepository}:${MY_TAG}\",\"essential\":true,\"memoryReservation\":512,\"cpu\":256,\"portMappings\":[{\"containerPort\":80,\"hostPort\":0, \"protocol\":\"tcp\"}],\"environment\":[{\"name\":\"ENV\",\"value\":\"${ENV}\"}, {\"name\":\"AWS_REGION\",\"value\":\"${REGION}\"}, {\"name\":\"ALLOWED_HOST\",\"value\":\"*\"}, {\"name\":\"SECRET_KEY\",\"value\":\"${SECRET_KEY}\"}, {\"name\":\"DATABASE_URL\",\"value\":\"postgres://passe_un_dessin_user:${DB_PASSWORD}@${DatabaseHostname}:${DatabasePort}/passeundessindb\"}],\"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"${CloudwatchLogsGroup}\",\"awslogs-region\":\"${REGION}\",\"awslogs-stream-prefix\":\"passe-un-dessin-api\"}}}]"

aws ecs register-task-definition --task-role-arn arn:aws:iam::${AccountId}:role/${PasseUnDessinApiTaskRole} --family ${FamilyName} --container-definitions "[{\"name\":\"PasseUnDessinApiContainer-${ENV}\",\"image\":\"${PasseUnDessinApiRepository}:${MY_TAG}\",\"essential\":true,\"memoryReservation\":512,\"cpu\":256,\"portMappings\":[{\"containerPort\":80,\"hostPort\":0, \"protocol\":\"tcp\"}],\"environment\":[{\"name\":\"ENV\",\"value\":\"${ENV}\"}, {\"name\":\"AWS_REGION\",\"value\":\"${REGION}\"}, {\"name\":\"ALLOWED_HOST\",\"value\":\"*\"}, {\"name\":\"SECRET_KEY\",\"value\":\"${SECRET_KEY}\"}, {\"name\":\"DATABASE_URL\",\"value\":\"postgres://passe_un_dessin_user:${DB_PASSWORD}@${DatabaseHostname}:${DatabasePort}/passeundessindb\"}],\"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"${CloudwatchLogsGroup}\",\"awslogs-region\":\"${REGION}\",\"awslogs-stream-prefix\":\"passe-un-dessin-api\"}}}]" --region ${REGION}

aws ecs update-service --cluster ${ECSCluster} --service ${ServiceName} --task-definition ${FamilyName} --region ${REGION}

aws ecs wait services-stable --cluster ${ECSCluster} --services ${ServiceName} --region ${REGION}
