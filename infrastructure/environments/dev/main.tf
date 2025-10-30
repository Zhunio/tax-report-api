terraform {
  backend "s3" {
    bucket         = "terraform-tax-report-dev-backend-bucket"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-tax-report-dev-backend-dynamodb"
    encrypt        = true
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "tax-report"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

provider "aws" {
  region = "us-east-1"
}

module "media-bucket" {
  source       = "../../modules/media-bucket"
  project_name = var.project_name
  environment  = var.environment
}

module "database" {
  source       = "../../modules/database"
  project_name = var.project_name
  environment  = var.environment
}
