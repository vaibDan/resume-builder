variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "resume-builder"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}