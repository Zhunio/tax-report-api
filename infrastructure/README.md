# Terraform Infrastructure Setup

## Prerequisites

- [Setup Terraform Backend with AWS S3 and DynamoDB](https://github.com/Zhunio/notes/blob/main/terraform/setup-terraform-backend-with-s3-and-dynamodb.md)

## 1. Configure the S3 backend for Terraform state

- [x] 1. Set the terraform backend Bucket name to the one created in infrastructure/backend/main.tf
- [x] 2. Set the terraform backend DynamoDB table name to the one created in infrastructure/backend/main.tf
- [x] 3. Set the terraform project name

## 2. Setup Environment Variables

```sh
export TF_VAR_tax_report_database_user="your_db_user"
export TF_VAR_tax_report_database_password="your_db_password"
export TF_VAR_tax_report_database_name="your_db_name"
```

## 3. Apply Terraform

```sh
cd infrastructure
terraform init
terraform apply -auto-approve
```
