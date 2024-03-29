#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CDKContext } from '../type';
import { TerraformBootstrapStack } from '../lib/tf-bootstrap-stack';


// Create Stacks
const createStacks = async () => {
  try {
    const app = new cdk.App();
    const context = getContext(app);
    const deployParameters = getContext(app)
    const props: cdk.StackProps = {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    }
    const terraformBootstrapStack = new TerraformBootstrapStack(app, 'TerraformBootstrapStack', props, context.terraformBootstrapStack)
  } catch (err) {
    console.error(err);
  }
}

// Get Context
export const getContext = (app: cdk.App): CDKContext => {
  const deployParameters: CDKContext = app.node.tryGetContext("deployParameters");
  const errors = [];
  for (const [key, value] of Object.entries({ ...deployParameters, ...deployParameters.terraformBootstrapStack })) {
    // if (value == null || value === "") {
    //   errors.push(`Config cdk.json context '${key} requires a value.`)
    // }
  }

  // if (errors.length > 0) {
  //   throw new Error(JSON.stringify(errors));
  // }

  // console.log(JSON.stringify(deployParameters, null, 2));
  return { ...deployParameters }
};

createStacks();

