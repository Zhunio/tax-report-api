# Bastion Host

This guide describes how to set up and use a bastion host to securely access a private database cluster.

## 1. Setup Environment Variables

```sh
export TF_VAR_my_public_ip=$(curl -s https://api.ipify.org)
```

## 3. Configure Terraform

```terraform
# 💀 1. Set the terraform project name
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "tax-report"
}

# 💀 2. Set your public IP address to allow SSH access to the bastion host
variable "my_public_ip" {
  description = "Your public IP address to allow SSH access to the bastion host"
  type        = string
}

# 💀 3. Generate the SSH key pair first using:
# ssh-keygen -t rsa -b 4096 -f ~/.ssh/terraform-bastion-key
resource "aws_key_pair" "bastion_key" {
  key_name   = local.bastion_key_name
  public_key = file("~/.ssh/terraform-bastion-key.pub")
}

```

## 4. Apply Terraform

```sh
cd infrastructure/bastion
terraform init
terraform apply -auto-approve
```

## SSH into Bastion Host

```sh
ssh -i ~/.ssh/terraform-bastion-key ec2-user@<bastion-public-ip>
```
