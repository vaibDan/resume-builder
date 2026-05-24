output "frontend_url" {
    description = "ECR URL for frontend Docker image"
    value     = aws_ecr_repository.frontend.repository_url
}
output "backend_url" {
  description = "ECR URL for backend image"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_name" {
  description = "ECR repository name for frontend"
  value       = aws_ecr_repository.frontend.name
}

output "backend_name" {
  description = "ECR repository name for backend"
  value       = aws_ecr_repository.backend.name
}
