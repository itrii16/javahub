# T20 — F0: Assessment Question Bank (Data Model + Seed Questions)

## Goal
Define the TypeScript types for quiz questions and seed a question bank of 30+ questions
(covering all 21 topics) used by the F0 adaptive assessment quiz.

---

## Types to add — `src/types/assessment.ts`

```ts
export type QuestionFormat = 'multiple-choice' | 'true-false' | 'code-reading';

export interface QuizOption {
  id: string;           // 'a' | 'b' | 'c' | 'd'
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;                  // e.g. 'q-java-core-streams-001'
  topicId: string;             // matches Topic.id
  subtopicId: string;
  format: QuestionFormat;
  difficulty: 'Beginner' | 'Mid' | 'Senior';
  question: string;            // the question text (may include code snippet)
  options: QuizOption[];       // 2 options for true-false, 4 for the rest
  explanation: string;         // shown after answering (correct or not)
  followUpQuestionId?: string; // adaptive drilling: asked if this one is wrong
}

export interface AssessmentSession {
  id: string;
  startedAt: string;           // ISO date
  completedAt?: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
    correct: boolean;
    timeSpentMs?: number;
  }[];
  topicScores: Record<string, number>; // topicId → 0–100
}
```

Also extend `src/types/content.ts` to export a `TopicGroup` type:
```ts
export type TopicGroup =
  | 'Java Core'
  | 'Engineering Principles'
  | 'Architecture & Design'
  | 'Interview & System Design';
```

---

## Content to create — `src/content/assessment/questions.json`

Seed **at least 30 questions** — roughly 1–2 per topic across the 21 topics.
At least 3 questions must have a `followUpQuestionId` set (to enable adaptive drilling).

**Format rules**:
- `multiple-choice`: exactly 4 options, exactly 1 correct
- `true-false`: exactly 2 options ('True' / 'False'), exactly 1 correct
- `code-reading`: a short Java snippet in the `question` field (use ``` fenced block), 4 options

**Sample questions to include (use these exactly — fill rest yourself)**:

```json
{
  "id": "q-java-core-lambda-001",
  "topicId": "java-core",
  "subtopicId": "lambdas",
  "format": "multiple-choice",
  "difficulty": "Beginner",
  "question": "Which of the following is a valid functional interface?",
  "options": [
    { "id": "a", "text": "Runnable", "isCorrect": true },
    { "id": "b", "text": "Cloneable", "isCorrect": false },
    { "id": "c", "text": "Serializable", "isCorrect": false },
    { "id": "d", "text": "Comparable", "isCorrect": false }
  ],
  "explanation": "Runnable has exactly one abstract method (run()), making it a functional interface. Cloneable and Serializable are marker interfaces with no methods. Comparable has compareTo() but is not annotated @FunctionalInterface.",
  "followUpQuestionId": "q-java-core-lambda-002"
}
```

Topics that MUST each have at least one question: java-core, collections, concurrency, jvm-internals, generics, oop, solid, clean-code, design-patterns, testing, api-design, architecture-patterns, database-fundamentals, distributed-systems, security-basics, data-structures, algorithms.

---

## Store additions — `src/store/useAppStore.ts`

Add a new slice:
```ts
assessmentHistory: AssessmentSession[];
currentAssessment: AssessmentSession | null;
startAssessment: () => void;
recordAnswer: (questionId: string, selectedOptionId: string, correct: boolean) => void;
completeAssessment: (topicScores: Record<string, number>) => void;
```

Persist `assessmentHistory` to localStorage. `currentAssessment` is session-only (not persisted).

---

## Test
No new test file. `npm run build` must pass.

## Commit
`T20: F0 assessment question bank — types, 30+ questions, store slice`
