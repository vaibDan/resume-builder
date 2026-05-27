#!/bin/bash

echo "===== EKS Cleanup Audit ====="

echo -e "\n🔍 Checking EC2 Instances..."
aws ec2 describe-instances \
  --query "Reservations[].Instances[].InstanceId" \
  --output text

echo -e "\n🔍 Checking Load Balancers (ELBv2)..."
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[].LoadBalancerArn" \
  --output text

echo -e "\n🔍 Checking NAT Gateways..."
aws ec2 describe-nat-gateways \
  --query "NatGateways[?State=='available'].NatGatewayId" \
  --output text

echo -e "\n🔍 Checking Elastic IPs..."
aws ec2 describe-addresses \
  --query "Addresses[].PublicIp" \
  --output text

echo -e "\n🔍 Checking Unattached EBS Volumes..."
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query "Volumes[].VolumeId" \
  --output text

echo -e "\n🔍 Checking VPCs..."
aws ec2 describe-vpcs \
  --query "Vpcs[].VpcId" \
  --output text

echo -e "\n🔍 Checking Security Groups..."
aws ec2 describe-security-groups \
  --query "SecurityGroups[].GroupId" \
  --output text

echo -e "\n🔍 Checking CloudWatch Log Groups..."
aws logs describe-log-groups \
  --query "logGroups[].logGroupName" \
  --output text

echo -e "\n===== Audit Complete ====="
