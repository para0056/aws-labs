#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Route53ZoneStack } from '../lib/route53-zone-stack';
import { CDKContext } from '../type';
import { EXPORTDECLARATION_TYPES } from '@babel/types';
import { Errors } from 'aws-cdk-lib/aws-stepfunctions';

export const getContext = (app: cdk.App): CDKContext => {
  const deployParameters: CDKContext = app.node.tryGetContext("deployParameters");
  const errors =[];
  for (const [key, value] of Object.entries({ ...deployParameters})) {
    errors.push(`Config cdk.json context '${key} requires a value.`)
  }

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors));
}

console.log(JSON.stringify(deployParameters, null, 2));
return { ...deployParameters }
};


const app = new cdk.App();
const deployParameters = getContext(app)

new Route53ZoneStack(app, 'Route53ZoneStack', {
  "env": {
    "domainName": deployParameters.domainName,
    "account": deployParameters.accountId,
    "region": deployParameters.accountRegion,
  }, ...deployParameters
});


  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
