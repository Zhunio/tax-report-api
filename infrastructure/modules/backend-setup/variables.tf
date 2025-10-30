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

locals {
  # Name of the S3 bucket to use for storing the terraform backend
  backend_bucket_name = "terraform-${var.project_name}-${var.environment}-backend-bucket"
  # Name of the DynamoDB table to use for locking the terraform state
  backend_dynamodb_table_name = "terraform-${var.project_name}-${var.environment}-backend-dynamodb"
}
