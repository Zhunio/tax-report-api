# infrastructure/bastion/main.tf

# 💀 1. Set the terraform project name
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "tax-report"
}

# 💀 2. Set your public IP address to allow SSH access to the bastion host
#
# You can set this variable in your shell environment like so:
# export TF_VAR_my_public_ip=$(curl https://api.ipify.org)
# 
# OR, you can pass it as a command line variable when applying terraform
# terraform apply -var="my_public_ip=$(curl -s https://api.ipify.org)"
variable "my_public_ip" {
  description = "Your public IP address to allow SSH access to the bastion host"
  type        = string
}

locals {
  bastion_key_name            = "terraform-${var.project_name}-bastion-key"
  bastion_security_group_name = "terraform-${var.project_name}-bastion-security-group"
  bastion_instance_name       = "terraform-${var.project_name}-bastion-instance"
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

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# 💀 3. Generate the SSH key pair first using:
# ssh-keygen -t rsa -b 4096 -f ~/.ssh/terraform-bastion-key
resource "aws_key_pair" "bastion_key" {
  key_name   = local.bastion_key_name
  public_key = file("~/.ssh/terraform-bastion-key.pub")
}

resource "aws_security_group" "bastion_security_group" {
  name   = local.bastion_security_group_name
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.my_public_ip}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "bastion_instance" {
  ami                         = data.aws_ami.amazon_linux.id
  subnet_id                   = data.aws_subnets.default.ids[0]
  key_name                    = aws_key_pair.bastion_key.key_name
  security_groups             = [aws_security_group.bastion_security_group.id]
  instance_type               = "t3.nano"
  associate_public_ip_address = true
}

output "bastion_public_ip" {
  description = "Public IP address of the bastion host"
  value       = aws_instance.bastion_instance.public_ip
}
