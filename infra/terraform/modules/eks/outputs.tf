data "aws_eks_cluster_auth" "this" {
  name = module.eks.cluster_name
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_ca_certificate" {
  description = "Base64 encoded cluster CA certificate"
  value       = module.eks.cluster_certificate_authority_data
}

# output "cluster_token" {
#   description = "Authentication token for the cluster"
#   value       = data.aws_eks_cluster_auth.this.token
#   sensitive   = true
# }

output "oidc_provider_arn" {
  description = "OIDC provider ARN — used for IRSA by ALB controller and Secrets Manager"
  value       = module.eks.oidc_provider_arn
}
