# AWS deployment architecture

## Network

Create one VPC with at least:

- 2 public subnets in different Availability Zones
- 2 private application subnets
- 2 private database subnets

Recommended placement:

- ALB -> public subnets
- ECS/Fargate -> private application subnets
- RDS PostgreSQL -> private database subnets
- ElastiCache -> private application/database network

## Application

React:

```text
S3 -> CloudFront -> Route 53
```

Node.js:

```text
ECR -> ECS Fargate -> ALB
```

Database:

```text
ECS -> RDS PostgreSQL
```

Cache:

```text
ECS -> ElastiCache
```

Async:

```text
ECS -> SQS -> Lambda
```

Monitoring:

```text
ECS/ALB/RDS/Lambda -> CloudWatch
```

Secrets:

```text
Secrets Manager -> ECS task environment
```

## Security groups

ALB SG:
- inbound 80/443 from internet
- outbound to ECS

ECS SG:
- inbound application port only from ALB SG
- outbound to RDS/Redis/SQS endpoints as required

RDS SG:
- inbound 5432 only from ECS SG

ElastiCache SG:
- inbound Redis port only from ECS SG
