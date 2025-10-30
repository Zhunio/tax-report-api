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
