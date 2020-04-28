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
    -pu|--prefix-url)
    PREFIX_URL="$2"
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

## Build Public URL
if [ "$ENV" == "production" ]
then
    PUBLIC_URL=api-${PREFIX_URL}.${DOMAIN}
else
    PUBLIC_URL=api-${ENV}-${PREFIX_URL}.${DOMAIN}
fi

# We launch all the Job4-api cloudformation and get Outputs into variables

## Security Groups
aws cloudformation deploy --stack-name Job4-api-sg-${ENV} --template-file security-groups.yml \
--parameter-overrides VpcId=${VPC_ID} Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-sg-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## IAM Roles
aws cloudformation deploy --stack-name Job4-api-iam-${ENV} --template-file iam.yml --capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-iam-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Monitoring (Log Group, Alarms, ...)
aws cloudformation deploy --stack-name Job4-api-monitoring-${ENV} --template-file monitoring.yml \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-monitoring-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Application Loadbalancer
aws cloudformation deploy --stack-name Job4-api-alb-${ENV} --template-file alb.yml \
--parameter-overrides VpcId=${VPC_ID} Env=${ENV} Subnets=${SUBNETS} SecurityGroup=$Job4ApiAlbSg CertificateArn=${ACM_ARN_ALB} --region ${REGION} \
--no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-alb-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Cloudfront
aws cloudformation deploy --stack-name Job4-api-cloudfront-${ENV} --template-file cloudfront.yml \
--parameter-overrides Env=${ENV} AlbDNS=${ServiceId} CertificateArn=${ACM_ARN} PublicAlias=${PUBLIC_URL} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-cloudfront-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Postgres
aws cloudformation deploy --stack-name Job4-postgres-${ENV} --template-file postgres.yml \
--parameter-overrides Env=${ENV} DBPassword=${DB_PASSWORD} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-postgres-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## ECS Repository
aws cloudformation deploy --stack-name Job4-api-ecs-repository-${ENV} --template-file ecs-repository.yml \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-repository-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Build Docker Image and push it to the ECS Repository
./build_docker.sh -r ${REGION} -t $MY_TAG -e ${ENV} -p ${PROFILE}

## ECS Cluster
aws cloudformation deploy --stack-name Job4-api-ecs-cluster-${ENV} --template-file ecs-cluster.yml \
--parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-cluster-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## ECS AutoScaling group
aws cloudformation deploy --stack-name Job4-api-ecs-autoscaling-${ENV} --template-file autoscaling.yml \
--parameter-overrides Env=${ENV} InstanceProfile=${Job4ApiEC2InstanceProfile} Subnets=${SUBNETS} AssiociatePublicIp=true \
KeyName=${PEM_KEY} SecurityGroup=${Job4ApiSg} ECSCluster=${ECSCluster} --region ${REGION} \
--no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-ecs-autoscaling-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## ECS Services
aws cloudformation deploy --stack-name Job4-api-ecs-services-${ENV} --template-file ecs-services.yml \
--parameter-overrides Env=${ENV} ECSTaskRole=${Job4ApiTaskRole} ECSAutoScaleRole=${Job4ApiAutoScaleRole} \
DockerRepository=${Job4ApiRepository} CloudwatchLogsGroup=${CloudwatchLogsGroup} TargetGroup=${TargetGroup} TargetGroupName=${TargetGroupName} \
ECSCluster=${ECSCluster} Tag=${MY_TAG} ECSServiceRole=${Job4ApiServiceRole} AlbName=${AlbName} --region ${REGION} --no-fail-on-empty-changeset

## S3
aws cloudformation deploy --stack-name Job4-api-s3-${ENV} --template-file s3.yml --parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name Job4-api-s3-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
