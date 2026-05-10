import type { Team, Task } from '../../types'
import { teamPts } from '../../lib/gameLogic'

interface Props {
  teams: Record<string, Team>
  tasks: Task[]
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard({ teams, tasks }: Props) {
  const sorted = Object.values(teams)
    .map(t => ({ ...t, total: teamPts(t, tasks) }))
    .sort((a, b) => b.total - a.total)

  if (!sorted.length) {
    return (
      <p className="text-[var(--color-muted)] text-center py-8">
        Ingen lag registrert ennå
      </p>
    )
  }

  return (
    <div>
      {sorted.map((t, i) => {
        const doneCount = Object.values(t.done ?? {}).filter(v => v === true).length
        return (
          <div
            key={t.key}
            className="flex items-center gap-3 py-[14px] border-b-[0.5px]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="text-[26px] min-w-[36px]">
              {MEDALS[i] ?? (
                <span className="text-[16px] text-[var(--color-muted)]">{i + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold">
                {t.icon} {t.name}
              </div>
              <div className="text-[12px] text-[var(--color-muted)]">
                {doneCount} oppgaver fullført
              </div>
            </div>
            <div className="text-[18px] text-primary font-bold">{t.total}p</div>
          </div>
        )
      })}
    </div>
  )
}
