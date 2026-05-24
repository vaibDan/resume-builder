terraform {
  backend "s3" {
    bucket       = "resume-builder-tfstate" # This bucket must be already exist in your aws account
    key          = "resume-builder/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}