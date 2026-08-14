# Spring Boot + JPA — 10-Day Intensive Roadmap
### For: Basic Java knowledge, MERN/MEAN background, 10+ hrs/day

This assumes you already know Java syntax, OOP basics, and collections. We skip straight to Spring Boot + JPA and go deep, fast. Each day = 10 hrs: roughly 3 hrs concept/reading, 6 hrs hands-on coding, 1 hr review/notes.

---

## Day 1 — Spring Boot Fundamentals & Project Setup

- Spring Boot architecture: IoC container, ApplicationContext, auto-configuration — understand *why* Spring "just works," not just the annotations
- Maven project setup via Spring Initializr (web, JPA, PostgreSQL/MySQL, Lombok, DevTools dependencies)
- Core annotations: `@SpringBootApplication`, `@RestController`, `@Service`, `@Repository`, `@Component`
- Dependency Injection deep dive: constructor injection (best practice) vs field injection, `@Autowired`, why constructor injection is preferred
- **Hands-on:** Build a "Hello World" REST API with 3 layers (Controller → Service → Repository, repository stubbed) to internalize the layered architecture pattern
- **Output:** Working Spring Boot app with proper package structure (`controller`, `service`, `repository`, `model`, `dto`)

---

## Day 2 — REST APIs in Depth

- `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`
- ResponseEntity and proper HTTP status code handling
- DTO pattern: why you don't expose entities directly (map to your Mongoose/Express habits of separating request/response shapes)
- Request validation: `@Valid`, `@NotNull`, `@NotBlank`, `@Size`, custom validators
- Global exception handling: `@ControllerAdvice` + `@ExceptionHandler` (equivalent to Express error middleware)
- **Hands-on:** Full CRUD REST API for one resource (e.g., "Product" or "Task") with DTOs, validation, and centralized error handling — no database yet, use an in-memory list
- **Output:** Complete CRUD API returning proper status codes and validation errors

---

## Day 3 — JPA & Hibernate Basics

- What JPA/Hibernate actually does (ORM concept — you know this from Mongoose, but relational vs document is the shift)
- `@Entity`, `@Id`, `@GeneratedValue`, `@Table`, `@Column`
- `application.yml` datasource config, connecting to PostgreSQL/MySQL
- Spring Data JPA repositories: `JpaRepository<T, ID>`, derived query methods (`findByName`, `findByEmailAndStatus`)
- **Hands-on:** Rewire Day 2's CRUD API to persist to a real database via JPA repository instead of in-memory list
- **Output:** CRUD API backed by a real Postgres/MySQL database

---

## Day 4 — JPA Relationships

- `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@OneToOne`
- Owning side vs inverse side, `mappedBy`
- Cascade types (`CascadeType.ALL`, `PERSIST`, `REMOVE`) — understand what each does, don't just copy-paste
- FetchType: `LAZY` vs `EAGER` — this trips up almost everyone from a Mongoose background, spend real time here
- **Hands-on:** Model a 2-entity relationship (e.g., `User` → `Task` one-to-many, or `Order` → `OrderItem`). Build endpoints that create/fetch related data correctly.
- **Output:** API with a working parent-child relationship, correct fetch behavior verified by checking generated SQL logs

---

## Day 5 — Advanced Queries & Pagination

- `@Query` with JPQL and native SQL queries
- Pagination and sorting: `Pageable`, `Page<T>`, `Sort`
- Filtering/searching patterns: Specifications API or query methods with multiple conditions
- N+1 query problem — what it is, how to spot it in logs, how to fix with `JOIN FETCH` or `@EntityGraph`
- **Hands-on:** Add search, filter, sort, and pagination to your Day 4 API (e.g., `/tasks?status=DONE&page=0&size=10&sort=createdAt,desc`)
- **Output:** API with production-realistic query capabilities

---

## Day 6 — Transactions, Auth & Security

- `@Transactional` — what it does, propagation basics, when you actually need it
- Spring Security fundamentals: filter chain concept, `SecurityFilterChain` config
- Password hashing with `BCryptPasswordEncoder`
- JWT authentication: generate token on login, validate token on each request via a custom filter (conceptually identical to your Passport-JWT experience in Node)
- **Hands-on:** Add user registration + login + JWT-protected endpoints to your project. Lock down your Task/Order endpoints so only authenticated users can access them.
- **Output:** Secured API with working JWT auth

---

## Day 7 — Testing & Best Practices

- Unit testing with JUnit 5 + Mockito — mock the repository layer, test the service layer
- Integration testing with `@SpringBootTest` and an embedded/test database (H2)
- Basic layered architecture best practices: keep controllers thin, business logic in services, no JPA entities leaking into controllers
- Logging with SLF4J
- **Hands-on:** Write unit tests for your service layer (at least 5-6 meaningful tests) and one integration test for a full request/response cycle
- **Output:** Test suite proving you understand testing conventions (interviewers ask about this often)

---

## Day 8 — Full Project Build (Part 1)

Stop learning isolated concepts — build one cohesive portfolio project end-to-end using everything from Days 1–7.

**Suggested project:** Task/Project Management API (relatable, has enough entities to show relationships, auth, and querying) — or reuse an existing MERN project idea you already have, translated to Spring Boot.

- Design your entity model (2–4 related entities)
- Set up the full project structure from scratch (not copy-pasted from daily exercises)
- Build all CRUD endpoints with DTOs, validation, relationships
- **Output:** ~70% complete backend project

---

## Day 9 — Full Project Build (Part 2) + Frontend Integration

- Finish remaining endpoints, add JWT auth to the project
- Add pagination/filtering to at least one list endpoint
- Hook up a simple React frontend (reuse a component you already have from MERN work) to consume the API — CORS config (`@CrossOrigin` or global config)
- Basic error handling on the frontend for API failures
- **Output:** Complete, working full-stack app (React + Spring Boot + JPA + Postgres + JWT)

---

## Day 10 — Deployment, Docs & Interview Prep

- Dockerize the Spring Boot app (`Dockerfile`, multi-stage build)
- Deploy backend (Render/Railway/AWS) + frontend (Vercel/Netlify), connect them
- Write a clean README for your project (architecture, tech stack, how to run)
- Push to GitHub with a clean commit history
- **Interview prep pass:** Review and be ready to explain out loud —
  - DI and IoC container
  - `@Component` vs `@Service` vs `@Repository` (functionally similar, semantic difference)
  - LAZY vs EAGER fetching and why it matters
  - N+1 problem and how you'd fix it
  - How Spring Security's filter chain processes a request
  - `@Transactional` propagation basics
- **Output:** Deployed, documented, GitHub-ready portfolio project + interview-ready talking points

---

## Non-Negotiable Daily Habit

Each day, before moving to the next topic, **write 3–5 sentences in your own words** explaining what you just learned — no copy-pasting docs. If you can't explain `LAZY` vs `EAGER` fetching in your own words by end of Day 4, you're not ready for Day 5. This single habit is what separates "I followed a tutorial" from "I can defend this in an interview."

## What This Roadmap Deliberately Skips

You have basic Java already, so it assumes you don't need remedial OOP. It also skips (learn later, not urgent for interviews):
- Spring Cloud / microservices patterns
- Kafka/messaging
- WebFlux (reactive)
- Deep Hibernate caching internals

## Reality Check

10 days at 10 hrs/day is aggressive but doable *if* you already have solid Java fundamentals, which you say you do. The two days most people try to rush and shouldn't are **Day 4 (relationships/fetch types)** and **Day 6 (security/JWT)** — these come up constantly in interviews and in real bugs. Don't skip the "explain it in your own words" step on those two days even if you're behind schedule elsewhere.
