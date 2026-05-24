output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "configure_kubectl" {
  description = "Command to update local kubeconfig"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "frontend_ecr_url" {
  description = "ECR URL for frontend Docker image"
  value       = module.ecr.frontend_url
}

output "backend_ecr_url" {
  description = "ECR URL for backend Docker image"
  value       = module.ecr.backend_url
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "nat_gateway_ip" {
  description = "NAT Gateway public IP — whitelist this in MongoDB Atlas"
  value       = module.vpc.nat_gateway_ip
}
