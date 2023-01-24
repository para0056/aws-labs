#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { GhBootstrapContext } from "../type";
import { BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import {GithubActionsIdentityProvider} from 'aws-cdk-github-oidc';
import {GithubActionsRole} from 'aws-cdk-github-oidc';

export class GitHubBootstrapStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: GhBootstrapContext) {
        super(scope, id, props);

        // Create OIDC Provider
        const provider = new GithubActionsIdentityProvider(scope, 'GitHubProvider');
       
        // Create Role
        const deployRole = new GithubActionsRole(scope, 'DeployRole',{
            provider: provider,
            owner: context.gitHubOrg,
            repo: context.repoName,
            roleName: context.roleName,
            description: 'This role deploys stuff to AWS',
            maxSessionDuration: cdk.Duration.hours(2),
        })

    }
}