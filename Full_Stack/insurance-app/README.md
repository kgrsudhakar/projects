# SafeGuard Insurance – React + Tailwind + Spring Boot microservices + PostgreSQL

Architecture: React (5173) -> api-gateway (8080) -> policy-service (8081, policydb) / claim-service (8082, claimdb). claim-service calls policy-service to validate policy IDs.

## Run
```
docker compose up --build        # postgres + 3 Spring services
cd frontend && npm install && npm run dev   # http://localhost:5173
```
Without Docker: start Postgres with `init-db.sql`, then `mvn spring-boot:run` in each service folder.

## API (via gateway :8080)
- GET/POST /api/policies, GET/PUT/DELETE /api/policies/{id}
- GET/POST /api/claims (?policyId=), PATCH /api/claims/{id}/status
