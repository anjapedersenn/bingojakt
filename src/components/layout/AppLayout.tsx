import { Outlet, useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useFirebase } from '../../hooks/useFirebase'
import { useTeam } from '../../hooks/useTeam'
import TimerBar from './TimerBar'
import BottomNav from './BottomNav'
import type { GameState, GameConfig, SessionState, Team } from '../../types'

type FirebaseReturn = ReturnType<typeof useFirebase>

export interface AppContextType {
  gameState: GameState
  fbReady: boolean
  session: SessionState
  logout: () => void
  writeTeam: FirebaseReturn['writeTeam']
  writeDone: FirebaseReturn['writeDone']
  deleteDone: FirebaseReturn['deleteDone']
  writeAnswers: FirebaseReturn['writeAnswers']
  writeAdminPts: FirebaseReturn['writeAdminPts']
  writeTaskBonus: FirebaseReturn['writeTaskBonus']
  writeTeamField: FirebaseReturn['writeTeamField']
  writeTask: FirebaseReturn['writeTask']
  deleteTask: FirebaseReturn['deleteTask']
  writeTimer: FirebaseReturn['writeTimer']
  resetAllTeams: FirebaseReturn['resetAllTeams']
  writeConfig: (config: GameConfig) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppLayout')
  return ctx
}

export default function AppLayout() {
  const navigate = useNavigate()
  const { session, logout } = useTeam()
  const firebase = useFirebase()
  const prevTeamRef = useRef<Team | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!session) {
      navigate('/', { replace: true })
    }
  }, [session, navigate])

  useEffect(() => {
    if (!firebase.fbReady || !session || session.isAdmin) return
    if (!firebase.gameState.teams[session.teamKey]) {
      logout()
      navigate('/', { replace: true })
    }
  }, [firebase.fbReady, firebase.gameState.teams, session, logout, navigate])

  useEffect(() => {
    if (!session || session.isAdmin) return
    const team = firebase.gameState.teams[session.teamKey]
    const prev = prevTeamRef.current

    if (prev && team) {
      const newPts = team.adminPts ?? 0
      const prevPts = prev.adminPts ?? 0
      let msg: string | null = null

      if (team.bonusMsg && team.bonusMsg !== prev.bonusMsg) {
        msg = team.bonusMsg
      } else if (newPts > prevPts) {
        msg = `+${newPts - prevPts} poeng fra admin! 🎉`
      } else {
        for (const taskId of Object.keys(team.done ?? {})) {
          const wasPending = prev.done?.[taskId] === 'pending'
          const nowDone = team.done[taskId]
          if (wasPending && nowDone === true) {
            const task = firebase.gameState.tasks.find(t => t.id === taskId)
            msg = `Oppgave godkjent! +${task?.pts ?? ''}p`
            break
          }
        }
      }

      if (msg) {
        setToast(msg)
        if (toastTimer.current) clearTimeout(toastTimer.current)
        toastTimer.current = setTimeout(() => setToast(null), 3000)
      }
    }

    prevTeamRef.current = team ?? null
  }, [firebase.gameState.teams, firebase.gameState.tasks, session])

  if (!session) return null

  const ctx: AppContextType = {
    ...firebase,
    session,
    logout,
  }

  return (
    <AppContext.Provider value={ctx}>
      <div
        className="max-w-[430px] mx-auto min-h-screen pb-[72px]"
        style={{ background: 'var(--color-bg)' }}
      >
        <TimerBar timer={firebase.gameState.timer} />
        <Outlet />
        <BottomNav isAdmin={session.isAdmin} />
        {toast && <div className="admin-toast">{toast}</div>}
      </div>
    </AppContext.Provider>
  )
}
