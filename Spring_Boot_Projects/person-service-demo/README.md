# Person Service Demo

## What this demonstrates

GET /api/person/{id}

Controller -> Service -> Database
                    |
                    -> External API
                    |
                    -> Combine -> Controller

The example uses H2 so you can run it immediately without installing PostgreSQL.
The mock external API is inside the same application only for local testing.

## Run

Requirements:
- Java 17+
- Maven

Command:

mvn spring-boot:run

Then call:

GET http://localhost:8080/api/person/1001

Expected:

{
  "id": 1001,
  "name": "Sudhakar",
  "email": "sudhakar@example.com",
  "phone": "9876543210",
  "position": "Senior Engineering Lead",
  "department": "Technology"
}

## Test the external API directly

GET http://localhost:8080/mock-external/position/1001

## H2 console

URL:
http://localhost:8080/h2-console

JDBC URL:
jdbc:h2:file:./data/persondb

User:
sa

Password:
(empty)

## Replace mock API later

In PositionApiClient.java replace:

.baseUrl("http://localhost:8080")

and URI:

/mock-external/position/{id}

with your real external API URL and endpoint.

Production improvements:
- API timeout
- retry/circuit breaker
- external API exception handling
- validation
- logging
- authentication
- parallel calls with a configured executor if needed
