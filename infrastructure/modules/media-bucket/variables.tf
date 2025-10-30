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
  tax_report_media_bucket_name = "terraform-${var.project_name}-${var.environment}-media-bucket"
}

