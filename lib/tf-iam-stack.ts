#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { TfIamContext } from "../type";
import { TerraformBackendStateStack } from './tf-state-stack';


export class TerrformIamStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps, context: TfIamContext) {
        super(scope, id, props);

        const user = new iam.User(this, 'TfIamUser', {
        });

        const tfIamUserAccessKey = new iam.AccessKey(this, 'TfIamUserAcessKey', { user });

        const tfIamUserSecretKey = new secretsmanager.Secret(this, 'tfIamUserSecretKey', {
            secretStringValue: tfIamUserAccessKey.secretAccessKey,
        });

        const tfUserPolicy = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    resources: [''], //s3 arn and object path
                    actions: [
                        's3:GetObject',
                        's3:ListBucket',
                        's3: GetObject',
                        's3:PutObject',
                        's3: DeleteObject'
                    ],
                    effect: iam.Effect.ALLOW,
                }),
                new iam.PolicyStatement({
                    resources: [''],//dynamo table arn
                    actions: [
                        'dynamodb:DescribeTable',
                        'dynamodb:GetItem',
                        'dynamodb:PutItem',
                        'dynamodb:DeleteItem'
                    ],
                    effect: iam.Effect.ALLOW,
                }),
                new iam.PolicyStatement({
                    resources: [''],//kms key arn
                    actions: [
                        'kms:Encrypt',
                        'kms:Decrypt',
                        'kms:GenerateDataKey'
                    ],
                    effect: iam.Effect.ALLOW,
                }),
            ]
    });


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


