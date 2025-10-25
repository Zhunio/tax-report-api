# infrastructure/main.tf
#
# Configure the S3 backend for Terraform state
terraform {
  # Define the S3 backend
  backend "s3" {
    # 💀 1. Set the terraform backend Bucket name to the one created in infrastructure/backend/main.tf 
    bucket = "terraform-tax-report-backend-bucket"
    # Path within the bucket for the state file
    key = "global/s3/terraform.tfstate"
    # AWS region where the bucket is located
    region = "us-east-1"
    # 💀 2. Set the terraform backend DynamoDB table name to the one created in infrastructure/backend/main.tf
    dynamodb_table = "terraform-tax-report-backend-dynamodb"
    # Ensures the state file is encrypted at rest
    encrypt = true
  }

  required_providers {
    random = {
      source  = "hashicorp/random"
      version = ">= 3.1.0"
    }
  }
}

# 💀 3. Set the terraform project name
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "tax-report"
}

locals {
  tax_report_media_bucket_name          = "terraform-${var.project_name}-media-bucket"
  tax_report_database_subnet_group_name = "terraform-${var.project_name}-database-subnet-group"
  tax_report_database_cluster_name      = "terraform-${var.project_name}-database-cluster"
  tax_report_database_instance_name     = "terraform-${var.project_name}-database-instance"
}

provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_ssm_parameter" "tax_report_database_name" {
  name  = "/${var.project_name}/database/name"
  type  = "String"
  value = "taxreport"
}

resource "aws_ssm_parameter" "tax_report_database_user" {
  name  = "/${var.project_name}/database/user"
  type  = "String"
  value = "root"
}

resource "random_password" "tax_report_database_random_password" {
  length  = 16
  special = false
}

resource "aws_ssm_parameter" "tax_report_database_password" {
  name  = "/${var.project_name}/database/password"
  type  = "SecureString"
  value = random_password.tax_report_database_random_password.result
}

resource "aws_s3_bucket" "tax_report_media_bucket" {
  bucket = local.tax_report_media_bucket_name
}

resource "aws_db_subnet_group" "tax_report_database_subnet_group" {
  name       = local.tax_report_database_subnet_group_name
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_rds_cluster" "tax_report_database_cluster" {
  cluster_identifier   = local.tax_report_database_cluster_name
  master_username      = aws_ssm_parameter.tax_report_database_user.value
  master_password      = aws_ssm_parameter.tax_report_database_password.value
  database_name        = aws_ssm_parameter.tax_report_database_name.value
  db_subnet_group_name = aws_db_subnet_group.tax_report_database_subnet_group.name
  engine               = "aurora-mysql"
  engine_version       = "8.0.mysql_aurora.3.10.1"
  engine_mode          = "provisioned"
  skip_final_snapshot  = true


  serverlessv2_scaling_configuration {
    min_capacity = 0.5
    max_capacity = 2
  }
}

resource "aws_rds_cluster_instance" "tax_report_database_instance" {
  identifier         = local.tax_report_database_instance_name
  cluster_identifier = aws_rds_cluster.tax_report_database_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.tax_report_database_cluster.engine
  engine_version     = aws_rds_cluster.tax_report_database_cluster.engine_version
}
