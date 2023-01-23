#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { TfBootstrapContext } from "../type";
import { BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3';

export class TerraformBootstrapStack extends cdk.Stack {

    public readonly tfStateBucket: s3.Bucket;
    public readonly tfStateLock: dynamodb.Table;

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: TfBootstrapContext) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const tfStateKey = new kms.Key(this, 'TfStateKey', {
            description: 'Terraform State Bucket Key',
            enableKeyRotation: true,
        })
        const tfStateBucket = new s3.Bucket(this, 'StateBucket', {
            bucketName: context.stateBucketName,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            encryption: BucketEncryption.KMS,
            encryptionKey: tfStateKey,
            enforceSSL: true,
            versioned: true
        });
        this.tfStateBucket = tfStateBucket;

        const tfStateLock = new dynamodb.Table(this, 'StateLock', {
            partitionKey: {
                name: 'LockID',
                type: dynamodb.AttributeType.STRING,
            },
        });

        const user = new iam.User(this, 'TfIamUser', {
            userName: context.userName
        });

        const tfIamUserAccessKey = new iam.AccessKey(this, 'TfIamUserAcessKey', { user });

        const tfIamUserSecretKey = new secretsmanager.Secret(this, 'tfIamUserSecretKey', {
            secretStringValue: tfIamUserAccessKey.secretAccessKey,
        });

        const tfUserPolicyDoc = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    resources: [tfStateBucket.bucketArn, tfStateBucket.arnForObjects('*')],
                    actions: [
                        's3:GetObject',
                        's3:ListBucket',
                        's3:GetObject',
                        's3:PutObject',
                        's3:DeleteObject'
                    ],
                    effect: iam.Effect.ALLOW,
                }),
                new iam.PolicyStatement({
                    resources: [tfStateLock.tableArn],
                    actions: [
                        'dynamodb:DescribeTable',
                        'dynamodb:GetItem',
                        'dynamodb:PutItem',
                        'dynamodb:DeleteItem'
                    ],
                    effect: iam.Effect.ALLOW,
                }),
                new iam.PolicyStatement({
                    resources: [tfStateKey.keyArn],
                    actions: [
                        'kms:Encrypt',
                        'kms:Decrypt',
                        'kms:GenerateDataKey'
                    ],
                    effect: iam.Effect.ALLOW,
                }),
            ]
        });

        const tfUserPolicy = new iam.Policy(this, 'TfUserPolicy', {
            document: tfUserPolicyDoc,
        })

        tfUserPolicy.attachToUser(user);

        const tfIamRole = new iam.Role(this, 'TfIamRole', {
            assumedBy: user,
            description: 'IAM Role for Terraform Provider',
        });

        const adminPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
            'AdministratorAccess'
        );

        tfIamRole.addManagedPolicy(adminPolicy)


    }
}
interface ConsumerProps extends cdk.StackProps {
    myBucket: s3.IBucket
}

interface ConsumerProps extends cdk.StackProps {
    myTable: dynamodb.ITable
}

