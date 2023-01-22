#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CDKContext } from '../type';
import { Route53ZoneStack } from '../lib/route53-zone-stack';
import { TerraformBackendStateStack } from '../lib/tf-state-stack';
import { TerrformIamStack } from '../lib/tf-iam-stack'


// Create Stacks
const createStacks = async () => {
  try {
    const app = new cdk.App();
    const context = getContext(app);
    const deployParameters = getContext(app)
    const props: cdk.StackProps = {
      env: {
        account: context.accountId,
        region: context.accountRegion
      }
    }
    const route53Stack = new Route53ZoneStack(app, 'Route53ZoneStack', props, context.route53Stack)
    const terraformBackendStateStack = new TerraformBackendStateStack(app, 'TerraformBackendStateStack', props, context.terraformBackendStateStack)
  } catch (err) {
    console.error(err);
  }
}

// Get Context
export const getContext = (app: cdk.App): CDKContext => {
  const deployParameters: CDKContext = app.node.tryGetContext("deployParameters");
  const errors = [];
  for (const [key, value] of Object.entries({ ...deployParameters, ...deployParameters.route53Stack })) {
    if (value == null || value === "") {
      errors.push(`Config cdk.json context '${key} requires a value.`)
    }
  }

  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  console.log(JSON.stringify(deployParameters, null, 2));
  return { ...deployParameters }
};


createStacks();

