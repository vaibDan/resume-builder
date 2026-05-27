#!/bin/bash
# ---------------------------------------------------------------
# Run this every time after terraform apply creates a new cluster
# ---------------------------------------------------------------

CLUSTER_NAME="resume-builder"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
IAM_USER=$(aws sts get-caller-identity --query Arn --output text)
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy"

echo "=== Step 1: Update kubeconfig ==="
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

echo "=== Step 2: Add IAM access entry ==="
aws eks create-access-entry \
  --cluster-name $CLUSTER_NAME \
  --principal-arn $IAM_USER \
  --type STANDARD 2>/dev/null || echo "Access entry already exists, skipping"

aws eks associate-access-policy \
  --cluster-name $CLUSTER_NAME \
  --principal-arn $IAM_USER \
  --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
  --access-scope type=cluster 2>/dev/null || echo "Policy already associated, skipping"

echo "=== Step 3: Create ALB Controller IAM policy ==="
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json 2>/dev/null || echo "Policy already exists, skipping"

echo "=== Step 4: Delete stale IAM service account if exists ==="
eksctl delete iamserviceaccount \
  --cluster $CLUSTER_NAME \
  --namespace kube-system \
  --name aws-load-balancer-controller 2>/dev/null || echo "No existing service account, skipping"

echo "=== Step 5: Recreate IAM service account fresh ==="
eksctl create iamserviceaccount \
  --cluster $CLUSTER_NAME \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn $POLICY_ARN \
  --approve \
  --override-existing-serviceaccounts

echo "=== Step 6: Verify K8s service account has IAM annotation ==="
kubectl get serviceaccount aws-load-balancer-controller \
  -n kube-system -o yaml | grep amazonaws

echo "=== Step 7: Install/Upgrade ALB controller via Helm ==="
helm repo add eks https://aws.github.io/eks-charts 2>/dev/null
helm repo update

# Use upgrade --install so it works for both fresh install and updates
helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --wait   # waits until pods are running before returning

echo "=== Step 8: Install metrics-server ==="
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

echo "=== Step 9: Verify everything is running ==="
kubectl get pods -n kube-system | grep -E "aws-load-balancer|metrics-server"

echo "=== Done! Cluster is ready. ==="
echo "Now run: kubectl apply -f infra/k8s/"