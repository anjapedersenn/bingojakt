import { Outlet, useNavigate } from 'react-router-dom'
import { createContext, useContext, useEffect } from 'react'
import { useFirebase } from '../../hooks/useFirebase'
import { useTeam } from '../../hooks/useTeam'
import TimerBar from './TimerBar'
import BottomNav from './BottomNav'
import type { GameState, SessionState } from '../../types'

type FirebaseReturn = ReturnType<typeof useFirebase>

export interface AppContextType {
  gameState: GameState
  fbReady: boolean
  session: SessionState
  logout: () => void
  writeTeam: FirebaseReturn['writeTeam']
  writeDone: FirebaseReturn['writeDone']
  deleteDone: FirebaseReturn['deleteDone']
  writeAdminPts: FirebaseReturn['writeAdminPts']
  writeTask: FirebaseReturn['writeTask']
  deleteTask: FirebaseReturn['deleteTask']
  writeTimer: FirebaseReturn['writeTimer']
  resetAllTeams: FirebaseReturn['resetAllTeams']
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

  useEffect(() => {
    if (!session) {
      navigate('/', { replace: true })
    }
  }, [session, navigate])

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
      </div>
    </AppContext.Provider>
  )
}
