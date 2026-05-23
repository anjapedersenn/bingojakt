import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../components/layout/AppLayout'
import { useTasks } from '../hooks/useTasks'
import { teamPts } from '../lib/gameLogic'
import ScreenHero from '../components/layout/ScreenHero'
import BingoBoard from '../components/bingo/BingoBoard'
import TaskModal from '../components/task/TaskModal'
import HelpModal from '../components/HelpModal'

export default function BingoPage() {
  const { gameState, session, logout, writeDone } = useApp()
  const navigate = useNavigate()
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const team = gameState.teams[session.teamKey]
  const { done, completedCount, totalCount } = useTasks(gameState.tasks, team)
  const pts = team ? teamPts(team, gameState.tasks) : 0
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  const openTask = gameState.tasks.find(t => t.id === openTaskId) ?? null

  const handleMarkDone = () => {
    if (!openTaskId) return
    writeDone(session.teamKey, openTaskId, true)
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

      <div className="flex items-center justify-between mb-[10px]">
        <div>
          <div className="text-xl font-semibold">
            {session.teamIcon} {session.teamName}
          </div>
          <div className="text-[12px] text-[var(--color-muted)]">
            {completedCount} av {totalCount} fullført
          </div>
        </div>
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
            onClick={() => setShowHelp(true)}
            className="flex items-center justify-center w-[40px] h-[40px] border-[0.5px] rounded-[8px] cursor-pointer bg-transparent text-primary text-[18px]"
            style={{ borderColor: 'var(--color-primary)' }}
            aria-label="Spilleregler"
          >
            <i className="ti ti-help" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[13px]">
          <span className="text-[var(--color-muted)]">
            {completedCount} av {totalCount}
          </span>
          <span className="text-primary font-bold text-lg">{pts} p</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden mt-1.5"
          style={{ background: 'rgba(0,0,0,0.08)' }}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <BingoBoard
        tasks={gameState.tasks}
        done={done}
        onOpenTask={setOpenTaskId}
      />

      <div className="bg-primary-light rounded-[8px] p-3 text-[13px] text-primary-dark">
        <i className="ti ti-map-pin" aria-hidden="true" /> Finn stasjonen på kartet for å
        løse oppgaven. 
      </div>

      {openTask && (
        <TaskModal
          task={openTask}
          doneStatus={done[openTask.id] as true | 'pending' | undefined}
          onClose={() => setOpenTaskId(null)}
          onMarkDone={handleMarkDone}
          onMarkPending={handleMarkPending}
        />
      )}

      {showHelp && (
        <HelpModal config={gameState.config} onClose={() => setShowHelp(false)} />
      )}
    </div>
  )
}
