# T17 — Seed Engineering Principles Topics

## Goal
Create content JSON files for the 5 Engineering Principles topics in `src/content/topics/`.

Topics already covered: `oop.json` (exists).
Topics to create: SOLID, Clean Code, Design Patterns, Refactoring, Testing.

---

## Topics to create

### Topic 1: `solid.json`
- id: `solid`
- title: `SOLID Principles`
- group: `Engineering Principles`
- estimatedMinutes: 60

**Subtopic: `srp-ocp-lsp`** — "SRP, OCP, LSP"
1. `Single Responsibility Principle` (Beginner) — one reason to change, fat class smell, extracting EmailSender from UserService, cohesion vs coupling
2. `Open/Closed Principle` (Mid) — open for extension, closed for modification, Strategy pattern as canonical OCP example, avoiding giant if/switch on type
3. `Liskov Substitution Principle` (Mid) — subtype must honour supertype contract, classic Rectangle/Square violation, covariant return types are fine, contravariant parameter types

**Subtopic: `isp-dip`** — "ISP & DIP"
1. `Interface Segregation Principle` (Mid) — fat interface smell, role interfaces, `Readable` vs `Writeable` vs `ReadWriteable`, Java default methods as escape hatch
2. `Dependency Inversion Principle` (Mid) — depend on abstractions not concretions, constructor injection example, how DI frameworks (Spring) implement this
3. `SOLID together — a worked example` (Senior) — refactor a god-class OrderProcessor step by step applying all 5 principles, show before/after

---

### Topic 2: `clean-code.json`
- id: `clean-code`
- title: `Clean Code`
- group: `Engineering Principles`
- estimatedMinutes: 45

**Subtopic: `naming-functions`** — "Naming & Functions"
1. `Meaningful names` (Beginner) — intention-revealing names, avoid abbreviations, noun for classes/variables, verb for methods, don't encode types in names (Hungarian notation)
2. `Function design` (Beginner) — do one thing, ideal length (fits on screen), extract-till-you-drop, function arguments (0 ideal, 3 max), avoid flag parameters
3. `Comments — when and when not` (Mid) — good comment: non-obvious WHY, workaround for known bug; bad comment: restates code, commented-out code, misleading; javadoc for public APIs

**Subtopic: `formatting-errors`** — "Formatting & Error Handling"
1. `Code formatting rules` (Beginner) — newspaper metaphor (high-level → detail), vertical distance (related code close), team style guide > personal preference, checkstyle/spotless automation
2. `Error handling` (Mid) — exceptions vs return codes, checked vs unchecked in Java, don't swallow exceptions, wrap third-party exceptions, fail fast

---

### Topic 3: `design-patterns.json`
- id: `design-patterns`
- title: `Design Patterns`
- group: `Engineering Principles`
- estimatedMinutes: 90

**Subtopic: `creational`** — "Creational Patterns"
1. `Singleton` (Beginner) — double-checked locking, enum singleton (best), when NOT to use (global state, testability), vs Spring @Bean singleton scope
2. `Builder` (Mid) — telescoping constructor problem, fluent builder, inner static Builder class, Lombok @Builder, immutable objects
3. `Factory Method & Abstract Factory` (Mid) — virtual constructor, Factory Method vs static factory method, Abstract Factory for families of objects

**Subtopic: `structural-behavioral`** — "Structural & Behavioral Patterns"
1. `Strategy` (Beginner) — encapsulate algorithm family, replace conditionals, Java: pass lambda as strategy, Comparator is a strategy
2. `Observer` (Mid) — event/listener pattern, Java EventListener, decoupling producer from consumer, risk of memory leaks with strong listener references
3. `Decorator` (Mid) — wrap to add behaviour without subclassing, Java I/O streams as canonical example (BufferedInputStream wraps FileInputStream), vs inheritance

---

### Topic 4: `refactoring.json`
- id: `refactoring`
- title: `Refactoring Techniques`
- group: `Engineering Principles`
- estimatedMinutes: 60

**Subtopic: `code-smells`** — "Code Smells"
1. `Long Method & Large Class` (Beginner) — extract method, extract class, rule of 3 for duplication, naming extracted pieces properly
2. `Feature Envy & Data Clumps` (Mid) — method more interested in another class's data, move method, data clump → introduce parameter object
3. `Primitive Obsession & Shotgun Surgery` (Mid) — replace with value object, Money/Email/PhoneNumber types, shotgun surgery: one change requires many small edits

**Subtopic: `refactoring-patterns`** — "Fowler Refactoring Catalog"
1. `Extract Method & Inline Method` (Beginner) — when to extract (comment describes it, used in 2+ places, too long), when to inline (indirection not earning its keep)
2. `Replace Conditional with Polymorphism` (Mid) — type-code smell, replace switch/if-type with subclasses or Strategy, enables OCP
3. `Introduce Parameter Object & Preserve Whole Object` (Mid) — group related parameters, pass object not fields, trade-off (coupling to caller's type)

---

### Topic 5: `testing.json`
- id: `testing`
- title: `Testing`
- group: `Engineering Principles`
- estimatedMinutes: 75

**Subtopic: `unit-testing`** — "Unit Testing with JUnit 5"
1. `JUnit 5 basics` (Beginner) — @Test, @BeforeEach/@AfterEach, @BeforeAll/@AfterAll, Assertions.assertEquals/assertThrows/assertAll, @DisplayName
2. `Mockito fundamentals` (Mid) — @Mock/@InjectMocks/@ExtendWith(MockitoExtension.class), when/thenReturn, verify, ArgumentCaptor, spy vs mock
3. `Test design — F.I.R.S.T.` (Mid) — Fast, Independent, Repeatable, Self-validating, Timely; arrange-act-assert pattern; one logical assertion per test

**Subtopic: `tdd-integration`** — "TDD & Integration Testing"
1. `TDD red-green-refactor` (Mid) — write failing test first, minimal code to pass, refactor under green, triangle of tests (unit/integration/e2e), triangulation technique
2. `Integration testing with @SpringBootTest` (Senior) — @SpringBootTest vs @WebMvcTest vs @DataJpaTest, TestContainers for real DB, @MockBean to stub collaborators, test slices for speed

## Output format
Same JSON schema as T16. Card ids: `{topicId}-{subtopicId}-{slug}`.

## Test
`npm run build` must pass without TypeScript errors.

## Commit
`T17: seed Engineering Principles topics (SOLID, Clean Code, Patterns, Refactoring, Testing)`
