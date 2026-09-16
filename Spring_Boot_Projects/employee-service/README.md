# employee-service

Spring Boot service that takes an employee `id`, fetches:
1. **Personal info** from the database (JPA repository), and
2. **Position info** from an external API (WebClient),

using the **same id** for both calls, and returns them combined.

## Flow

```
Client
  │  GET /api/v1/employees/{id}
  ▼
EmployeeController
  │  employeeService.getEmployeeDetails(id)
  ▼
EmployeeServiceImpl
  ├──► PersonalInfoRepository.findById(id)     (DB, runs on employeeTaskExecutor)
  └──► PositionApiClient.getPositionInfo(id)   (external API, runs on employeeTaskExecutor)
       (both run in PARALLEL via CompletableFuture, then results are joined)
  │
  ▼
EmployeeResponse { id, personalInfo, positionInfo }
  ▼
Controller returns 200 OK with combined JSON
```

## Package layout

```
src/main/java/com/example/employeeservice/
├── EmployeeServiceApplication.java     # main class
├── controller/
│   └── EmployeeController.java         # GET /api/v1/employees/{id}
├── service/
│   ├── EmployeeService.java            # interface
│   └── impl/EmployeeServiceImpl.java   # combines DB + external API, in parallel
├── repository/
│   └── PersonalInfoRepository.java     # Spring Data JPA repo (DB access)
├── entity/
│   └── PersonalInfo.java               # JPA entity
├── client/
│   └── PositionApiClient.java          # WebClient wrapper for external API
├── dto/
│   ├── PersonalInfoDto.java
│   ├── PositionInfoDto.java
│   └── EmployeeResponse.java           # combined response
├── exception/
│   ├── ResourceNotFoundException.java  # -> 404
│   ├── ExternalApiException.java       # -> 502
│   └── GlobalExceptionHandler.java     # @RestControllerAdvice
└── config/
    ├── WebClientConfig.java            # WebClient bean, base-url + timeout
    └── AsyncConfig.java                # dedicated thread pool for parallel calls
```

## Why CompletableFuture

The DB call and the external API call don't depend on each other — both just need
the same `id`. Running them sequentially wastes time waiting on I/O twice. The
service fires both as `CompletableFuture`s on a dedicated executor
(`employeeTaskExecutor`, not the shared `ForkJoinPool.commonPool()`), waits for
both with `CompletableFuture.allOf(...).join()`, then combines the results.

If you don't need the concurrency (e.g. very low traffic, or you want simpler
code), the same class can just call both methods sequentially instead —
structurally nothing else changes.

## Error handling

- Personal info missing in DB → `ResourceNotFoundException` → HTTP 404
- External API 404 → `ResourceNotFoundException` → HTTP 404
- External API 5xx / timeout / network error → `ExternalApiException` → HTTP 502
- Anything else → HTTP 500

`CompletableFuture.join()` wraps exceptions in `CompletionException`; the service
unwraps it before rethrowing so `GlobalExceptionHandler` sees the real exception
type and returns the right status code.

## Configuration (`src/main/resources/application.yml`)

```yaml
external:
  position-api:
    base-url: http://localhost:9090   # point this at your real Position API
    timeout-ms: 3000
```

The demo uses an in-memory H2 database seeded via `data.sql` (employee ids 1 and 2).
Swap the `spring.datasource` block for your real DB (MySQL/Postgres/etc.) and
remove `data.sql` when using a real, already-populated database.

## Run

```bash
mvn spring-boot:run
```

Then:

```bash
curl http://localhost:8080/api/v1/employees/1
```

Note: with the demo config, this call will succeed for personal info (from H2)
but fail on the external API call unless something is actually listening at
`http://localhost:9090/positions/1` — point `external.position-api.base-url`
at a real or mocked endpoint to see the full combined response.

## Test

```bash
mvn test
```

`EmployeeServiceImplTest` mocks the repository and the API client to verify the
combine logic and the not-found path.

### About the Mockito mock maker (important on newer JDKs)

`src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker` pins Mockito
to the **subclass** mock maker instead of its default **inline** mock maker.

Why: the default inline mock maker creates mocks by dynamically attaching a Java
agent to the running JVM at test time. Since JDK 21 (JEP 451), the JVM restricts
that kind of dynamic self-attach, and on newer JDKs it can fail outright with:

```
MockitoInitializationException: Could not initialize inline Byte Buddy mock maker.
It appears as if your JDK does not supply a working agent attachment mechanism
```

The `-XX:+EnableDynamicAgentLoading` JVM flag (already set for Maven Surefire in
`pom.xml`) works around this when running `mvn test`, but only in environments that
actually pass that flag — IDEs running tests directly often don't. Switching to the
subclass mock maker avoids the whole problem: it generates mocks by simple
subclassing, needs no agent at all, and works identically from Maven, an IDE, or
anywhere else, on any JDK version.

The trade-off: the subclass mock maker can't mock `final` classes, `final` methods,
or `static` methods. None of the classes mocked in this project are `final`, so
this doesn't affect this codebase. If you later need to mock a `final` class or a
static method, either remove `final` from that class/method, or switch back to the
inline mock maker (delete the `mockito-extensions` file) and rely on the JVM flag
instead.
