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
    -d|--domain)
    DOMAIN="$2"
    shift # past argument
    ;;
    -pu|--prefix-url)
    PREFIX_URL="$2"
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

## Build backend URL
if [ "$ENV" == "production" ]
then
    export REACT_APP_API_BASE_URL=https://api-${PREFIX_URL}.${DOMAIN}/
else
    export REACT_APP_API_BASE_URL=https://api-${ENV}-${PREFIX_URL}.${DOMAIN}/
fi

export $(aws cloudformation describe-stacks --stack-name job4-front-s3-${ENV} --region ${REGION} --output text --query 'Stacks[].Outputs[]' | tr '\t' '=')

yarn build

aws s3 cp ../build s3://${FrontS3Bucket} --recursive

rm -rf ../build
