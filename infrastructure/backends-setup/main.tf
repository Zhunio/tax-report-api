locals {
  environments = ["dev", "prod"]
}

provider "aws" {
  region = "us-east-1"
}

module "backend-setup" {
  for_each     = toset(local.environments)
  source       = "../modules/backend-setup"
  project_name = "tax-report"
  environment  = each.value
}

