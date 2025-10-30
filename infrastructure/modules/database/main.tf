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
  name  = local.tax_report_database_name_key
  type  = "String"
  value = "taxreport"
}

resource "aws_ssm_parameter" "tax_report_database_user" {
  name  = local.tax_report_database_user_key
  type  = "String"
  value = "root"
}

resource "random_password" "tax_report_database_random_password" {
  length  = 16
  special = false
}

resource "aws_ssm_parameter" "tax_report_database_password" {
  name  = local.tax_report_database_password_key
  type  = "SecureString"
  value = random_password.tax_report_database_random_password.result
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
