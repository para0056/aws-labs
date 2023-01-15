import * as cdk from 'aws-cdk-lib';
import { aws_route53 }  from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface Route53ZoneProps extends cdk.StackProps {
  domainName: string;
}

export class Route53ZoneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const route53Zone = new aws_route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.domainName,
    });
  }
}
