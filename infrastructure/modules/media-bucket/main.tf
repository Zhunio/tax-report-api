resource "aws_s3_bucket" "tax_report_media_bucket" {
  bucket = local.tax_report_media_bucket_name
}
