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
    -d|--domain)
    DOMAIN="$2"
    shift # past argument
    ;;
    -pu|--prefix-url)
    PREFIX_URL="$2"
    shift # past argument
    ;;
    -p|--profile)
    PROFILE="$2"
    shift # past argument
    ;;
    --riminder-api-key)
    RIMINDER_API_KEY="$2"
    shift # past argument
    ;;
    --riminder-webhook-secret)
    RIMINDER_WEBHOOK_SECRET="$2"
    shift # past argument
    ;;
    --riminder-upload-source-id)
    RIMINDER_UPLOAD_SOURCE_ID="$2"
    shift # past argument
    ;;
    --hubspot-api-url)
    HUBSPOT_API_URL="$2"
    shift # past argument
    ;;
    --hubspot-api-key)
    HUBSPOT_API_KEY="$2"
    shift # past argument
    ;;
    -s|--secret-key)
    SECRET_KEY="$2"
    shift # past argument
    ;;
    --db-password)
    DB_PASSWORD="$2"
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

## Build Front URL
if [ "$ENV" == "production" ]
then
    CORS_AUTHORIZED_ORIGIN=https://${PREFIX_URL}.${DOMAIN}
else
    CORS_AUTHORIZED_ORIGIN=https://${ENV}-${PREFIX_URL}.${DOMAIN}
fi

export $(aws cloudformation describe-stacks --stack-name Job4-api-monitoring-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name Job4-api-iam-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-repository-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-cluster-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-services-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name Job4-postgres-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
export $(aws cloudformation describe-stacks --stack-name Job4-api-s3-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
AccountId=$(aws sts get-caller-identity --output text --query Account)

aws ecs register-task-definition --task-role-arn arn:aws:iam::${AccountId}:role/${Job4ApiTaskRole} --family ${FamilyName} --container-definitions "[{\"name\":\"Job4ApiContainer-${ENV}\",\"image\":\"${Job4ApiRepository}:${MY_TAG}\",\"essential\":true,\"memoryReservation\":512,\"cpu\":256,\"portMappings\":[{\"containerPort\":80,\"hostPort\":0, \"protocol\":\"tcp\"}],\"environment\":[{\"name\":\"NODE_ENV\",\"value\":\"${ENV}\"}, {\"name\":\"AWS_REGION\",\"value\":\"${REGION}\"}, {\"name\":\"ALLOWED_HOST\",\"value\":\"${CORS_AUTHORIZED_ORIGIN}\"}, {\"name\":\"RIMINDER_API_KEY\",\"value\":\"${RIMINDER_API_KEY}\"}, {\"name\":\"RIMINDER_WEBHOOK_SECRET\",\"value\":\"${RIMINDER_WEBHOOK_SECRET}\"},{\"name\":\"RIMINDER_UPLOAD_SOURCE_ID\",\"value\":\"${RIMINDER_UPLOAD_SOURCE_ID}\"}, {\"name\":\"HUBSPOT_API_URL\",\"value\":\"${HUBSPOT_API_URL}\"}, {\"name\":\"HUBSPOT_API_KEY\",\"value\":\"${HUBSPOT_API_KEY}\"}, {\"name\":\"SECRET_KEY\",\"value\":\"${SECRET_KEY}\"}, {\"name\":\"TYPEORM_URL\",\"value\":\"postgres://job4:${DB_PASSWORD}@${DatabaseHostname}:${DatabasePort}/job4db\"}, {\"name\":\"IMAGES_S3_BUCKET\",\"value\":\"${ImagesS3Bucket}\"}],\"logConfiguration\":{\"logDriver\":\"awslogs\",\"options\":{\"awslogs-group\":\"${CloudwatchLogsGroup}\",\"awslogs-region\":\"${REGION}\",\"awslogs-stream-prefix\":\"job4-api\"}}}]" --region ${REGION}

aws ecs update-service --cluster ${ECSCluster} --service ${ServiceName} --task-definition ${FamilyName} --region ${REGION}

aws ecs wait services-stable --cluster ${ECSCluster} --services ${ServiceName} --region ${REGION}
