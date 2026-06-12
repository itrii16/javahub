# T28 — F5: System Design Section (6 Classic Designs)

## Goal
Build the system design section of the Interview Prep Track: 6 fully worked designs
with requirements, component breakdown, and interactive SVG diagrams (React SVG components).

---

## Route
`/interview-prep/system-design/:designId` → `SystemDesignPage`
`/interview-prep/system-design` → `SystemDesignListPage` (index of 6 designs)

---

## Types — add to `src/types/content.ts`

```ts
export interface SvgComponent {
  id: string;
  label: string;
  x: number; y: number;   // SVG position
  width: number; height: number;
  shape: 'rect' | 'cylinder' | 'diamond' | 'circle';
  javaNote: string;       // shown in expandable panel when component is clicked
}

export interface SvgConnection {
  from: string; to: string;   // component ids
  label?: string;
}

export interface SystemDesign {
  id: string;
  title: string;
  description: string;
  requirements: string[];          // functional requirements bullets
  nonFunctionalReqs: string[];
  components: SvgComponent[];
  connections: SvgConnection[];
  componentBreakdown: {
    componentId: string;
    heading: string;
    detail: string;               // markdown
    javaImpl?: string;            // Java code example
  }[];
}
```

---

## Content — `src/content/systemdesign/`

Create one JSON file per design. Minimum content required:

### `url-shortener.json`
Components: Client, API Gateway, Shortener Service, ID Generator (Snowflake), Cache (Redis), DB (Postgres), Analytics Queue.
Key notes: base62 encoding, 301 vs 302, read-heavy (cache hit ratio), write path.

### `rate-limiter.json`
Components: Client, API Gateway, Rate Limiter Middleware, Redis (token bucket state), Response Handler.
Key notes: token bucket algorithm, Redis INCR + EXPIRE atomicity, distributed rate limiting with Lua script.

### `notification-system.json`
Components: API, Notification Service, Priority Queue (Kafka), Push Worker (APNs/FCM), Email Worker (SES), SMS Worker (Twilio), User Preferences DB.
Key notes: fan-out on write, at-least-once + idempotency key, priority queues for critical alerts.

### `chat-application.json`
Components: Client, WebSocket Server, Message Service, Message DB (Cassandra), Presence Service, Pub/Sub (Redis), Media Storage (S3).
Key notes: WebSocket vs SSE vs long-polling, message ordering, read receipts.

### `ecommerce-inventory.json`
Components: API Gateway, Inventory Service, DB (Postgres), Redis Cache, Order Service, Event Bus (Kafka), Warehouse Worker.
Key notes: optimistic locking for stock reservation, eventual consistency for warehouse sync, overselling prevention.

### `cache-service.json`
Components: Client, Cache Service, Eviction Manager, Backing Store (DB), Replication Node.
Key notes: LRU implementation, consistent hashing for distributed cache, cache-aside vs write-through, thundering herd.

---

## Components

### `src/components/systemdesign/DesignDiagram.tsx`

Interactive SVG React component:
- Renders `SvgComponent[]` as SVG shapes (rect/cylinder/diamond/circle) with labels
- Renders `SvgConnection[]` as SVG lines with optional labels
- **Click on any component**: highlights it (indigo border), opens a side panel with `javaNote`
- Side panel slides in from right, shows heading + Java code snippet (Prism.js highlighted)
- Responsive: SVG uses `viewBox`, wrapped in `<div style="overflow-x: auto">`

Shape rendering:
- `rect` → `<rect>`
- `cylinder` → two ellipses + rectangle (DB icon)
- `diamond` → `<polygon>` (decision/cache)
- `circle` → `<circle>`

### `src/pages/SystemDesignPage.tsx`
- Requirements section (functional + non-functional bullet lists)
- `<DesignDiagram />` (full width)
- Component breakdown accordion: each component expandable, shows detail + Java impl code

### `src/pages/SystemDesignListPage.tsx`
- Grid of 6 design cards with title, description, and "View Design →" link
- Linked from `/interview-prep` page and sidebar

---

## Sidebar update
Add "System Design" link under the Interview Prep section.

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T28: F5 system design section — 6 designs, interactive SVG diagram component`
