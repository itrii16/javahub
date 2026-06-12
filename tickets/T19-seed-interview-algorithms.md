# T19 — Seed Interview & Algorithm Topics

## Goal
Create content JSON files for the 2 remaining Interview & System Design topics in `src/content/topics/`.

Topic already covered: `data-structures.json` (exists).
Topics to create: Algorithms in Java, System Design Interview Patterns.

---

## Topics to create

### Topic 1: `algorithms.json`
- id: `algorithms`
- title: `Algorithms in Java`
- group: `Interview & System Design`
- estimatedMinutes: 90

**Subtopic: `complexity-recursion`** — "Complexity & Recursion"
1. `Big-O analysis` (Beginner) — O(1)/O(log n)/O(n)/O(n log n)/O(n²)/O(2ⁿ), drop constants and non-dominant terms, space complexity, amortized analysis (ArrayList.add), common pitfalls (nested loop ≠ always O(n²))
2. `Recursion & the call stack` (Mid) — base case, recursive case, stack frame cost, tail recursion (Java doesn't optimise it), convert to iterative with explicit stack when depth is large
3. `Memoization & tabulation` (Mid) — top-down with HashMap cache, bottom-up table, classic: Fibonacci and coin change in Java, recognising DP subproblems (overlapping + optimal substructure)

**Subtopic: `sorting-searching`** — "Sorting & Searching"
1. `Java sorting internals` (Beginner) — Arrays.sort uses dual-pivot quicksort for primitives, TimSort for objects, Collections.sort stability guarantee, custom Comparator/Comparable, Comparator.comparing chaining
2. `Binary search variants` (Mid) — `Arrays.binarySearch`, manual implementation (off-by-one in hi=mid vs hi=mid-1), find first/last occurrence variant, search in rotated array
3. `Graph algorithms` (Senior) — BFS (shortest path, level-order), DFS (cycle detection, topological sort), Dijkstra's with PriorityQueue, adjacency list in Java (Map<Integer, List<int[]>>)

**Subtopic: `patterns`** — "Common Interview Patterns"
1. `Sliding window & two pointers` (Mid) — fixed window (max sum subarray), variable window (longest substring without repeats), fast/slow pointer (linked list cycle), in-place array operations
2. `Dynamic programming classics` (Senior) — 0/1 knapsack, longest common subsequence, edit distance — Java solution for each with time/space complexity analysis
3. `Backtracking template` (Senior) — choose/explore/unchoose skeleton, N-Queens and permutations in Java, pruning strategies, time complexity of backtracking solutions

---

### Topic 2: `system-design.json`
- id: `system-design`
- title: `System Design Interview Patterns`
- group: `Interview & System Design`
- estimatedMinutes: 90

**Subtopic: `fundamentals`** — "System Design Fundamentals"
1. `Scaling strategies` (Mid) — vertical vs horizontal scaling, stateless services, sticky sessions problem, read replicas, database sharding (hash vs range), consistent hashing
2. `Caching strategies` (Mid) — cache-aside (lazy loading), write-through, write-behind, cache invalidation strategies, TTL, LRU eviction, Redis vs Memcached, what NOT to cache
3. `Message queues & async processing` (Mid) — synchronous vs async, Kafka (log, partitions, consumer groups), RabbitMQ (AMQP, routing), choosing between them, at-least-once vs exactly-once delivery

**Subtopic: `classic-designs`** — "Classic System Design Problems"
1. `URL Shortener` (Mid) — requirements (read-heavy, 100M URLs), base62 encoding, hash collision handling, redirect (301 vs 302), DB schema, read path with cache (Redis), write path, analytics considerations
2. `Rate Limiter` (Senior) — token bucket vs leaky bucket vs fixed window vs sliding window log algorithms, Redis + Lua script for atomic decrement, distributed rate limiting, returning 429 with Retry-After header
3. `Notification System` (Senior) — fan-out on write vs read, push (APNs/FCM) vs pull, email via SES, notification preferences, at-least-once + idempotency key to avoid duplicate sends, priority queues for critical alerts

**Note on system design diagrams**: The spec calls for interactive SVG React components (F5). That belongs to a later phase. These cards describe the designs in text + code only. The SVG diagrams are tracked separately.

## Output format
Same JSON schema as T16. Card ids: `{topicId}-{subtopicId}-{slug}`.

The `algorithms.json` complexity table cards should use a `complexityTable` optional field (array of `{operation, best, average, worst}`) where applicable — but only if the existing `Card` TypeScript type supports it. If it doesn't, add the complexity info inline in the `explanation` field as a formatted text table, and open a note in `DECISIONS.md`.

## Test
`npm run build` must pass without TypeScript errors.

## Commit
`T19: seed Interview topics (Algorithms in Java, System Design patterns)`
