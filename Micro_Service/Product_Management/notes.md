                    ┌─────────────────────┐
                    │      React UI       │
                    │   TypeScript + MUI  │
                    │    localhost:3000    │
                    └──────────┬──────────┘
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │    API Gateway      │
                    │ Node.js + Express   │
                    │    localhost:5000   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
      ┌──────────────────┐         ┌──────────────────┐
      │ Product Service  │         │  Order Service   │
      │ Node + Express   │         │ Node + Express   │
      │    :5001         │         │    :5002         │
      └────────┬─────────┘         └────────┬─────────┘
               │                            │
               └────────────┬───────────────┘
                            ▼
                   ┌─────────────────┐
                   │   PostgreSQL    │
                   │   products      │
                   │   orders        │
                   └─────────────────┘

What you will learn
    Microservice architecture
    Node.js + Express
    TypeScript
    React + TypeScript
    PostgreSQL
    REST APIs
    Service-to-service communication
    API Gateway
    Docker
    Environment variables
    Database design
    Error handling
    Authentication later
    Redis/Kafka later


docker compose up -d
docker ps

product service:
----------------

http://localhost:5001/health


npm uninstall typescript
npm install --save-dev typescript@5.6.3