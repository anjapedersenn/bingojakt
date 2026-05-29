import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../components/layout/AppLayout'
import ScreenHero from '../components/layout/ScreenHero'
import MapView from '../components/map/MapView'
import TaskModal from '../components/task/TaskModal'
import OnboardingGuide from '../components/onboarding/OnboardingGuide'

export default function MapPage() {
  const { gameState, session, logout, writeDone } = useApp()
  const navigate = useNavigate()
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)

  const team = gameState.teams[session.teamKey]
  const done = (team?.done ?? {}) as Record<string, true | 'pending'>

  const openTask = gameState.tasks.find(t => t.id === openTaskId) ?? null

  const handleMarkDone = (pts?: number) => {
    if (!openTaskId) return
    writeDone(session.teamKey, openTaskId, pts !== undefined ? pts : true)
    setOpenTaskId(null)
  }

  const handleMarkPending = () => {
    if (!openTaskId) return
    writeDone(session.teamKey, openTaskId, 'pending')
    setOpenTaskId(null)
  }

  return (
    <div className="p-4">
      <ScreenHero />

      <div className="flex items-center justify-between mb-[14px]">
        <h2 className="text-[20px] font-semibold m-0">Kart</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex items-center gap-[6px] text-[13px] text-[var(--color-muted)] border-[0.5px] rounded-[8px] px-3 py-2 cursor-pointer min-h-[40px] font-[inherit] bg-transparent"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <i className="ti ti-logout" aria-hidden="true" /> Logg ut
          </button>
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center justify-center w-[40px] h-[40px] border-[0.5px] rounded-[8px] cursor-pointer bg-transparent text-primary text-[18px]"
            style={{ borderColor: 'var(--color-primary)' }}
            aria-label="Spilleregler"
          >
            <i className="ti ti-help" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MapView tasks={gameState.tasks} done={done} onOpenTask={setOpenTaskId} />

      {openTask && (
        <TaskModal
          task={openTask}
          doneStatus={done[openTask.id]}
          onClose={() => setOpenTaskId(null)}
          onMarkDone={handleMarkDone}
          onMarkPending={handleMarkPending}
        />
      )}

      {showGuide && <OnboardingGuide onComplete={() => setShowGuide(false)} />}
    </div>
  )
}
