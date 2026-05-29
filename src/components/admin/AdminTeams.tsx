import { useState } from 'react'
import type { Team, Task } from '../../types'
import { teamPts } from '../../lib/gameLogic'

interface Props {
  teams: Record<string, Team>
  tasks: Task[]
  onApprove: (teamKey: string, taskId: string) => void
  onReject: (teamKey: string, taskId: string) => void
  onSetBonus: (teamKey: string, pts: number, msg?: string) => void
  onTaskBonus: (teamKey: string, extraPts: number, msg: string) => void
}

export default function AdminTeams({ teams, tasks, onApprove, onReject, onSetBonus, onTaskBonus }: Props) {
  const [bonusInputs, setBonusInputs] = useState<Record<string, string>>({})
  const [bonusMsgInputs, setBonusMsgInputs] = useState<Record<string, string>>({})
  const [taskBonusPts, setTaskBonusPts] = useState<Record<string, string>>({})
  const [taskBonusMsg, setTaskBonusMsg] = useState<Record<string, string>>({})

  const teamList = Object.values(teams)
  const adminTasks = tasks.filter(t => t.type === 'admin')

  if (!teamList.length) {
    return <p className="text-[var(--color-muted)] py-4">Ingen lag registrert ennå</p>
  }

  const inputStyle = { borderColor: 'var(--color-border)', background: 'var(--color-card)', color: 'inherit' }

  return (
    <div>
      {adminTasks.length > 0 && (
        <>
          <div className="text-[13px] font-semibold mb-2">Admin-oppgaver</div>
          {adminTasks.map(task => (
            <div
              key={task.id}
              className="border-[0.5px] rounded-[12px] p-[14px] mb-3"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-semibold">{task.title}</span>
                <span className="text-[13px] font-bold text-primary">{task.pts}p</span>
              </div>

              {teamList.map(team => {
                const status = team.done?.[task.id]
                const isDone = status === true || typeof status === 'number'
                const earnedPts = status === true ? task.pts : typeof status === 'number' ? status : null
                const key = `${team.key}:${task.id}`

                return (
                  <div
                    key={team.key}
                    className="border-t-[0.5px] pt-2 mt-2"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] shrink-0">{team.icon}</span>
                      <span className="flex-1 text-[13px] font-medium">{team.name}</span>

                      {!status && (
                        <span className="text-[11px] text-[var(--color-muted)]">Ikke levert</span>
                      )}
                      {status === 'pending' && (
                        <>
                          <span className="text-[11px] bg-accent-light text-accent-dark px-2 py-[2px] rounded-full">Venter</span>
                          <button
                            onClick={() => onApprove(team.key, task.id)}
                            className="bg-primary text-white text-[12px] px-3 py-1 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[30px]"
                          >
                            Godkjenn
                          </button>
                          <button
                            onClick={() => onReject(team.key, task.id)}
                            className="bg-[#FCEBEB] text-[#791F1F] text-[12px] px-2 py-1 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[30px]"
                          >
                            Avvis
                          </button>
                        </>
                      )}
                      {isDone && (
                        <span className="text-[11px] bg-primary-light text-primary-dark px-2 py-[2px] rounded-full shrink-0">
                          Fullført +{earnedPts}p
                        </span>
                      )}
                    </div>

                    {isDone && (
                      <div className="flex gap-2 mt-2 ml-7">
                        <input
                          type="number"
                          min="1"
                          placeholder="Ekstra p"
                          value={taskBonusPts[key] ?? ''}
                          onChange={e => setTaskBonusPts(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-[72px] p-2 border-[0.5px] rounded-[6px] text-[13px] text-center"
                          style={inputStyle}
                        />
                        <input
                          type="text"
                          placeholder="Melding (vises til laget)"
                          value={taskBonusMsg[key] ?? ''}
                          onChange={e => setTaskBonusMsg(prev => ({ ...prev, [key]: e.target.value }))}
                          className="flex-1 p-2 border-[0.5px] rounded-[6px] text-[13px]"
                          style={inputStyle}
                        />
                        <button
                          disabled={!taskBonusPts[key] || !taskBonusMsg[key]?.trim()}
                          onClick={() => {
                            const pts = parseInt(taskBonusPts[key], 10)
                            const msg = taskBonusMsg[key]?.trim()
                            if (!isNaN(pts) && pts > 0 && msg) {
                              onTaskBonus(team.key, pts, msg)
                              setTaskBonusPts(prev => ({ ...prev, [key]: '' }))
                              setTaskBonusMsg(prev => ({ ...prev, [key]: '' }))
                            }
                          }}
                          className="bg-primary text-white text-[12px] px-3 py-1 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[32px] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                          Gi bonus
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </>
      )}

      <div className="text-[13px] font-semibold mb-2 mt-1">Alle lag</div>
      {teamList.map(team => {
        const doneCount = Object.values(team.done ?? {}).filter(v => v === true || typeof v === 'number').length
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
                  PIN: {team.pin ?? '—'} · {doneCount} fullført · {teamPts(team, tasks)}p totalt
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                value={bonusVal}
                onChange={e => setBonusInputs(prev => ({ ...prev, [team.key]: e.target.value }))}
                className="w-[70px] p-2 border-[0.5px] rounded-[6px] text-[14px] text-center shrink-0"
                style={inputStyle}
                placeholder="p"
              />
              <input
                type="text"
                value={bonusMsgInputs[team.key] ?? ''}
                onChange={e => setBonusMsgInputs(prev => ({ ...prev, [team.key]: e.target.value }))}
                className="flex-1 p-2 border-[0.5px] rounded-[6px] text-[13px]"
                style={inputStyle}
                placeholder="Melding (valgfri)"
              />
              <button
                onClick={() => {
                  const pts = parseInt(bonusVal, 10)
                  const msg = bonusMsgInputs[team.key]?.trim()
                  if (!isNaN(pts)) onSetBonus(team.key, pts, msg || undefined)
                }}
                className="bg-primary-light text-primary-dark text-[12px] px-3 py-2 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[36px] shrink-0"
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
