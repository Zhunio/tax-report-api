variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "tax-report"
}

variable "my_public_ip" {
  description = "Your public IP address to allow SSH access to the bastion host"
  type        = string
}

locals {
  bastion_key_name            = "terraform-${var.project_name}-bastion-key"
  bastion_security_group_name = "terraform-${var.project_name}-bastion-security-group"
  bastion_instance_name       = "terraform-${var.project_name}-bastion-instance"
}

