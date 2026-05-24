variable "aws_region" {
  description = "AWS region"
  type = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "resume-builder"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}