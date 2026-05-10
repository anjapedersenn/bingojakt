import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../components/layout/AppLayout'
import ScreenHero from '../components/layout/ScreenHero'
import Leaderboard from '../components/leaderboard/Leaderboard'
import HelpModal from '../components/HelpModal'

export default function LeaderboardPage() {
  const { gameState, logout } = useApp()
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="p-4">
      <ScreenHero />

      <div className="flex items-center justify-between mb-[14px]">
        <div>
          <h2 className="text-[20px] font-semibold m-0">Leaderboard</h2>
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
            className="flex items-center justify-center w-[40px] h-[40px] border-[0.5px] rounded-[8px] cursor-pointer bg-transparent text-[var(--color-muted)] text-[18px]"
            style={{ borderColor: 'var(--color-border)' }}
            aria-label="Spilleregler"
          >
            <i className="ti ti-help" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Leaderboard teams={gameState.teams} tasks={gameState.tasks} />

      {showHelp && (
        <HelpModal config={gameState.config} onClose={() => setShowHelp(false)} />
      )}
    </div>
  )
}
