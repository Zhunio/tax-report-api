# infrastructure/main.tf
#
# Configure the S3 backend for Terraform state
terraform {
  # Define the S3 backend
  backend "s3" {
    # 💀 Name of the S3 bucket to store the state file 
    bucket = "terraform-tax-report-backend-bucket"
    # Path within the bucket for the state file
    key = "global/s3/terraform.tfstate"
    # AWS region where the bucket is located
    region = "us-east-1"
    # 💀 DynamoDB table used for state locking and consistency
    dynamodb_table = "terraform-tax-report-backend-dynamodb"
    # Ensures the state file is encrypted at rest
    encrypt = true
  }
}

variable "tax_report_database_user" {
  description = "Username for the Tax Report database"
  type        = string
}

variable "tax_report_database_password" {
  description = "Password for the Tax Report database"
  type        = string
}

variable "tax_report_database_name" {
  description = "Name of the Tax Report database"
  type        = string
}

locals {
  # 💀 Replace <project-name> with your project name
  project_name                          = "tax-report"
  tax_report_media_bucket_name          = "terraform-${local.project_name}-media-bucket"
  tax_report_database_subnet_group_name = "terraform-${local.project_name}-database-subnet-group"
  tax_report_database_cluster_name      = "terraform-${local.project_name}-database-cluster"
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

resource "aws_s3_bucket" "tax_report_media_bucket" {
  bucket = local.tax_report_media_bucket_name
}

resource "aws_db_subnet_group" "tax_report_database_subnet_group" {
  name       = local.tax_report_database_subnet_group_name
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_rds_cluster" "tax_report_database_cluster" {
  cluster_identifier   = local.tax_report_database_cluster_name
  master_username      = var.tax_report_database_user
  master_password      = var.tax_report_database_password
  database_name        = var.tax_report_database_name
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

