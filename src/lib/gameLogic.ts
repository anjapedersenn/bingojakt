import type { Task, Team } from '../types'

export function norm(s: string | undefined | null): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, '').trim()
}

export function isCorrect(answer: string | undefined, input: string): boolean {
  return norm(answer) === norm(input)
}

export function teamPts(team: Team, tasks: Task[]): number {
  let p = 0
  Object.entries(team.done ?? {}).forEach(([tid, v]) => {
    if (v === true) {
      const task = tasks.find(t => t.id === tid)
      if (task) p += task.pts
    }
  })
  return p + (team.adminPts ?? 0)
}

export function objToTasksArr(obj: Record<string, Task> | null): Task[] {
  if (!obj) return []
  return Object.values(obj).sort((a, b) =>
    a.row !== b.row ? a.row - b.row : a.col - b.col
  )
}

export function tasksToFirebaseObj(arr: Task[]): Record<string, Task> {
  const obj: Record<string, Task> = {}
  arr.forEach(t => { obj[t.id] = t })
  return obj
}

export const DEFAULT_TASKS: Task[] = [
  {
    id: '1a', col: 0, row: 0, pts: 10, code: '1111', type: 'quiz',
    title: 'Q1: Møtet',
    question: 'Hvilket år møttes Synne og Aksel for første gang?',
    answer: '2018', hint: 'Årstall mellom 2015–2022',
  },
  {
    id: '1b', col: 1, row: 0, pts: 10, code: '2222', type: 'multi',
    title: 'Frukt-telling',
    question: 'Tell alle frukter i det avmerkede området! Send én person per frukttype — 1 minutt. Løs regnestykket.',
    fields: [
      { label: 'Antall sitroner', answer: null },
      { label: 'Antall pærer', answer: null },
      { label: 'Antall epler', answer: null },
      { label: 'Sum totalt', answer: null },
    ],
  },
  {
    id: '1c', col: 2, row: 0, pts: 10, code: '3333', type: 'quiz',
    title: 'Emoji-quiz',
    question: 'Hvilken destinasjon er dette? 🍕🛵🇮🇹☀️🍷',
    answer: 'italia', hint: 'Et land',
  },
  {
    id: '2a', col: 0, row: 1, pts: 20, code: '4444', type: 'quiz',
    title: 'Q2: Brudeparet',
    question: 'Hva er Aksels mors fornavn?',
    answer: 'anne', hint: 'Vanlig norsk navn',
  },
  {
    id: '2b', col: 1, row: 1, pts: 20, code: '5555', type: 'admin',
    title: 'Musikk-leken',
    question: 'Nyn en kjent sang uten ord! Admin gjetter innen 60 sek. Poeng etter vanskelighetsgrad.',
  },
  {
    id: '2c', col: 2, row: 1, pts: 20, code: '6666', type: 'quiz',
    title: 'Årstall-lek',
    question: 'Se på bildet på stasjonen. Hvilket årstall ble det tatt?',
    answer: '2019', hint: 'Se nøye',
  },
  {
    id: '3a', col: 0, row: 2, pts: 30, code: '7777', type: 'quiz',
    title: 'Q3: Hard trivia',
    question: 'Hvor møttes Synne og Aksel for aller første gang?',
    answer: 'oslo', hint: 'En norsk by',
  },
  {
    id: '3b', col: 1, row: 2, pts: 30, code: '8888', type: 'admin',
    title: 'Vær kreativ!',
    question: 'Gjør en fysisk aktivitet ingen andre lag gjør. 3 minutter. Admin bedømmer.',
  },
  {
    id: '3c', col: 2, row: 2, pts: 30, code: '9999', type: 'quiz',
    title: 'Ordspill-quiz',
    question: 'Løs gåten: Jeg er frukt, men også noe søtt. Jeg er rund og rød. Hva er jeg?',
    answer: 'kirsebær', hint: 'Norsk frukt',
  },
]
