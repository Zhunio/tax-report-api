# Terraform Infrastructure Setup

## Prerequisites

- [Setup Terraform Backend with AWS S3 and DynamoDB](https://github.com/Zhunio/notes/blob/main/terraform/setup-terraform-backend-with-s3-and-dynamodb.md)

## 1. Setup Environment Variables

```sh
export TF_VAR_tax_report_database_user="your_db_user"
export TF_VAR_tax_report_database_password="your_db_password"
export TF_VAR_tax_report_database_name="your_db_name"
```

## 2. Configure Terraform Backend

```terraform
# infrastructure/main.tf
#
# Configure the S3 backend for Terraform state
terraform {
  # Define the S3 backend
  backend "s3" {
    # 💀 1. Set the terraform backend Bucket name to the one created in infrastructure/backend/main.tf
    bucket = "terraform-<project-name>-backend-bucket"
    # Path within the bucket for the state file
    key = "global/s3/terraform.tfstate"
    # AWS region where the bucket is located
    region = "us-east-1"
    # 💀 2. Set the terraform backend DynamoDB table name to the one created in infrastructure/backend/main.tf
    dynamodb_table = "terraform-<project-name>-backend-dynamodb"
    # Ensures the state file is encrypted at rest
    encrypt = true
  }
}


# 💀 3. Set the terraform project name
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "tax-report"
}
```

## 3. Apply Terraform

```sh
cd infrastructure
terraform init
terraform apply -auto-approve
```

## 4. Destroy Terraform Resources

```sh
cd infrastructure
terraform destroy -auto-approve
```
