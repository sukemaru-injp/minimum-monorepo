variable "aws_region" {
  description = "AWS region to deploy resources into."
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "Base name used for tagging and resource naming."
  type        = string
  default     = "minimum-app"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (one per availability zone)."
  type        = list(string)
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (one per availability zone)."
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "container_image" {
  description = "Container image used in the ECS task definition."
  type        = string
  default     = "nginx:latest"
}

variable "container_port" {
  description = "Application port exposed by the ECS task."
  type        = number
  default     = 80
}

variable "desired_count" {
  description = "Number of ECS tasks to run."
  type        = number
  default     = 1
}

variable "db_username" {
  description = "Master username for the RDS instance."
  type        = string
}

variable "db_password" {
  description = "Master password for the RDS instance."
  type        = string
  sensitive   = true
}

variable "db_engine" {
  description = "Database engine for RDS."
  type        = string
  default     = "postgres"
}

variable "db_engine_version" {
  description = "Database engine version."
  type        = string
  default     = "17.6"
}


variable "db_instance_class" {
  description = "Instance class for the RDS database."
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage (in GB) for the RDS instance."
  type        = number
  default     = 20
}

variable "db_port" {
  description = "Port that the database listens on."
  type        = number
  default     = 5432
}

variable "db_backup_retention_period" {
  description = "Number of days to retain automated backups. Set to 0 to disable."
  type        = number
  default     = 7
}

variable "alb_listener_port" {
  description = "Listener port for the Application Load Balancer."
  type        = number
  default     = 80
}

variable "health_check_path" {
  description = "HTTP path used by the ALB target group health checks."
  type        = string
  default     = "/"
}
