# Terraform Infrastructure Setup

## Prerequisites

- [Setup Terraform Backend with AWS S3 and DynamoDB](https://github.com/Zhunio/notes/blob/main/terraform/setup-terraform-backend-with-s3-and-dynamodb.md)

## Configure the S3 backend for Terraform state

To use a different S3 bucket or DynamoDB table for Terraform state:

1. Set the terraform backend Bucket name to the one created in infrastructure/backend/main.tf
2. Set the terraform backend DynamoDB table name to the one created in infrastructure/backend/main.tf

## Specifying the following variables

Set the following environment variables before running Terraform:

```sh
export TF_VAR_tax_report_database_user="your_db_user"
export TF_VAR_tax_report_database_password="your_db_password"
export TF_VAR_tax_report_database_name="your_db_name"
```

## Apply Terraform

```sh
cd infrastructure
terraform init
terraform apply -auto-approve
```
