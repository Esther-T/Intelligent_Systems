---
name: aws-guidance
description: Provide source-grounded AWS architecture, development, security, infrastructure-as-code, pricing, and troubleshooting guidance. Use whenever answering AWS questions or working with AWS SDKs, IAM, CloudFormation, CDK, SAM, Terraform, service configuration, or AWS-related application code.
---

# AWS guidance

Provide accurate, source-grounded AWS guidance without interacting with an
AWS account.

## Documentation requirements

For AWS behavior, supported features, limits, service availability, IAM
permissions, pricing, configuration syntax, deprecations, or other facts that
may change:

1. Search the AWS Documentation MCP Server.
2. Read the relevant official AWS documentation page.
3. Base the answer on the retrieved documentation.
4. Include links to the official sources used.

Prefer sources in this order:

1. AWS service documentation and API references
2. AWS SDK and tool documentation
3. AWS Well-Architected documentation
4. AWS Prescriptive Guidance
5. Official AWS service announcements or blog posts

Do not treat third-party tutorials as authoritative when official AWS
documentation is available.

## Accuracy

- Never invent an AWS service feature, API field, CLI option, quota, IAM
  action, regional availability claim, or pricing value.
- If documentation cannot confirm a claim, say that it could not be verified.
- Clearly distinguish documented facts from architectural recommendations.
- Identify assumptions, including region, runtime, SDK version, deployment
  model, and expected workload.
- Inspect the repository's manifests and lockfiles when the answer depends on
  an SDK, CDK, Terraform provider, or language version.
- When multiple AWS services could solve the problem, explain the tradeoffs
  instead of presenting one choice as universally correct.

## Security and IAM

- Apply least privilege.
- Do not casually recommend wildcard actions or resources.
- Verify IAM action and resource-level permission support before proposing a
  policy.
- Explain important security boundaries, encryption choices, public-access
  implications, and credential-handling risks.
- Never place credentials, access keys, tokens, or secrets in source code,
  examples, logs, or committed configuration.

## No AWS account access

- Do not run AWS CLI commands against an account.
- Do not call AWS account APIs or inspect live AWS resources.
- Do not request or configure AWS credentials.
- Do not deploy, create, update, or delete AWS resources.
- Local code generation, static analysis, tests, templates, and configuration
  validation are allowed.
- Commands may be shown as examples, but clearly state that they were not run
  against an AWS account.
- If a task genuinely requires account access, explain what would be required
  and stop before performing the account-connected operation.

## Response expectations

When appropriate, include:

- the recommended approach;
- why it fits the stated requirements;
- important alternatives and tradeoffs;
- cost, security, reliability, and operational considerations;
- implementation examples appropriate to the repository;
- links to the official AWS documentation used.