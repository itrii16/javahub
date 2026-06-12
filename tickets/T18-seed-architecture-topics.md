# T18 — Seed Architecture & Design Topics

## Goal
Create content JSON files for the 6 Architecture & Design topics in `src/content/topics/`.

---

## Topics to create

### Topic 1: `api-design.json`
- id: `api-design`
- title: `API Design`
- group: `Architecture & Design`
- estimatedMinutes: 60

**Subtopic: `rest-fundamentals`** — "REST Fundamentals"
1. `REST constraints & resource design` (Beginner) — stateless, uniform interface, resource naming (nouns not verbs), HTTP methods semantics (GET/POST/PUT/PATCH/DELETE), 2xx/4xx/5xx status codes
2. `Idempotency & safety` (Mid) — safe methods (no side effects), idempotent methods, why POST is neither, PUT vs PATCH, implementing idempotency keys for payment APIs
3. `API versioning strategies` (Mid) — URI versioning (/v1/), header versioning (Accept: application/vnd.api+json;version=2), query param; tradeoffs; semantic versioning for libraries

**Subtopic: `beyond-rest`** — "Beyond REST"
1. `gRPC basics` (Mid) — Protocol Buffers, service definition (.proto), generated stubs, streaming (unary/server/client/bidirectional), when to prefer over REST
2. `GraphQL trade-offs` (Mid) — single endpoint, client-driven queries, N+1 problem with DataLoader, schema-first design, when NOT to use (simple CRUD, caching needs)

---

### Topic 2: `architecture-patterns.json`
- id: `architecture-patterns`
- title: `Architecture Patterns`
- group: `Architecture & Design`
- estimatedMinutes: 75

**Subtopic: `layered-hex`** — "Layered & Hexagonal"
1. `Layered (N-tier) architecture` (Beginner) — presentation/service/repository layers, strict layering, why dependencies go downward only, anemic domain model smell
2. `Hexagonal (Ports & Adapters)` (Mid) — application core with no framework dependencies, ports as interfaces, adapters as implementations, testability benefit: swap DB adapter in tests
3. `Package by feature vs layer` (Mid) — feature packages (com.app.order.*) vs layer packages (com.app.service.*), cohesion argument, refactoring toward feature packaging

**Subtopic: `distributed`** — "Microservices & Event-Driven"
1. `Microservices decomposition` (Mid) — bounded context (DDD), single responsibility for services, data ownership per service, distributed monolith anti-pattern
2. `Event-driven architecture` (Senior) — choreography vs orchestration, domain events, eventual consistency, outbox pattern for reliable event publishing
3. `CQRS overview` (Senior) — separate read/write models, query model can be denormalized, eventual consistency between models, when it adds more complexity than value

---

### Topic 3: `database-fundamentals.json`
- id: `database-fundamentals`
- title: `Database Fundamentals`
- group: `Architecture & Design`
- estimatedMinutes: 60

**Subtopic: `acid-indexing`** — "ACID & Indexing"
1. `ACID properties` (Beginner) — Atomicity, Consistency, Isolation, Durability; what each guarantees; isolation levels (READ UNCOMMITTED → SERIALIZABLE) and their anomalies (dirty read, non-repeatable read, phantom read)
2. `Indexing strategies` (Mid) — B-tree index internals, composite index column order, covering index, when indexes hurt (write-heavy tables, low cardinality), EXPLAIN/EXPLAIN ANALYZE
3. `N+1 query problem` (Mid) — lazy loading in Hibernate causing N+1, detecting with Hibernate Statistics or p6spy, fixing with JOIN FETCH or @EntityGraph, batch fetching

**Subtopic: `hibernate-pitfalls`** — "Hibernate Pitfalls"
1. `Session & transaction scope` (Mid) — open-session-in-view anti-pattern, LazyInitializationException cause and fixes, proper transaction boundaries in service layer
2. `Optimistic vs pessimistic locking` (Senior) — @Version for optimistic locking, StaleObjectStateException handling, pessimistic with LockModeType.PESSIMISTIC_WRITE, when to choose each

---

### Topic 4: `distributed-systems.json`
- id: `distributed-systems`
- title: `Distributed Systems`
- group: `Architecture & Design`
- estimatedMinutes: 75

**Subtopic: `cap-consistency`** — "CAP & Consistency"
1. `CAP theorem` (Mid) — Consistency, Availability, Partition tolerance — pick 2, CP vs AP systems, examples (ZooKeeper=CP, Cassandra=AP), nuance: network partitions are unavoidable
2. `Eventual consistency` (Mid) — BASE (Basically Available, Soft state, Eventually consistent), read-your-writes, monotonic read, causal consistency, conflict resolution strategies (last-write-wins, CRDTs)
3. `Distributed transactions` (Senior) — 2-phase commit and its blocking problem, Saga pattern (choreography vs orchestration), compensating transactions

**Subtopic: `resilience`** — "Resilience Patterns"
1. `Circuit Breaker` (Mid) — closed/open/half-open states, Resilience4j implementation, fallback methods, why it prevents cascade failures
2. `Bulkhead & Rate Limiting` (Senior) — thread pool isolation (Bulkhead), token bucket algorithm for rate limiting, Resilience4j RateLimiter, Redis-based distributed rate limiter

---

### Topic 5: `security-basics.json`
- id: `security-basics`
- title: `Security Basics`
- group: `Architecture & Design`
- estimatedMinutes: 60

**Subtopic: `owasp-auth`** — "OWASP & Authentication"
1. `OWASP Top 10 for Java devs` (Mid) — Injection (SQL/LDAP/OS), Broken Auth, XSS, Insecure Deserialization, Security Misconfiguration; concrete Java examples for each
2. `SQL injection prevention` (Beginner) — prepared statements (why they prevent injection), named parameters in JPA, never concatenate user input into SQL, ORMs are not automatically safe
3. `JWT & OAuth2 basics` (Mid) — JWT structure (header.payload.signature), stateless validation, expiry and refresh tokens, OAuth2 Authorization Code flow, when to use JWTs vs opaque tokens

**Subtopic: `input-secrets`** — "Input Validation & Secrets"
1. `Input validation & output encoding` (Mid) — server-side validation required (client can be bypassed), Bean Validation (@NotNull/@Size/@Pattern), HTML-encode output to prevent XSS, Content-Security-Policy header
2. `Secrets management` (Mid) — never hardcode secrets, environment variables, Vault/AWS Secrets Manager, Spring Cloud Config, secret rotation strategy, audit logging of secret access

---

### Topic 6: `logging-observability.json`
- id: `logging-observability`
- title: `Logging & Observability`
- group: `Architecture & Design`
- estimatedMinutes: 45

**Subtopic: `structured-logging`** — "Structured Logging"
1. `SLF4J & Logback setup` (Beginner) — SLF4J as facade, Logback as implementation, log levels (TRACE/DEBUG/INFO/WARN/ERROR), parameterised logging to avoid string concat, MDC for request context
2. `Structured JSON logging` (Mid) — logstash-logback-encoder, JSON fields (timestamp, level, message, traceId), why structured > plain text for log aggregation (ELK, Splunk), log sampling at high throughput
3. `Correlation IDs` (Mid) — generating UUID per request, propagating via MDC, passing in HTTP headers (X-Correlation-ID), logging in async code (MDC copy to child threads)

**Subtopic: `tracing-metrics`** — "Tracing & Metrics"
1. `Distributed tracing` (Mid) — trace/span/parent-span concepts, OpenTelemetry Java agent, Micrometer Tracing, Zipkin/Jaeger backend, automatically propagated via Spring Cloud Sleuth
2. `Metrics with Micrometer` (Mid) — Counter, Gauge, Timer, DistributionSummary; Micrometer → Prometheus → Grafana pipeline; tagging for multi-dimensional metrics; alerting on SLOs

## Output format
Same JSON schema as T16. Card ids: `{topicId}-{subtopicId}-{slug}`.

## Test
`npm run build` must pass without TypeScript errors.

## Commit
`T18: seed Architecture & Design topics (API, Patterns, DB, Distributed, Security, Logging)`
