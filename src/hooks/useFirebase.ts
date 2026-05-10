import { useEffect, useState, useCallback } from 'react'
import { ref, onValue, set, remove } from 'firebase/database'
import { db } from '../lib/firebase'
import { objToTasksArr, tasksToFirebaseObj, DEFAULT_TASKS } from '../lib/gameLogic'
import type { GameState, Task } from '../types'

const DEFAULT_TIMER = { running: false, endsAt: null, minutes: 90 }

const DEFAULT_GAME_STATE: GameState = {
  teams: {},
  tasks: DEFAULT_TASKS,
  timer: DEFAULT_TIMER,
}

export function useFirebase() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE)
  const [fbReady, setFbReady] = useState(false)

  useEffect(() => {
    const rootRef = ref(db, '/')
    const unsub = onValue(rootRef, (snapshot) => {
      const d = snapshot.val() as {
        teams?: GameState['teams']
        tasks?: Record<string, Task>
        timer?: GameState['timer']
      } | null

      if (!d || !d.tasks) {
        set(rootRef, {
          teams: {},
          tasks: tasksToFirebaseObj(DEFAULT_TASKS),
          timer: DEFAULT_TIMER,
        })
        return
      }

      setFbReady(true)
      setGameState({
        teams: d.teams ?? {},
        tasks: objToTasksArr(d.tasks),
        timer: d.timer ?? DEFAULT_TIMER,
      })
    })
    return unsub
  }, [])

  const writeTeam = useCallback((key: string, team: object) => {
    set(ref(db, `/teams/${key}`), team)
  }, [])

  const writeDone = useCallback((teamKey: string, taskId: string, value: true | 'pending') => {
    set(ref(db, `/teams/${teamKey}/done/${taskId}`), value)
  }, [])

  const deleteDone = useCallback((teamKey: string, taskId: string) => {
    remove(ref(db, `/teams/${teamKey}/done/${taskId}`))
  }, [])

  const writeAdminPts = useCallback((teamKey: string, pts: number) => {
    set(ref(db, `/teams/${teamKey}/adminPts`), pts)
  }, [])

  const writeTask = useCallback((task: Task) => {
    set(ref(db, `/tasks/${task.id}`), task)
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    remove(ref(db, `/tasks/${taskId}`))
  }, [])

  const writeTimer = useCallback((timer: GameState['timer']) => {
    set(ref(db, '/timer'), timer)
  }, [])

  const resetAllTeams = useCallback(() => {
    set(ref(db, '/teams'), {})
  }, [])

  return {
    gameState,
    fbReady,
    writeTeam,
    writeDone,
    deleteDone,
    writeAdminPts,
    writeTask,
    deleteTask,
    writeTimer,
    resetAllTeams,
  }
}
