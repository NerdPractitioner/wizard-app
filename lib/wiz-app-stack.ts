import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class WizAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda for our API
    const apiLambda = new lambda.Function(this, 'APILambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler', 
      code: lambda.Code.fromAsset('api'), 
      environment: {
        PORT: '8000', // Optional: Set any environment variables required by your API
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'APIGateway', {
      deployOptions: {
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Create an integration for the Lambda function
    const apiLambdaIntegration = new apigateway.LambdaIntegration(apiLambda);

    // Create the resource for character and associate the integration
    const characterResource = api.root.addResource('character');
    characterResource.addMethod('POST', apiLambdaIntegration, {
      apiKeyRequired: false,
      });     

    // S3 bucket for hosting our frontend
    const frontendBucket = new s3.Bucket(this, 'frontendBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    });

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'Deployfrontend', {
      sources: [s3deploy.Source.asset('./frontend/build')],
      destinationBucket: frontendBucket,
      prune: true,
    });
    
    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'wizardStaticDistribution', {
      defaultBehavior: { origin: new cloudfront_origins.S3Origin(frontendBucket) },
    });

    // const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfrontOAI');

    // // CloudFront distribution
    // new cloudfront.Distribution(this, 'wizardStaticDistribution', {
    //   defaultBehavior: { origin: new cloudfront_origins.S3Origin(frontendBucket, { originAccessIdentity: cloudfrontOAI }) },
    // });

  }
}
