# AWS Full Stack Task Manager

A simple production-style portfolio project using:

- React + Vite
- Node.js + Express
- PostgreSQL
- Redis
- JWT authentication
- Docker Compose
- AWS S3 + CloudFront for frontend
- AWS RDS PostgreSQL
- AWS ElastiCache Redis/Valkey
- AWS ECR + ECS Fargate
- Application Load Balancer
- VPC
- SQS + Lambda
- CloudWatch
- GitHub Actions
- AWS Secrets Manager

## Project structure

```text
aws-task-manager/
├── frontend/
├── backend/
├── lambda/
├── infra/
├── .github/workflows/
├── docker-compose.yml
└── README.md
```

## Build order

1. Run PostgreSQL + Redis with Docker.
2. Start Node.js API.
3. Start React.
4. Test JWT authentication.
5. Test CRUD tasks.
6. Test Redis caching.
7. Dockerize the full application.
8. Create AWS RDS and ElastiCache.
9. Create ECR + ECS/Fargate + ALB.
10. Deploy React to S3 + CloudFront.
11. Add SQS + Lambda.
12. Add CloudWatch and CI/CD.

## Local setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Docker

From the root:

```bash
docker compose up --build
```

Frontend: http://localhost:5173  
API: http://localhost:5000  
Health: http://localhost:5000/health

## Default local database

Database: taskdb  
User: postgres  
Password: postgres  
Port: 5432

Redis: localhost:6379

## API

### Auth

POST `/api/auth/register`

```json
{
  "name": "Sudhakar",
  "email": "sudhakar@example.com",
  "password": "Password@123"
}
```

POST `/api/auth/login`

```json
{
  "email": "sudhakar@example.com",
  "password": "Password@123"
}
```

### Tasks

GET `/api/tasks`

POST `/api/tasks`

```json
{
  "title": "Learn AWS",
  "description": "Build AWS task manager",
  "priority": "HIGH"
}
```

PUT `/api/tasks/:id`

```json
{
  "title": "Learn AWS deeply",
  "status": "DONE"
}
```

DELETE `/api/tasks/:id`

## AWS mapping

Local service -> AWS service

- PostgreSQL -> RDS PostgreSQL
- Redis -> ElastiCache
- Docker image -> ECR
- Docker container -> ECS Fargate
- Load balancing -> ALB
- React static build -> S3
- CDN -> CloudFront
- DNS -> Route 53
- Async queue -> SQS
- Async worker -> Lambda
- Logs/metrics -> CloudWatch
- Secrets -> Secrets Manager
- Networking -> VPC

## Important

Do not commit `.env`, AWS access keys, passwords, or secrets to Git.


docker compose up postgres redis