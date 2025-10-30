output "backend_bucket_name" {
  description = "The name of the S3 bucket used for the terraform backend"
  value       = local.backend_bucket_name
}
