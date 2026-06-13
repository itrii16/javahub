import javaCoreQA from './java-core-qa.json'
import engineeringQA from './engineering-principles-qa.json'
import architectureQA from './architecture-qa.json'
import interviewDsQA from './interview-ds-qa.json'
import type { InterviewQuestion } from '@/types/content'

export const allInterviewQuestions: InterviewQuestion[] = [
  ...(javaCoreQA as InterviewQuestion[]),
  ...(engineeringQA as InterviewQuestion[]),
  ...(architectureQA as InterviewQuestion[]),
  ...(interviewDsQA as InterviewQuestion[]),
]

export { javaCoreQA, engineeringQA, architectureQA, interviewDsQA }
