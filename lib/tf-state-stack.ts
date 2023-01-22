#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as kms from 'aws-cdk-lib/aws-kms'
import { Construct } from 'constructs';
import { TfStateContext } from "../type";
import { BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3';

export class TerraformBackendStateStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps, context: TfStateContext) {
        super(scope, id, props);

        // The code that defines your stack goes here

        const tfStateBucket = new s3.Bucket(this, 'StateBucket', {
            bucketName: context.stateBucketName,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            encryption: BucketEncryption.KMS,
            enforceSSL: true,
            versioned: true
        })

        const tfStateLock = new dynamodb.Table(this, 'StateLock', {
            partitionKey: {
                name: 'LockID',
                type: dynamodb.AttributeType.STRING,
            },
        });

    }
}

