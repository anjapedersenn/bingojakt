import { useMemo } from 'react'
import type { Task, Team } from '../types'
import { COLS, ROWS } from '../types'

export function useTasks(tasks: Task[], team: Team | undefined) {
  const done = team?.done ?? {}

  const grid = useMemo(() => {
    return ROWS.map((_, ri) =>
      COLS.map((_, ci) => tasks.find(t => t.row === ri && t.col === ci) ?? null)
    )
  }, [tasks])

  const completedCount = useMemo(
    () => Object.values(done).filter(v => v === true || typeof v === 'number').length,
    [done]
  )

  return { done, grid, completedCount, totalCount: tasks.length }
}
