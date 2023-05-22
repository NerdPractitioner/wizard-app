# Character Creator Deployed with CDK (Typescript)
This is a CDK project that deploys the Character Creator application to AWS. It is a work in progress. 
The frontend is deployed to AWS S3 and the backend is deployed as a Lambda function behind an API Gateway.
Cloudfront is used to serve the frontend from S3 and to proxy requests to the API Gateway.
The Primary CDK code for the project can be viewed in wiz-app-stack.ts

## Requirements
[Node](nodejs.org) version 12 or higher.
[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed and configured with your credentials.
[CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) installed globally. `npm install -g aws-cdk`

## Steps Getting Started
This requires you to have the AWS CLI installed and configured with your credentials.
You will need to Bootstrap the CDK in your AWS account. `cdk bootstrap` will do this for you.
Complete the steps to install dependencies, test and run the project locally.

## Local Steps
### Installation
From the root project directory, `npm install:all`. Alternatively, `cd` into into each directory with a `package.json` and `npm install`.
### Test
From the root directory, `npm test` to run all defined unit tests for the API and the UI (frontend). To test each in isolation, `cd` into the relevant directory and `npm test`.
### Run
From the root directory, `npm start` to run both the API and the UI locally. By default, the API is configured to run at `http://localhost:8000`, the UI is configured to run at `http://localhost:3000` and the UI is configured to proxy API requests to `http://localhost:8000`.

## Cloud Deploy Steps
After you have installed dependencies, tested and run the project locally, you can deploy it to AWS.
From the root directory, `npm run build` to build the project. Then, `cdk deploy` to deploy the project to AWS.
From the root directory, `cdk deploy` or `ck deploy --profile <your-profile>` to deploy the API and the UI to AWS. The UI will be served from S3 via Cloudfront. 

