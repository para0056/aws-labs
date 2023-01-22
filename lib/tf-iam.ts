#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { TfIamContext } from "../type";

export class TerrformIamStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps, context: TfIamContext) {
        super(scope, id, props);

        const user = new iam.User(this, 'TfIamUser', {
        });
        
        const tfIamUserAccessKey = new iam.AccessKey(this, 'TfIamUserAcessKey', { user });

        const tfIamUserSecretKey = new secretsmanager.Secret(this, 'tfIamUserSecretKey', {
            secretStringValue: tfIamUserAccessKey.secretAccessKey,
        });

        user.addToPolicy(new iam.PolicyStatement ({
            effect: iam.Effect.ALLOW,
            resources: [],//Role to be created,
            actions: ['sts:AssumeRole']
        }));
        
    }
}

// export class Route53ZoneStack extends cdk.Stack {
//     constructor(scope: Construct, id: string, props: cdk.StackProps, context: Route53Context) {
//       super(scope, id, props);
  
//       // The code that defines your stack goes here
  
//       new aws_route53.PublicHostedZone(this, 'HostedZone', {
//         zoneName: context.domainName,
//       });
//     }
//   }
  

