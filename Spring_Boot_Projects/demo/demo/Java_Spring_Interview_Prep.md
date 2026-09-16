# Java & Spring Interview Preparation Guide

---

# PART 1 — JAVA

## 1. JVM Memory Model

The JVM divides runtime memory into distinct areas:

| Area | Purpose | Shared? |
|---|---|---|
| **Heap** | All objects and arrays live here. Divided into **Young Generation** (Eden + 2 Survivor spaces) and **Old Generation (Tenured)**. | Shared across threads |
| **Metaspace** (Java 8+, replaced PermGen) | Class metadata, method info, runtime constant pool. Grows in native memory, not bounded by `-Xmx`. | Shared |
| **Stack** | Each thread gets its own stack. Stores stack frames — local variables, method call info, partial results. | Per-thread |
| **PC Register** | Holds address of the current executing instruction. | Per-thread |
| **Native Method Stack** | For native (JNI) method calls. | Per-thread |

**Object lifecycle & GC:**
- New objects → Eden space.
- Survive a minor GC → moved to Survivor space; age counter incremented.
- After surviving enough GC cycles (tenuring threshold) → promoted to Old Gen.
- Old Gen fills up → Major/Full GC (more expensive, stop-the-world).

**Garbage Collectors to know:** Serial, Parallel, CMS (deprecated), **G1 (default since Java 9)**, ZGC/Shenandoah (low-latency, for huge heaps).

**Common interview questions:**
- Difference between stack and heap memory → stack is thread-local & fast, stores primitives/references; heap is shared & stores actual objects.
- `OutOfMemoryError: Java heap space` vs `OutOfMemoryError: Metaspace` — different causes (too many objects vs too many loaded classes, e.g. classloader leaks).
- What causes a memory leak in Java despite GC? — unintentional object references (static collections, unclosed resources, listeners not de-registered).

---

## 2. OOPs Concepts

**Four Pillars:**
1. **Encapsulation** – bundling data + methods, hiding internal state via `private` fields and public getters/setters.
2. **Inheritance** – `extends` for code reuse; `implements` for contract. Java supports single inheritance for classes, multiple for interfaces.
3. **Polymorphism**
   - *Compile-time (static)*: method overloading.
   - *Runtime (dynamic)*: method overriding, resolved via **dynamic dispatch** (vtable lookup).
4. **Abstraction** – exposing only relevant details via abstract classes/interfaces.

**Abstract class vs Interface (classic question):**
| Abstract Class | Interface |
|---|---|
| Can have state (instance fields) | Only constants (`public static final`) |
| Can have constructors | No constructors |
| Single inheritance | Multiple inheritance |
| Can mix abstract + concrete methods | Since Java 8: default & static methods allowed |

**Other frequently asked:**
- `==` vs `.equals()` — reference vs logical equality.
- Contract between `equals()` and `hashCode()` — equal objects **must** have equal hashcodes (breaking this breaks `HashMap`/`HashSet`).
- Composition vs Inheritance — "favor composition over inheritance" (avoids tight coupling, fragile base class problem).
- `super` keyword, constructor chaining, `this()` vs `super()`.
- Association, Aggregation (HAS-A, weak), Composition (HAS-A, strong/ownership).

---

## 3. Java 8 Concepts

### 3.1 Lambda Expressions
Syntax sugar for implementing a **functional interface** inline.
```java
Runnable r = () -> System.out.println("Running");
Comparator<String> c = (a, b) -> a.length() - b.length();
```
- Enables behavior parameterization (pass code as data).
- Captures effectively-final local variables (closures).

### 3.2 Functional Interface
An interface with **exactly one abstract method** (SAM – Single Abstract Method). Can have default/static methods too.
```java
@FunctionalInterface
interface Calculator { int operate(int a, int b); }
```
Built-in ones (`java.util.function`): `Function<T,R>`, `Predicate<T>`, `Consumer<T>`, `Supplier<T>`, `BiFunction`, `UnaryOperator`.

### 3.3 Functional Programming
Paradigm treating computation as evaluation of pure functions, avoiding shared mutable state and side effects. Java isn't purely functional but Java 8 brought first-class function references, immutability encouragement, and declarative pipelines (Streams).

### 3.4 Stream API
Declarative processing of collections.
```java
List<String> result = list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```
- **Intermediate ops** (lazy): `filter`, `map`, `sorted`, `distinct`, `flatMap`.
- **Terminal ops** (trigger execution): `collect`, `forEach`, `reduce`, `count`, `anyMatch`.
- Streams are **single-use** and don't mutate the source.
- `parallelStream()` uses the common `ForkJoinPool` — good for CPU-bound, large datasets; risky with shared mutable state or I/O.
- `Collectors.groupingBy`, `partitioningBy`, `joining`, `toMap` are common interview asks.

### 3.5 Default Methods
Interfaces can have method bodies using `default`, allowing API evolution without breaking existing implementers.
```java
interface Vehicle { default void start() { System.out.println("Starting..."); } }
```
- If a class implements two interfaces with the same default method → **diamond problem** → must override explicitly (`InterfaceA.super.method()`).

### 3.6 Map Implementation Changes (Java 8)
- New default methods on `Map`: `getOrDefault`, `putIfAbsent`, `compute`, `computeIfAbsent`, `computeIfPresent`, `merge`, `forEach`.
- **`HashMap` internal change:** buckets with too many collisions (≥8 entries, table size ≥64) convert from a linked list to a **balanced red-black tree** → worst-case lookup improves from O(n) to O(log n).

### 3.7 Optional
Container object to avoid `NullPointerException` and express "may be absent" explicitly in APIs.
```java
Optional<String> name = Optional.ofNullable(getName());
name.map(String::toUpperCase).orElse("DEFAULT");
```
- `of()` throws NPE if null; `ofNullable()` allows null; `orElseGet()` is lazy vs `orElse()` eager.
- Best practice: use as a **return type**, not as a field or method parameter.

---

## 4. Collections

### General hierarchy
- `Collection` → `List` (ArrayList, LinkedList, Vector), `Set` (HashSet, LinkedHashSet, TreeSet), `Queue`/`Deque` (ArrayDeque, PriorityQueue).
- `Map` is **not** a `Collection` — separate hierarchy.

### 4.1 Map
| Implementation | Ordering | Null keys/values | Thread-safe |
|---|---|---|---|
| `HashMap` | No order | 1 null key, many null values | No |
| `LinkedHashMap` | Insertion order (or access order) | Same as HashMap | No |
| `TreeMap` | Sorted by key | No null keys | No |
| `Hashtable` | No order | No nulls | Yes (legacy, synchronized) |
| `ConcurrentHashMap` | No order | No nulls | Yes (segment/bucket-level locking) |

**HashMap internals (very common question):**
- Backed by an array of buckets (`Node<K,V>[] table`).
- `hash(key)` → bucket index via `(n-1) & hash`.
- Collisions handled by linked list, converted to tree if list exceeds threshold (8).
- Resize (rehashing) when `size > capacity * loadFactor` (default load factor 0.75).
- Not thread-safe: concurrent modification can cause infinite loops (Java 7) or data loss.

### 4.2 TreeMap
- Implements `NavigableMap`, backed by a **Red-Black Tree**.
- Keys sorted naturally (`Comparable`) or via a custom `Comparator` passed at construction.
- O(log n) for `get`, `put`, `remove`.
- Useful methods: `firstKey()`, `lastKey()`, `higherKey()`, `lowerKey()`, `ceilingKey()`, `floorKey()`, `subMap()`, `headMap()`, `tailMap()`.
- Does not allow `null` keys (NPE when comparing).

**`ConcurrentModificationException`:** thrown when a collection is structurally modified while iterating with a fail-fast iterator; use `Iterator.remove()` or `CopyOnWriteArrayList`/`ConcurrentHashMap` instead.

---

## 5. Multi-Threading

**Creating threads:** extend `Thread`, implement `Runnable`, or implement `Callable` (returns a value, can throw checked exceptions) run via `ExecutorService`.

**Key concepts:**
- **Thread lifecycle:** New → Runnable → Running → Blocked/Waiting/Timed-Waiting → Terminated.
- **synchronized** — intrinsic lock (monitor) on an object; only one thread can hold it. Can be applied to methods or blocks.
- **volatile** — guarantees visibility of changes across threads (no caching in registers/CPU cache) but **not atomicity**.
- **Atomic classes** (`AtomicInteger`, `AtomicLong`) — lock-free, CAS (compare-and-swap) based thread-safe operations.
- **Locks** (`java.util.concurrent.locks`) — `ReentrantLock` offers `tryLock()`, fairness policies, interruptible locking (more flexible than `synchronized`).
- **wait/notify/notifyAll** — must be called inside a synchronized block; used for inter-thread communication (classic producer-consumer).
- **ExecutorService & Thread Pools** — `Executors.newFixedThreadPool()`, `newCachedThreadPool()`, `newScheduledThreadPool()`. Prefer over manually managing threads.
- **Future / CompletableFuture** — async computation; `CompletableFuture` supports chaining (`thenApply`, `thenCompose`, `thenCombine`) and non-blocking pipelines.
- **Deadlock** — circular wait on locks; avoid via lock ordering, `tryLock` with timeout.
- **Race condition** — outcome depends on thread timing; fix via synchronization or atomics.
- **ThreadLocal** — per-thread variable copy, useful for user context, DB connections; must be cleared to avoid leaks in thread-pooled environments.

---

## 6. String

- **Immutability:** Once created, a `String`'s value can't change. Any "modification" creates a new object. Benefits: thread safety, safe for hashing (used heavily as `HashMap` keys), security (e.g., class loading, network URLs).
- **String Pool (intern pool):** String literals are stored in a special pool in the heap (moved out of PermGen since Java 7). `new String("abc")` creates a new object outside the pool; `.intern()` forces pool lookup/insertion.
- **StringBuilder vs StringBuffer:** `StringBuilder` is mutable & fast (not thread-safe); `StringBuffer` is mutable & synchronized (thread-safe, slower). Use `StringBuilder` for single-threaded string concatenation in loops.
- `String s1 = "abc"; String s2 = "abc";` → `s1 == s2` is `true` (same pool reference). `new String("abc") == "abc"` → `false`.
- `equals()` compares content; `==` compares reference.
- Common gotcha: string concatenation with `+` inside loops compiles to repeated `StringBuilder` creation — inefficient; use a single `StringBuilder` explicitly.

---

## 7. Exceptions

**Hierarchy:** `Throwable` → `Error` (JVM-level, not meant to be caught, e.g. `OutOfMemoryError`) and `Exception`.
- **Checked exceptions** (extend `Exception`, not `RuntimeException`) — must be declared/caught at compile time (`IOException`, `SQLException`).
- **Unchecked exceptions** (extend `RuntimeException`) — not enforced by compiler (`NullPointerException`, `IllegalArgumentException`).

**try-catch-finally-try-with-resources:**
```java
try (BufferedReader br = new BufferedReader(new FileReader("f.txt"))) {
    // ...
} catch (IOException e) {
    // handle
} finally {
    // always executes (unless JVM exits)
}
```
- Try-with-resources auto-closes any `AutoCloseable`, even on exception — preferred over manual `finally` cleanup.
- **Custom exceptions** — extend `Exception` or `RuntimeException`, provide constructors, useful for domain-specific error signaling.
- **Exception chaining** — pass original as `cause` (`new ServiceException("msg", originalEx)`) to preserve root cause in stack trace.
- Best practices: don't swallow exceptions silently, don't catch generic `Exception` unless necessary, fail fast, use unchecked for programming errors and checked for recoverable conditions.

---

## 8. Exceptions for Collection Frameworks

| Exception | When it's thrown |
|---|---|
| `ConcurrentModificationException` | Structural modification of a collection during iteration (fail-fast iterators). |
| `UnsupportedOperationException` | Calling a mutator method (`add`, `remove`) on an immutable/fixed-size collection, e.g. `List.of()`, `Arrays.asList()`, `Collections.unmodifiableList()`. |
| `NoSuchElementException` | Calling `next()` on an exhausted `Iterator`, or `Optional.get()` on empty Optional (actually throws `NoSuchElementException` too), or `Collections.min()` on empty collection. |
| `ClassCastException` | Adding an incompatible type to a raw/generic collection, or improper casting during retrieval. |
| `NullPointerException` | Inserting `null` into collections that disallow it (`TreeMap`, `TreeSet`, `Hashtable`, `ConcurrentHashMap`). |
| `IndexOutOfBoundsException` | Invalid index access on `List`/array-backed structures. |
| `IllegalStateException` | Calling `Iterator.remove()` before `next()`, or misusing `Stream` after terminal op consumed it. |

---

# PART 2 — UNIT TESTING & JUNIT 5

## 1. Unit Test Coverage
- Measures % of code exercised by tests: **line coverage, branch coverage, path coverage**.
- Tools: JaCoCo (most common in Java/Maven/Gradle builds), Cobertura.
- High coverage ≠ good tests — coverage tells you what ran, not whether assertions are meaningful. Aim for coverage of critical business logic + edge cases, not 100% vanity metrics.

## 2. Test Pyramid
```
        /\
       /UI\        <- few, slow, expensive (E2E)
      /----\
     /Integr.\     <- some (service/DB/API level)
    /--------\
   /  Unit    \    <- many, fast, cheap, isolated
  /____________\
```
- **Unit tests**: fast, isolate a single class/method, mock dependencies. Majority of tests.
- **Integration tests**: verify components work together (e.g., Spring context, DB, REST layer).
- **E2E/UI tests**: fewest, verify full user flows, expensive and brittle — kept minimal.

## 3. Unit Test Principles and Structure
- **FIRST principles**: Fast, Independent, Repeatable, Self-validating, Timely.
- **AAA pattern** (Arrange–Act–Assert):
```java
@Test
void shouldReturnSum() {
    // Arrange
    Calculator calc = new Calculator();
    // Act
    int result = calc.add(2, 3);
    // Assert
    assertEquals(5, result);
}
```
- Given-When-Then is the BDD equivalent (used with naming and in Cucumber/Spock).
- One logical assertion focus per test; descriptive test names (`shouldThrowException_whenInputIsNull`).
- Tests should not depend on execution order or on each other's state.

## 4. Common Annotations (JUnit 5 / Jupiter)
| Annotation | Purpose |
|---|---|
| `@Test` | Marks a test method |
| `@BeforeEach` / `@AfterEach` | Run before/after **each** test method |
| `@BeforeAll` / `@AfterAll` | Run once before/after **all** tests in class (must be `static` unless `@TestInstance(PER_CLASS)`) |
| `@DisplayName` | Custom readable test name |
| `@Disabled` | Skip a test |
| `@Nested` | Group related tests in an inner class |
| `@ParameterizedTest` + `@ValueSource`/`@CsvSource`/`@MethodSource` | Run the same test logic with multiple inputs |
| `@RepeatedTest(n)` | Run a test n times |
| `@Tag` | Categorize tests (e.g., "slow", "integration") for selective execution |
| `@ExtendWith` | Register extensions (e.g., `MockitoExtension.class`, Spring's `SpringExtension.class`) |

## 5. Conditional Annotations
Used to enable/disable tests based on environment:
- `@EnabledOnOs(OS.LINUX)` / `@DisabledOnOs`
- `@EnabledOnJre(JRE.JAVA_17)` / `@DisabledOnJre`
- `@EnabledIfEnvironmentVariable(named="ENV", matches="ci")`
- `@EnabledIfSystemProperty`
- `@EnabledIf` / custom conditions via `ExecutionCondition` extension.

## 6. Assumptions
`Assumptions.assumeTrue(condition)` — if the assumption fails, the test is **aborted** (marked skipped, not failed). Used when a test only makes sense under certain conditions (e.g., only run on CI, only if external service is reachable).
```java
@Test
void testOnlyOnCI() {
    assumeTrue("CI".equals(System.getenv("ENV")));
    // test body runs only if assumption holds
}
```
Difference from `@Disabled`: assumptions are **dynamic/runtime**, decided per execution; `@Disabled` is static/compile-time.

## 7. Mocking – Mockito / PowerMock
- **Mockito** creates test doubles for dependencies so the unit under test is isolated.
```java
@ExtendWith(MockitoExtension.class)
class ServiceTest {
    @Mock UserRepository repo;
    @InjectMocks UserService service;

    @Test
    void shouldReturnUser() {
        when(repo.findById(1L)).thenReturn(Optional.of(new User("John")));
        User u = service.getUser(1L);
        assertEquals("John", u.getName());
    }
}
```
- `@Mock` — creates a mock. `@InjectMocks` — injects mocks into the object under test (constructor/setter/field injection).
- `verify(mock).method(args)` — asserts an interaction happened; `verify(mock, times(2))`, `never()`, `atLeastOnce()`.
- **PowerMock** — extends Mockito/EasyMock to mock **static methods, constructors, final classes, private methods** — used for legacy code that's hard to refactor. Modern Mockito (3.4+) supports static mocking natively via `Mockito.mockStatic()`, reducing the need for PowerMock.

## 8. Spying
```java
List<String> spyList = spy(new ArrayList<>());
spyList.add("one");            // real method actually executes
verify(spyList).add("one");
doReturn(100).when(spyList).size();   // override specific behavior
```
- A **spy** wraps a **real object** — calls real methods unless explicitly stubbed. Contrast with a **mock**, which has no real implementation unless stubbed.
- Use `doReturn()` instead of `when()` for spies to avoid invoking real method side effects during stubbing setup.

## 9. Stubbing
Defining canned responses for mock/spy method calls:
```java
when(repo.findById(1L)).thenReturn(Optional.of(user));
when(repo.findById(2L)).thenThrow(new EntityNotFoundException());
when(service.process(anyString())).thenAnswer(invocation -> invocation.getArgument(0) + "-processed");
```
- `thenReturn`, `thenThrow`, `thenAnswer` (dynamic/computed responses), `thenCallRealMethod()`.
- Argument matchers: `any()`, `eq()`, `anyString()` — **cannot mix raw values and matchers** in the same call.

---

# PART 3 — REST API DEVELOPMENT

## 1. Annotations (Spring MVC / Spring Web)
| Annotation | Use |
|---|---|
| `@RestController` | `@Controller` + `@ResponseBody`; returns data (JSON/XML) directly |
| `@RequestMapping` | Base mapping (path, method, headers) |
| `@GetMapping`/`@PostMapping`/`@PutMapping`/`@DeleteMapping`/`@PatchMapping` | Shortcut method-specific mappings |
| `@PathVariable` | Bind URI template variable |
| `@RequestParam` | Bind query parameter |
| `@RequestBody` | Deserialize request body into object |
| `@ResponseBody` | Serialize return value into response body |
| `@ResponseStatus` | Set HTTP status code |
| `@ExceptionHandler` / `@ControllerAdvice` | Centralized exception handling across controllers |
| `@RequestHeader`, `@CookieValue` | Bind headers/cookies |

## 2. Validations
- Bean Validation API (JSR 380) via `jakarta.validation.constraints`: `@NotNull`, `@NotBlank`, `@NotEmpty`, `@Size`, `@Min`/`@Max`, `@Email`, `@Pattern`, `@Positive`, `@Past`/`@Future`.
```java
public class UserDto {
    @NotBlank private String name;
    @Email private String email;
    @Min(18) private int age;
}

@PostMapping("/users")
public ResponseEntity<?> create(@Valid @RequestBody UserDto dto) { ... }
```
- `@Valid` triggers validation; violations throw `MethodArgumentNotValidException`, typically handled in a `@ControllerAdvice` to return a structured 400 response.
- Custom validators: implement `ConstraintValidator<Annotation, Type>`.
- Group validation (`@Validated` from Spring, with validation groups) for context-specific rules (create vs update).

## 3. Security
- **Authentication vs Authorization** — who you are vs what you can do.
- **Spring Security** basics: `SecurityFilterChain`, `UserDetailsService`, `PasswordEncoder` (BCrypt).
- **Stateless APIs**: typically **JWT** based — token issued on login, sent as `Authorization: Bearer <token>` on each request; no server-side session.
- **OAuth2 / OpenID Connect** for delegated auth (login via Google, SSO).
- **CORS** — configure allowed origins for browser-based clients.
- **CSRF** — relevant for cookie/session-based apps; usually disabled for stateless JWT APIs.
- Common practices: HTTPS everywhere, input validation (prevents injection), rate limiting, least-privilege roles (`@PreAuthorize("hasRole('ADMIN')")`).

## 4. REST Maturity Model (Richardson Maturity Model)
| Level | Description |
|---|---|
| **Level 0** | Single URI, single HTTP method (e.g., POST everything) — "Swamp of POX" |
| **Level 1** | Multiple URIs (resources), but still one HTTP method |
| **Level 2** | Proper use of HTTP verbs (GET/POST/PUT/DELETE) and status codes — where most REST APIs today sit |
| **Level 3** | HATEOAS — responses include hyperlinks to related actions/resources, enabling discoverability |

## 5. OpenAPI Standards
- **OpenAPI Specification (OAS)** — language-agnostic contract describing REST APIs (paths, schemas, params, responses, security).
- **Swagger** = tooling built around OpenAPI (Swagger UI for interactive docs, Swagger Editor).
- In Spring: `springdoc-openapi` auto-generates the spec from annotated controllers/DTOs; exposes `/v3/api-docs` and Swagger UI at `/swagger-ui.html`.
- Benefits: contract-first development, client SDK generation, living documentation, easier consumer/producer alignment in microservices.

---

# PART 4 — SPRING FRAMEWORK

## 1. Configuration (Annotation, Properties, XML)
- **XML-based** (legacy): `<beans>` in `applicationContext.xml`, `<bean id="..." class="...">`.
- **Annotation-based**: `@Component`, `@Service`, `@Repository`, `@Controller` + `@ComponentScan`.
- **Java-based (`@Configuration`)**: preferred modern approach.
```java
@Configuration
public class AppConfig {
    @Bean
    public DataSource dataSource() { return new HikariDataSource(); }
}
```
- **Properties**: `application.properties` / `application.yml`, bound via `@Value("${app.name}")` or type-safe `@ConfigurationProperties(prefix="app")`.
- Profiles (`@Profile("dev")`, `spring.profiles.active`) allow environment-specific config.

## 2. IOC / DI In-depth
- **Inversion of Control** — the framework (container), not your code, controls object creation and wiring.
- **Dependency Injection** — a form of IoC: dependencies are provided to a class rather than created by it.
- **Injection types**: Constructor injection (**recommended** — immutability, mandatory deps, easy testing), Setter injection (optional deps), Field injection (`@Autowired` on field — discouraged, hard to test/mock, hides dependencies).
```java
@Service
public class OrderService {
    private final PaymentGateway gateway;
    public OrderService(PaymentGateway gateway) { this.gateway = gateway; } // constructor injection
}
```
- **ApplicationContext** — the IoC container; manages bean lifecycle (instantiation → dependency injection → `@PostConstruct` → ready → `@PreDestroy` → destroyed).
- `BeanFactory` vs `ApplicationContext` — the latter is a superset (adds event propagation, AOP integration, internationalization, etc.); almost always use `ApplicationContext`.
- Circular dependency issues and how Spring resolves them (via early bean reference exposure — proxies) — or you refactor to break the cycle.

## 3. Bean Scopes
| Scope | Description |
|---|---|
| `singleton` (default) | One instance per Spring container |
| `prototype` | New instance every time it's requested |
| `request` | One instance per HTTP request (web-aware context) |
| `session` | One instance per HTTP session |
| `application` | One instance per `ServletContext` |
| `websocket` | One instance per WebSocket session |

Set via `@Scope("prototype")`. Gotcha: injecting a `prototype` bean into a `singleton` requires special handling (e.g., `ObjectFactory`/`Provider` or scoped proxy) since singleton is only wired once.

## 4. Annotations (Core Spring)
| Annotation | Purpose |
|---|---|
| `@Component`/`@Service`/`@Repository`/`@Controller` | Stereotype annotations for component scanning; `@Repository` also enables exception translation |
| `@Autowired` | Injects a dependency by type (falls back to name if ambiguous, or use `@Qualifier`) |
| `@Qualifier` | Disambiguate between multiple beans of the same type |
| `@Primary` | Marks a default bean when multiple candidates exist |
| `@Value` | Inject property/expression values |
| `@Bean` | Declares a bean inside a `@Configuration` class |
| `@PostConstruct`/`@PreDestroy` | Lifecycle callbacks |
| `@Lazy` | Delay bean initialization until first use |
| `@Transactional` | Declarative transaction management |
| `@ComponentScan` | Defines base packages to scan for components |

## 5. Contexts and Context Configuration
- `ApplicationContext` implementations: `AnnotationConfigApplicationContext`, `ClassPathXmlApplicationContext`, `WebApplicationContext` (web apps).
- **`@ContextConfiguration`** — used in **tests** to specify which config classes/XML files to load for building the Spring `ApplicationContext` used by that test.
```java
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = AppConfig.class)
class ServiceIntegrationTest { ... }
```
- `@SpringBootTest` — Spring Boot's higher-level annotation, auto-detects the `@SpringBootApplication` config and can start a real (or mock) web environment.
- Context caching: Spring's `TestContext` framework caches contexts across test classes with identical configuration to speed up test suites.

## 6. Important Modules

### 6.1 Spring Data JPA
- Abstraction over JPA (Hibernate) that eliminates boilerplate DAO code.
- `interface UserRepository extends JpaRepository<User, Long> { }` — gives you CRUD, paging, and sorting for free.
- **Derived query methods**: `findByEmailAndStatus(String email, Status status)` — Spring parses the method name into a query.
- `@Query` for custom JPQL/native SQL.
- `@Entity`, `@Id`, `@GeneratedValue`, `@OneToMany`/`@ManyToOne`/`@ManyToMany`, `@JoinColumn`.
- **N+1 problem** — classic pitfall with lazy-loaded associations; solved with `JOIN FETCH`, `@EntityGraph`, or DTO projections.
- Pagination: `Pageable`, `Page<T>`.

### 6.2 Spring Web MVC
- Follows the **DispatcherServlet** front-controller pattern:
  Request → `DispatcherServlet` → `HandlerMapping` (finds controller) → `Controller` → `ViewResolver`/`@ResponseBody` → Response.
- Core annotations already covered above (`@RestController`, `@RequestMapping`, etc.).
- `HandlerInterceptor`/`Filter` for cross-cutting request handling (logging, auth).
- `@ControllerAdvice` + `@ExceptionHandler` for global error handling, typically returning a consistent error response (`ResponseEntity<ErrorResponse>`).

### 6.3 Spring Test
- `spring-boot-starter-test` bundles JUnit 5, Mockito, AssertJ, Spring Test.
- `@SpringBootTest` — full context, for integration tests.
- `@WebMvcTest` — loads only the web layer (controllers, `@ControllerAdvice`), mocks service layer — fast, focused controller tests using `MockMvc`.
- `@DataJpaTest` — loads only JPA-related beans, uses an in-memory DB by default, wraps each test in a transaction that's rolled back.
- `MockMvc` example:
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean UserService service;

    @Test
    void shouldReturn200() throws Exception {
        when(service.getUser(1L)).thenReturn(new User("John"));
        mockMvc.perform(get("/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("John"));
    }
}
```
- `@MockBean` — replaces a bean in the Spring context with a Mockito mock (different from plain `@Mock`, which needs `MockitoExtension` and no Spring context).

---

## Quick Interview-Day Tips
1. Be ready to **explain trade-offs**, not just definitions (e.g., "why constructor injection over field injection").
2. Have a **live-coding-ready** example for: Stream pipeline, custom exception, Mockito test, a REST controller with validation.
3. Know **HashMap internals** and **JVM memory model** cold — these come up in almost every Java interview.
4. For Spring, be ready to explain the **request lifecycle end-to-end** (DispatcherServlet → Controller → Service → Repository → DB).
5. Practice explaining concepts out loud in 30–60 seconds — interviewers value clarity over exhaustive detail.

Good luck with your EPAM interview today!
