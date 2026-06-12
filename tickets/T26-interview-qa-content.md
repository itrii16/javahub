# T26 — F5: Interview Q&A Content (Data Model + Seed)

## Goal
Define the interview Q&A data model and seed 5–10 questions per topic for the Interview Prep
Track. This is the content foundation that T27 (UI) will render.

---

## Types — add to `src/types/content.ts`

```ts
export interface InterviewAnswer {
  summary: string;       // 1–2 sentence answer (shown by default, collapsed)
  full: string;          // full model answer in markdown (expandable)
}

export interface TrickyFollowUp {
  question: string;
  answer: string;
}

export interface InterviewQuestion {
  id: string;            // e.g. 'iq-java-core-001'
  topicId: string;
  subtopicId?: string;
  question: string;
  tags: string[];        // e.g. ['streams', 'lambdas']
  difficulty: 'Beginner' | 'Mid' | 'Senior';
  answer: InterviewAnswer;
  trickyFollowUp?: TrickyFollowUp;
}
```

---

## Content files — `src/content/interview/`

Create one JSON file per topic group. Each file is an array of `InterviewQuestion`.

### `java-core-qa.json` — 8 questions minimum
Sample questions to include (write full answers yourself):
- "What is the difference between `==` and `.equals()` in Java?"
- "Explain the difference between `Comparable` and `Comparator`."
- "What happens when you modify a list while iterating over it with a for-each loop?"
- "How does `HashMap` handle hash collisions in Java 8+?"
- "What is the difference between `Optional.of()` and `Optional.ofNullable()`?"
- "Explain method references — what are the four types?"
- "What is the difference between `parallelStream()` and `stream()`? When is parallel actually faster?"
- "What is effectively final, and why does it matter for lambdas?"

### `engineering-principles-qa.json` — 8 questions minimum
Sample:
- "Explain the Single Responsibility Principle with a real-world Java example."
- "What is the difference between composition and inheritance? When should you prefer composition?"
- "What makes a unit test a good unit test? (F.I.R.S.T. criteria)"
- "Explain the Open/Closed Principle. How do lambdas / Strategy pattern help enforce it?"
- "What is the difference between a mock and a stub in testing?"
- "Describe code smells you have fixed in the past. What was the refactoring?"
- "What does the Liskov Substitution Principle say, and what is the classic Rectangle/Square violation?"
- "When would you use the Builder pattern instead of a constructor?"

### `architecture-qa.json` — 8 questions minimum
Sample:
- "What is the difference between REST and gRPC? When would you choose gRPC?"
- "Explain the CAP theorem. Give an example of a CP system and an AP system."
- "What is the N+1 query problem and how do you fix it in Hibernate?"
- "What is the Circuit Breaker pattern and what problem does it solve?"
- "Explain ACID properties. What isolation level do most production databases default to, and why?"
- "What is hexagonal architecture? How does it improve testability?"
- "What is eventual consistency? Give a practical example."
- "How does JWT authentication work? What are the security risks?"

### `interview-ds-qa.json` — 8 questions minimum
Sample:
- "What is the time complexity of HashMap.get() in the average vs worst case? What causes the worst case?"
- "When would you use a LinkedList over an ArrayList?"
- "Explain how a PriorityQueue works internally. What is the time complexity of add() and poll()?"
- "What is the difference between BFS and DFS? When would you use each?"
- "Explain binary search. What is the standard off-by-one mistake in the implementation?"
- "What is dynamic programming? Explain with the Fibonacci example — top-down and bottom-up."
- "What is the time and space complexity of merge sort?"
- "How would you detect a cycle in a linked list?"

---

## Index file — `src/content/interview/index.ts`
```ts
import javaCoreQA from './java-core-qa.json';
import engineeringQA from './engineering-principles-qa.json';
import architectureQA from './architecture-qa.json';
import interviewDsQA from './interview-ds-qa.json';

export const allInterviewQuestions: InterviewQuestion[] = [
  ...javaCoreQA,
  ...engineeringQA,
  ...architectureQA,
  ...interviewDsQA,
];

export { javaCoreQA, engineeringQA, architectureQA, interviewDsQA };
```

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T26: F5 interview Q&A content — types, 32+ questions across 4 topic groups`
