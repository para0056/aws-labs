import * as cdk from 'aws-cdk-lib';
import { aws_route53 } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Route53Context } from "../type";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Route53ZoneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps, context: Route53Context) {
    super(scope, id, props);

    // The code that defines your stack goes here

    new aws_route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: context.domainName,
    });
  }
}
