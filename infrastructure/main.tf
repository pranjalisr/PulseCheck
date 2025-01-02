provider "aws" {
  region = "us-west-2"
}

resource "aws_eks_cluster" "pulsecheck_cluster" {
  name     = "pulsecheck-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = ["subnet-12345678", "subnet-87654321"]
  }

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy]
}

resource "aws_iam_role" "eks_cluster_role" {
  name = "eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_ecr_repository" "pulsecheck_repo" {
  name                 = "pulsecheck-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "cluster_endpoint" {
  value = aws_eks_cluster.pulsecheck_cluster.endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.pulsecheck_repo.repository_url
}

