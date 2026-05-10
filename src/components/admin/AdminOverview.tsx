import type { Team, Task } from '../../types'
import { teamPts } from '../../lib/gameLogic'

interface Props {
  teams: Record<string, Team>
  tasks: Task[]
  onResetTeams: () => void
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function AdminOverview({ teams, tasks, onResetTeams }: Props) {
  const teamList = Object.values(teams)
  const pendingCount = teamList.reduce(
    (s, t) => s + Object.values(t.done ?? {}).filter(v => v === 'pending').length,
    0
  )
  const sorted = teamList
    .map(t => ({ ...t, total: teamPts(t, tasks) }))
    .sort((a, b) => b.total - a.total)

  return (
    <div>
      <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
        <div className="bg-primary-light rounded-[8px] p-[14px] text-center">
          <div className="text-[28px] font-bold text-primary-dark">{teamList.length}</div>
          <div className="text-[12px] text-primary">Lag</div>
        </div>
        <div
          className={`rounded-[8px] p-[14px] text-center ${pendingCount ? 'bg-accent-light' : 'bg-primary-light'}`}
        >
          <div
            className={`text-[28px] font-bold ${pendingCount ? 'text-accent-dark' : 'text-primary-dark'}`}
          >
            {pendingCount}
          </div>
          <div className={`text-[12px] ${pendingCount ? 'text-accent' : 'text-primary'}`}>
            Venter godkj.
          </div>
        </div>
      </div>

      <h3 className="text-[16px] font-semibold mb-[10px]">Live stilling</h3>

      {sorted.length === 0 ? (
        <p className="text-[var(--color-muted)]">Ingen lag ennå</p>
      ) : (
        sorted.map((t, i) => (
          <div
            key={t.key}
            className="flex items-center gap-3 py-[14px] border-b-[0.5px]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="text-[22px] min-w-[30px]">
              {MEDALS[i] ?? <span className="text-[14px]">{i + 1}</span>}
            </div>
            <div className="flex-1 text-[15px] font-semibold">
              {t.icon} {t.name}
            </div>
            <div className="text-primary font-bold text-[15px]">{teamPts(t, tasks)}p</div>
          </div>
        ))
      )}

      <button
        onClick={() => {
          if (window.confirm('Reset alle lagdata? Dette kan ikke angres.')) {
            onResetTeams()
          }
        }}
        className="w-full bg-accent text-white border-none p-[13px] rounded-[8px] text-[14px] cursor-pointer mt-4 min-h-[48px] font-[inherit]"
      >
        Reset alle lag
      </button>
    </div>
  )
}
