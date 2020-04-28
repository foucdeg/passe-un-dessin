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

## S3
aws cloudformation deploy --stack-name passe-un-dessin-front-s3-${ENV} --template-file s3.yml --parameter-overrides Env=${ENV} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-front-s3-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

## Cloudfront
aws cloudformation deploy --stack-name passe-un-dessin-front-cloudfront-${ENV} --template-file cloudfront.yml \
--parameter-overrides Env=${ENV} S3Bucket=${FrontS3Bucket} --region ${REGION} --no-fail-on-empty-changeset

export $(aws cloudformation describe-stacks --stack-name passe-un-dessin-front-cloudfront-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')
