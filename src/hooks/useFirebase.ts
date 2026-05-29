import { useEffect, useState, useCallback } from 'react'
import { ref, onValue, set, update, remove } from 'firebase/database'
import { db } from '../lib/firebase'
import { objToTasksArr, tasksToFirebaseObj, DEFAULT_TASKS } from '../lib/gameLogic'
import type { GameState, GameConfig, Task, Team } from '../types'
import { DEFAULT_CONFIG } from '../types'

const DEFAULT_TIMER = { running: false, endsAt: null, minutes: 90 }

const DEFAULT_GAME_STATE: GameState = {
  teams: {},
  tasks: DEFAULT_TASKS,
  timer: DEFAULT_TIMER,
  config: DEFAULT_CONFIG,
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
        config?: GameConfig
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
        config: d.config ?? DEFAULT_CONFIG,
      })
    })
    return unsub
  }, [])

  const writeTeam = useCallback((key: string, team: object) => {
    set(ref(db, `/teams/${key}`), team)
  }, [])

  const createTeam = useCallback(async (name: string, icon: string, pin: string): Promise<void> => {
    const nameTaken = Object.values(gameState.teams).some(
      t => t.name.toLowerCase() === name.toLowerCase()
    )
    if (nameTaken) throw new Error('Lagnavn er allerede tatt')
    const key = encodeURIComponent(name.trim() + icon)
    const team: Team = { key, name: name.trim(), icon, pin, done: {}, adminPts: 0 }
    await set(ref(db, `/teams/${key}`), team)
  }, [gameState.teams])

  const loginTeam = useCallback(async (name: string, pin: string): Promise<Team> => {
    const team = Object.values(gameState.teams).find(
      t => t.name.toLowerCase() === name.toLowerCase()
    )
    if (!team || team.pin !== pin) throw new Error('Feil lagnavn eller PIN')
    return team
  }, [gameState.teams])

  const writeDone = useCallback((teamKey: string, taskId: string, value: true | 'pending' | number) => {
    set(ref(db, `/teams/${teamKey}/done/${taskId}`), value)
  }, [])

  const writeAnswers = useCallback((teamKey: string, taskId: string, answers: string[]) => {
    set(ref(db, `/teams/${teamKey}/answers/${taskId}`), answers)
  }, [])

  const deleteDone = useCallback((teamKey: string, taskId: string) => {
    remove(ref(db, `/teams/${teamKey}/done/${taskId}`))
  }, [])

  const writeAdminPts = useCallback((teamKey: string, pts: number, msg?: string) => {
    if (msg) {
      update(ref(db, `/teams/${teamKey}`), { adminPts: pts, bonusMsg: msg })
    } else {
      set(ref(db, `/teams/${teamKey}/adminPts`), pts)
    }
  }, [])

  const writeTaskBonus = useCallback((teamKey: string, currentAdminPts: number, extraPts: number, msg: string) => {
    update(ref(db, `/teams/${teamKey}`), {
      adminPts: currentAdminPts + extraPts,
      bonusMsg: msg,
    })
  }, [])

  const writeTeamField = useCallback((teamKey: string, field: string, value: unknown) => {
    set(ref(db, `/teams/${teamKey}/${field}`), value)
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

  const writeConfig = useCallback((config: GameConfig) => {
    set(ref(db, '/config'), config)
  }, [])

  return {
    gameState,
    fbReady,
    writeTeam,
    createTeam,
    loginTeam,
    writeDone,
    deleteDone,
    writeAnswers,
    writeAdminPts,
    writeTaskBonus,
    writeTeamField,
    writeTask,
    deleteTask,
    writeTimer,
    resetAllTeams,
    writeConfig,
  }
}
