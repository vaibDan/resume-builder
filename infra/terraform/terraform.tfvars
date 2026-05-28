
# General
aws_region   = "us-east-1"
project_name = "resume-builder"
environment  = "dev"

# VPC
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidr   = "10.0.1.0/24"
private_subnet_cidrs = ["10.0.2.0/24", "10.0.3.0/24"]


# EKS
cluster_version   = "1.35"
instance_type     = "t3.medium"
node_min_size     = 1
node_max_size     = 3
node_desired_size = 2