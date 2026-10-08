# books-app (backend)

Spring Boot 3, Java 17. See the README one level up for the full guide.

```bash
mvn spring-boot:run     # http://localhost:8080
mvn test
```

- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 console: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/booksdb`, user `sa`, empty password)
- Actuator: `/actuator/health`, `/actuator/metrics`
- PostgreSQL: `mvn spring-boot:run -Dspring-boot.run.profiles=postgres` (env `DB_URL`, `DB_USER`, `DB_PASSWORD`)

## API

| Method | Path | Access |
|---|---|---|
| POST | /api/auth/register, /login, /refresh, /logout | public |
| GET | /api/books?q=&page=&size=&sort=&dir= | public |
| GET | /api/books/{id}, /api/books/stats, /api/books/{id}/cover | public |
| POST / PUT | /api/books, /api/books/{id} | logged in |
| POST / DELETE | /api/books/{id}/cover | logged in |
| DELETE | /api/books/{id} | ADMIN |
| GET | /api/authors | public |
| POST | /api/authors | logged in |
| DELETE | /api/authors/{id} | ADMIN |
| GET | /api/users/me | logged in |
| POST | /api/users/me/password | logged in |
| GET | /api/admin/users | ADMIN |
| PUT | /api/admin/users/{id}/role, /enabled | ADMIN |
| DELETE | /api/admin/users/{id} | ADMIN |

Send the access token as `Authorization: Bearer <accessToken>`.
