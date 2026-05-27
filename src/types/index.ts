export type TaskType = 'quiz' | 'multi' | 'admin'

export interface Task {
  id: string
  col: 0 | 1 | 2
  row: 0 | 1 | 2
  pts: 10 | 20 | 30
  title: string
  type: TaskType
  question: string
  code?: string
  answer?: string
  hint?: string
  fields?: { label: string; answer: string | null; options?: string[] }[]
  emoji?: string
}

export interface Team {
  key: string
  name: string
  icon: string
  pin: string
  done: Record<string, true | 'pending' | number>
  answers?: Record<string, string[]>
  adminPts: number
  hasSeenGuide?: boolean
}

export interface GameConfig {
  rules: string
  phone: string
}

export const DEFAULT_CONFIG: GameConfig = {
  rules:
    '1. Finn oppgaven på kartet\n' +
    '2. Svar riktig for automatiske poeng\n' +
    '3. Ved utfordringer: send inn svar og vent på poeng fra admin\n' +
    '4. Laget med flest poeng vinner! 🏆',
  phone: '',
}

export interface GameState {
  teams: Record<string, Team>
  tasks: Task[]
  timer: {
    running: boolean
    endsAt: number | null
    minutes: number
  }
  config: GameConfig
}

export interface SessionState {
  teamKey: string
  teamName: string
  teamIcon: string
  isAdmin: boolean
}

export const ICONS = ['🦁','🦋','🐬','🦅','🍋','🌸','🦄','🍷','🥂','🦩','🐙','🚕'] as const

export const COLS = ['Quiz', 'Fysisk', 'Tenke'] as const

export const ROWS = [10, 20, 30] as const

export const MAP_POS: Record<string, { x: number; y: number }> = {
  '1a': { x: 18, y: 22 }, '1b': { x: 42, y: 55 }, '1c': { x: 70, y: 18 },
  '2a': { x: 28, y: 80 }, '2b': { x: 55, y: 72 }, '2c': { x: 75, y: 45 },
  '3a': { x: 18, y: 48 }, '3b': { x: 60, y: 88 }, '3c': { x: 85, y: 70 },
}
