import { useNavigate } from 'react-router-dom'
import { useApp } from '../components/layout/AppLayout'
import ScreenHero from '../components/layout/ScreenHero'
import Leaderboard from '../components/leaderboard/Leaderboard'

export default function LeaderboardPage() {
  const { gameState, logout } = useApp()
  const navigate = useNavigate()

  return (
    <div className="p-4">
      <ScreenHero />

      <div className="flex items-center justify-between mb-[14px]">
        <div>
          <h2 className="text-[20px] font-semibold m-0">Stillingen</h2>
          <div className="text-[12px] text-[var(--color-muted)]">
            Sanntidsoppdatering via Firebase
          </div>
        </div>
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
      </div>

      <Leaderboard teams={gameState.teams} tasks={gameState.tasks} />
    </div>
  )
}
