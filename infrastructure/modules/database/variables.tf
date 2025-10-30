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
  tax_report_database_subnet_group_name = "terraform-${var.project_name}-${var.environment}-database-subnet-group"
  tax_report_database_cluster_name      = "terraform-${var.project_name}-${var.environment}-database-cluster"
  tax_report_database_instance_name     = "terraform-${var.project_name}-${var.environment}-database-instance"
  tax_report_database_name_key          = "/${var.project_name}/${var.environment}/database/name"
  tax_report_database_user_key          = "/${var.project_name}/${var.environment}/database/user"
  tax_report_database_password_key      = "/${var.project_name}/${var.environment}/database/password"
}

