variable "project_name" {
  description = "Project name used as cluster name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.30"
}

variable "instance_type" {
  description = "EC2 instance type for worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_min_size" {
  description = "Minimum node count"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum node count"
  type        = number
  default     = 3
}

variable "node_desired_size" {
  description = "Desired node count"
  type        = number
  default     = 2
}

variable "vpc_id" {
  description = "VPC ID from VPC module"
  type        = string
}

variable "private_subnets" {
  description = "Private subnet IDs from VPC module"
  type        = list(string)
}
