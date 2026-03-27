# Resume Builder — EKS Deployment Guide

Stack: React (FE) + Node.js (BE) + MongoDB Atlas | Region: us-east-1

---

## Prerequisites

Make sure these are installed locally:
- AWS CLI (configured with `aws configure`)
- Terraform >= 1.5
- kubectl
- Docker

---

## Step 1 — Provision AWS Infrastructure (Terraform)

```bash
cd terraform

# Download providers & modules (~2 min)
terraform init

# Preview what will be created
terraform plan

# Create VPC, EKS cluster, ECR repos, ALB controller (~15 min)
terraform apply
```

After apply, run the printed `configure_kubectl` output command:
```bash
aws eks update-kubeconfig --region us-east-1 --name resume-builder
```

Verify the cluster is reachable:
```bash
kubectl get nodes
```

---

## Step 2 — Encode & Apply Secrets

Get your ECR account ID:
```bash
aws sts get-caller-identity --query Account --output text
```

Encode each secret value:
```bash
echo -n "mongodb+srv://user:pass@cluster.mongodb.net/resume-builder" | base64
echo -n "your-jwt-secret" | base64
echo -n "sk-..." | base64   # OpenAI key
# repeat for ImageKit keys
```

Edit `k8s/secrets.yml` and paste the encoded values, then:
```bash
kubectl apply -f k8s/secrets.yml
```

---

## Step 3 — Build & Push Docker Images to ECR

Replace `<ACCOUNT_ID>` with your AWS account ID (from Step 2).

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and push frontend
docker build -t resume-builder/frontend ./client
docker tag resume-builder/frontend:latest \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/resume-builder/frontend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/resume-builder/frontend:latest

# Build and push backend
docker build -t resume-builder/backend ./server
docker tag resume-builder/backend:latest \
  <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/resume-builder/backend:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/resume-builder/backend:latest
```

---

## Step 4 — Update Image References in Manifests

In both `k8s/server.yml` and `k8s/client.yml`, replace:
```
<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/...
```
with your actual account ID.

---

## Step 5 — Deploy to EKS

```bash
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/server.yml
kubectl apply -f k8s/client.yml
kubectl apply -f k8s/ingress.yml
kubectl apply -f k8s/hpa.yml
```

---

## Step 6 — Get Your App URL

The ALB takes 2-3 minutes to provision after the Ingress is applied:

```bash
kubectl get ingress resume-builder-ingress -n resume-builder
```

Look for the `ADDRESS` column — that's your public URL.

---

## Step 7 — Set Up CI/CD (GitHub Actions)

Add these secrets in your GitHub repo → Settings → Secrets:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |

Every push to `Main` will automatically build, push to ECR, and deploy.

---

## Key Differences from kind

| | kind | EKS |
|---|---|---|
| Service type | NodePort | ClusterIP |
| External access | Port-forward / NodePort | ALB Ingress |
| Images | Local (`kind load`) | ECR |
| MongoDB | In-cluster pod | Atlas (unchanged) |
| Secrets | Plain YAML | Same (consider AWS Secrets Manager for prod) |

---

## Useful Commands

```bash
# Check pod status
kubectl get pods -n resume-builder

# View backend logs
kubectl logs -l app=backend -n resume-builder --tail=50

# View frontend logs
kubectl logs -l app=frontend -n resume-builder --tail=50

# Check HPA scaling
kubectl get hpa -n resume-builder

# Restart a deployment
kubectl rollout restart deployment/backend -n resume-builder

# Destroy everything (careful!)
terraform destroy
```

---

## MongoDB Atlas — Important

Make sure your Atlas cluster's IP Access List includes:
- The **NAT Gateway IP** from your VPC (visible in AWS → VPC → NAT Gateways)
- Or use `0.0.0.0/0` for dev (not recommended for prod)
