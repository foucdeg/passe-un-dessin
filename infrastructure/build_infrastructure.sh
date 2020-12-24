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
    -p|--profile)
    PROFILE="$2"
    shift # past argument
    ;;
    -k|--key-name)
    PEM_KEY="$2"
    shift # past argument
    ;;
    -t|--tag)
    TAG="$2"
    shift # past argument
    ;;
    -d|--domain)
    DOMAIN="$2"
    shift # past argument
    ;;
    -acmc|--acm-arn)
    ACM_ARN="$2"
    shift # past argument
    ;;
    -acma|--acm-arn-alb)
    ACM_ARN_ALB="$2"
    shift # past argument
    ;;
    -v|--vpc-id)
    VPC_ID="$2"
    shift # past argument
    ;;
    -s|--subnets)
    SUBNETS="$2"
    shift # past argument
    ;;
    --db-password)
    DB_PASSWORD="$2"
    shift # past argument
    ;;
    --secret)
    SECRET="$2"
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

## Build Public URL
PUBLIC_URL="api.${DOMAIN}"

# We launch all the passe-un-dessin-api cloudformation and get Outputs into variables

## Security Groups
aws cloudformation deploy --stack-name passe-un-dessin-api-sg-${ENV} --template-file security-groups.yml \
--parameter-overrides VpcId=${VPC_ID} Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-sg-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## IAM Roles
aws cloudformation deploy --stack-name passe-un-dessin-api-iam-${ENV} --template-file iam.yml --capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-iam-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Monitoring (Log Group, Alarms, ...)
aws cloudformation deploy --stack-name passe-un-dessin-api-monitoring-${ENV} --template-file monitoring.yml \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-monitoring-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Application Loadbalancer
aws cloudformation deploy --stack-name passe-un-dessin-api-alb-${ENV} --template-file alb.yml \
--parameter-overrides VpcId=${VPC_ID} Env=${ENV} Subnets=${SUBNETS} SecurityGroup=$PasseUnDessinApiAlbSg CertificateArn=${ACM_ARN_ALB} --region ${REGION} \
--no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-alb-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## S3
aws cloudformation deploy --stack-name passe-un-dessin-front-s3-${ENV} --template-file s3.yml --parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-front-s3-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Cloudfront - Front
aws cloudformation deploy --stack-name passe-un-dessin-front-cloudfront-${ENV} --template-file cloudfront-front.yml \
--parameter-overrides Env=${ENV} S3Bucket=${FrontS3Bucket} --region ${REGION} CertificateArn=${ACM_ARN} PublicAlias=${DOMAIN} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-front-cloudfront-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Cloudfront
aws cloudformation deploy --stack-name passe-un-dessin-api-cloudfront-${ENV} --template-file cloudfront.yml \
--parameter-overrides Env=${ENV} AlbDNS=${ServiceId} CertificateArn=${ACM_ARN} PublicAlias=${PUBLIC_URL} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-cloudfront-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Postgres
aws cloudformation deploy --stack-name passe-un-dessin-postgres-${ENV} --template-file postgres.yml \
--parameter-overrides Env=${ENV} DBPassword=${DB_PASSWORD} SecurityGroup=$PasseUnDessinDatabaseSg --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-postgres-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## ECS Repository
aws cloudformation deploy --stack-name passe-un-dessin-api-ecs-repository-${ENV} --template-file ecs-repository.yml \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-repository-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Build Docker Image and push it to the ECS Repository
## ./build_docker.sh -r ${REGION} -t $MY_TAG -e ${ENV} -p ${PROFILE}

## Service discovery namespace
aws cloudformation deploy --stack-name passe-un-dessin-api-sd-namespace-${ENV} --template-file service-discovery-namespace.yml \
--parameter-overrides Env=${ENV} Domain=${DOMAIN} VpcId=${VPC_ID} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-service-discovery-namespace-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## ECS Cluster
aws cloudformation deploy --stack-name passe-un-dessin-api-ecs-cluster-${ENV} --template-file ecs-cluster.yml \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-cluster-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## ECS AutoScaling group
aws cloudformation deploy --stack-name passe-un-dessin-api-ecs-autoscaling-${ENV} --template-file autoscaling.yml \
--parameter-overrides Env=${ENV} InstanceProfile=${PasseUnDessinApiEC2InstanceProfile} Subnets=${SUBNETS} AssociatePublicIp=true \
KeyName=${PEM_KEY} SecurityGroup=${PasseUnDessinApiSg} ECSCluster=${ECSCluster} --region ${REGION} \
--no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-api-ecs-autoscaling-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

DATABASE_URL="postgres://passe_un_dessin_user:${DB_PASSWORD}@${DatabaseHostname}:${DatabasePort}/passeundessindb"


## ECS Services

### Backend - Service
aws cloudformation deploy --stack-name passe-un-dessin-api-ecs-service-backend-${ENV} --template-file ecs-service-backend.yml \
--parameter-overrides Env=${ENV} ECSTaskRole=${PasseUnDessinApiTaskRole} ECSAutoScaleRole=${PasseUnDessinApiAutoScaleRole} \
DockerRepository=${PasseUnDessinBackendRepository} CloudwatchLogsGroup=${CloudwatchLogsGroup} TargetGroup=${BackendTargetGroup} \
ECSCluster=${ECSCluster} Tag=${MY_TAG} AlbName=${AlbName} DatabaseUrl=${DATABASE_URL} \
Secret=${SECRET} ServiceDiscoveryNamespace=${ServiceDiscoveryNamespace} --region ${REGION} --no-fail-on-empty-changeset

### Drawing renderer - Service
aws cloudformation deploy --stack-name passe-un-dessin-api-ecs-service-drawing-renderer-${ENV} --template-file ecs-service-drawing-renderer.yml \
--parameter-overrides Env=${ENV} ECSTaskRole=${PasseUnDessinApiTaskRole} ECSAutoScaleRole=${PasseUnDessinApiAutoScaleRole} \
DockerRepository=${PasseUnDessinDrawingRendererRepository} CloudwatchLogsGroup=${CloudwatchLogsGroup} TargetGroup=${DrawingRendererTargetGroup} \
ECSCluster=${ECSCluster} Tag=${MY_TAG} AlbName=${AlbName} DatabaseUrl=${DATABASE_URL} ServiceDiscoveryNamespace=${ServiceDiscoveryNamespace} \
--region ${REGION} --no-fail-on-empty-changeset

### Pushpin - Service
aws cloudformation deploy --stack-name passe-un-dessin-api-ecs-service-pushpin-${ENV} --template-file ecs-service-pushpin.yml \
--parameter-overrides Env=${ENV} ECSTaskRole=${PasseUnDessinApiTaskRole} ECSAutoScaleRole=${PasseUnDessinApiAutoScaleRole} \
DockerRepository=${PasseUnDessinPushpinRepository} CloudwatchLogsGroup=${CloudwatchLogsGroup} TargetGroup=${PushpinTargetGroup} \
ECSCluster=${ECSCluster} Tag=${MY_TAG} AlbName=${AlbName} ServiceDiscoveryNamespace=${ServiceDiscoveryNamespace} \
--region ${REGION} --no-fail-on-empty-changeset
