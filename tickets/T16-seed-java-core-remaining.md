# T16 — Seed Remaining Java Core Topics

## Goal
Create content JSON files for the 5 remaining Java Core topics that are missing from `src/content/topics/`.

## Topics to create

Each file goes in `src/content/topics/` and must follow the exact schema used in `java-core.json` and `data-structures.json`.

### Topic 1: `collections.json`
- id: `collections`
- title: `Collections Deep Dive`
- group: `Java Core`
- estimatedMinutes: 60

Subtopics + cards (2 subtopics, 3 cards each):

**Subtopic: `list-set`** — "List & Set Implementations"
1. `ArrayList vs LinkedList` (Beginner) — internal array vs doubly-linked, O(1) random access vs O(n), when to prefer which, amortized resize cost
2. `HashSet / LinkedHashSet / TreeSet` (Mid) — hash-based O(1) vs insertion-ordered vs sorted, equals/hashCode contract requirement, TreeSet using Comparable/Comparator
3. `CopyOnWriteArrayList` (Senior) — thread-safe via structural copy, read-heavy optimisation, iteration never throws ConcurrentModificationException, write cost

**Subtopic: `map-internals`** — "Map Internals & Concurrent Maps"
1. `HashMap internals` (Mid) — hash function, bucket array, linked list→tree at threshold 8, load factor 0.75, resize doubling, equals/hashCode contract
2. `LinkedHashMap & TreeMap` (Mid) — insertion/access order in LinkedHashMap, Red-Black tree in TreeMap, NavigableMap operations (floorKey, ceilingKey)
3. `ConcurrentHashMap` (Senior) — segment locking pre-Java 8, CAS + synchronized bucket head in Java 8+, compute/merge atomics, why putIfAbsent is preferred over get+put

---

### Topic 2: `concurrency.json`
- id: `concurrency`
- title: `Concurrency & Multithreading`
- group: `Java Core`
- estimatedMinutes: 90

**Subtopic: `threads-locks`** — "Threads & Locks"
1. `Thread lifecycle & creation` (Beginner) — NEW/RUNNABLE/BLOCKED/WAITING/TIMED_WAITING/TERMINATED, Thread vs Runnable vs Callable, thread pools via ExecutorService
2. `synchronized & ReentrantLock` (Mid) — intrinsic lock, monitor enter/exit, ReentrantLock tryLock/lockInterruptibly, fairness param, always unlock in finally
3. `volatile & happens-before` (Senior) — visibility guarantee without atomicity, Java memory model happens-before rules, double-checked locking pattern (broken without volatile)

**Subtopic: `async-modern`** — "CompletableFuture & Virtual Threads"
1. `CompletableFuture basics` (Mid) — supplyAsync, thenApply, thenCompose, exceptionally, allOf/anyOf, default ForkJoinPool
2. `CompletableFuture composition` (Senior) — thenCompose vs thenApply (flatMap analogy), handle vs exceptionally, custom executor, chaining async DB + HTTP calls
3. `Virtual Threads (Java 21)` (Senior) — Project Loom motivation, Thread.ofVirtual(), carrier threads, pinning pitfalls, when NOT to use (CPU-bound tasks)

---

### Topic 3: `jvm-internals.json`
- id: `jvm-internals`
- title: `JVM Internals`
- group: `Java Core`
- estimatedMinutes: 75

**Subtopic: `memory-gc`** — "Memory Model & Garbage Collection"
1. `JVM memory areas` (Beginner) — heap (young/old gen), stack (per thread), metaspace, code cache, native memory; common OutOfMemoryError types
2. `GC algorithms overview` (Mid) — Serial, Parallel, G1 (region-based, pause targets), ZGC/Shenandoah (concurrent, low-latency); when to choose each
3. `GC tuning basics` (Senior) — -Xms/-Xmx, -XX:+UseG1GC, GC log flags, understanding GC pause logs, avoiding premature promotion

**Subtopic: `classloading-jit`** — "Class Loading & JIT"
1. `ClassLoader hierarchy` (Mid) — Bootstrap → Extension → Application → custom, parent-delegation model, Class.forName vs classLoader.loadClass
2. `JIT compilation` (Mid) — interpreter → C1 (client) → C2 (server), tiered compilation, OSR, inlining, devirtualisation; why warm-up time matters
3. `JVM flags for diagnostics` (Senior) — -verbose:gc, -XX:+PrintCompilation, -XX:+UnlockDiagnosticVMOptions, jstack/jmap/jcmd usage in production

---

### Topic 4: `generics.json`
- id: `generics`
- title: `Generics & Type System`
- group: `Java Core`
- estimatedMinutes: 45

**Subtopic: `bounds-wildcards`** — "Bounds & Wildcards"
1. `Generic class & method basics` (Beginner) — `<T>` syntax, type parameter naming conventions, raw types vs parameterized, why raw types defeat the point
2. `Bounded wildcards (PECS)` (Mid) — `? extends T` (producer, upper bound), `? super T` (consumer, lower bound), the PECS mnemonic with List.copy example
3. `Type erasure` (Senior) — compiler removes generic info at bytecode level, bridge methods, why `instanceof List<String>` won't compile, heap pollution and @SafeVarargs

**Subtopic: `advanced-generics`** — "Advanced Generics"
1. `Multiple bounds & intersection types` (Mid) — `<T extends Comparable<T> & Serializable>`, use in utility methods, why order matters (class before interfaces)
2. `Generic methods on non-generic classes` (Mid) — static utility method pattern (like Collections.sort), type inference, explicit type witness syntax
3. `Recursive generics (F-bounded)` (Senior) — `<T extends Comparable<T>>` pattern, builder pattern using F-bounded type, Java Enum's `Enum<E extends Enum<E>>` explained

---

### Topic 5: `javadoc.json`
- id: `javadoc`
- title: `Javadoc & Code Documentation`
- group: `Java Core`
- estimatedMinutes: 30

**Subtopic: `writing-javadoc`** — "Writing Effective Javadoc"
1. `Javadoc anatomy` (Beginner) — `/** */` syntax, @param, @return, @throws, @since, @deprecated; class vs method vs field javadoc; first sentence as summary
2. `Javadoc best practices` (Mid) — document the contract not the implementation, when NOT to write javadoc (private methods, obvious getters), @code vs @link vs @literal, package-info.java
3. `Generating & publishing` (Beginner) — `javadoc` CLI flags, Maven javadoc plugin, Javadoc HTML output structure, linking to JDK docs with -link

**Subtopic: `api-contracts`** — "Documenting API Contracts"
1. `Preconditions, postconditions, invariants` (Mid) — @throws for precondition violations, documenting null-safety (@Nullable/@NonNull), thread-safety contract in class javadoc
2. `Deprecation workflow` (Mid) — @Deprecated annotation + @deprecated tag, @since and replacement guidance, forRemoval=true (Java 9+), why both annotation and tag are needed

## Output format
Each file must be valid JSON matching this structure:
```json
{
  "id": "...",
  "title": "...",
  "group": "...",
  "estimatedMinutes": 0,
  "subtopics": [
    {
      "id": "...",
      "title": "...",
      "cards": [
        {
          "id": "...",
          "topicId": "...",
          "subtopicId": "...",
          "title": "...",
          "difficulty": "Beginner|Mid|Senior",
          "explanation": "...",
          "codeExample": "...",
          "whyItMatters": "...",
          "gotcha": "..."
        }
      ]
    }
  ]
}
```

Card ids must be globally unique and follow the pattern: `{topicId}-{subtopicId}-{slug}` (e.g. `collections-map-internals-hashmap`).

## Test
No new test file needed. Run `npm run build` in `javahub/` — it must compile without TypeScript errors.

## Commit
`T16: seed remaining Java Core topics (Collections, Concurrency, JVM, Generics, Javadoc)`
