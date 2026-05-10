import { useState } from 'react'
import type { Team, Task } from '../../types'
import { teamPts } from '../../lib/gameLogic'

interface Props {
  teams: Record<string, Team>
  tasks: Task[]
  onApprove: (teamKey: string, taskId: string) => void
  onReject: (teamKey: string, taskId: string) => void
  onSetBonus: (teamKey: string, pts: number) => void
}

export default function AdminTeams({ teams, tasks, onApprove, onReject, onSetBonus }: Props) {
  const [bonusInputs, setBonusInputs] = useState<Record<string, string>>({})

  const teamList = Object.values(teams)

  if (!teamList.length) {
    return <p className="text-[var(--color-muted)] py-4">Ingen lag registrert ennå</p>
  }

  return (
    <div>
      {teamList.map(team => {
        const pendingTasks = Object.entries(team.done ?? {})
          .filter(([, v]) => v === 'pending')
          .map(([tid]) => tasks.find(t => t.id === tid))
          .filter(Boolean) as Task[]

        const doneCount = Object.values(team.done ?? {}).filter(v => v === true).length
        const bonusVal = bonusInputs[team.key] ?? String(team.adminPts ?? 0)

        return (
          <div
            key={team.key}
            className="border-[0.5px] rounded-[12px] p-[14px] mb-3"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
          >
            <div className="flex items-center gap-2 mb-[10px]">
              <span className="text-[22px]">{team.icon}</span>
              <div>
                <div className="text-[15px] font-semibold">{team.name}</div>
                <div className="text-[12px] text-[var(--color-muted)]">
                  PIN: {team.pin ?? '—'} · {doneCount} fullført · {pendingTasks.length} venter ·{' '}
                  {teamPts(team, tasks)}p totalt
                </div>
              </div>
            </div>

            {pendingTasks.length > 0 && (
              <div className="mb-3">
                <div className="text-[12px] font-semibold text-accent-dark mb-2">
                  Venter godkjenning:
                </div>
                {pendingTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 py-2 border-t-[0.5px]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span className="flex-1 text-[13px]">
                      {task.title} (+{task.pts}p)
                    </span>
                    <button
                      onClick={() => onApprove(team.key, task.id)}
                      className="bg-primary text-white text-[12px] px-3 py-1 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[32px]"
                    >
                      Godkjenn +{task.pts}p
                    </button>
                    <button
                      onClick={() => onReject(team.key, task.id)}
                      className="bg-[#FCEBEB] text-[#791F1F] text-[12px] px-3 py-1 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[32px]"
                    >
                      Avvis
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="text-[13px] text-[var(--color-muted)]">Bonuspoeng:</label>
              <input
                type="number"
                min="0"
                value={bonusVal}
                onChange={e =>
                  setBonusInputs(prev => ({ ...prev, [team.key]: e.target.value }))
                }
                className="w-[70px] p-2 border-[0.5px] rounded-[6px] text-[14px] text-center"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)', color: 'inherit' }}
              />
              <button
                onClick={() => {
                  const pts = parseInt(bonusVal, 10)
                  if (!isNaN(pts)) onSetBonus(team.key, pts)
                }}
                className="bg-primary-light text-primary-dark text-[12px] px-3 py-2 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[36px]"
              >
                Sett
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
