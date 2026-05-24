module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.project_name
  cluster_version = var.cluster_version

  vpc_id                         = var.vpc_id
  subnet_ids                     = var.private_subnets
  control_plane_subnet_ids       = var.private_subnets
  cluster_endpoint_public_access = true   # allows kubectl from laptop

  # OIDC provider — required for IRSA (IAM Roles for Service Accounts)
  # Used by ALB controller and Secrets Manager CSI driver
  enable_irsa = true

  eks_managed_node_groups = {
    main = {
      instance_types = [var.instance_type]
      min_size       = var.node_min_size
      max_size       = var.node_max_size
      desired_size   = var.node_desired_size

      # Nodes in private subnets — traffic out via NAT Gateway
      # This gives a fixed outbound IP to whitelist in MongoDB Atlas
      labels = {
        role        = "main"
        environment = var.environment
      }
    }
  }

  # Allow node-to-node communication on all ports
  node_security_group_additional_rules = {
    ingress_self_all = {
      description = "Node to node all ports/protocols"
      protocol    = "-1"
      from_port   = 0
      to_port     = 0
      type        = "ingress"
      self        = true
    }
  }
}
