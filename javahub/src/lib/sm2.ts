import type { SM2State } from '@/types'

export const SM2_DEFAULT_STATE: SM2State = {
  interval: 0,
  repetition: 0,
  efactor: 2.5,
  dueDate: new Date().toISOString().split('T')[0],
}
