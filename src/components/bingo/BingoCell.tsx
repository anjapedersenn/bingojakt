import type { Task } from '../../types'

interface Props {
  task: Task | null
  status: true | 'pending' | undefined
  onClick: () => void
}

export default function BingoCell({ task, status, onClick }: Props) {
  if (!task) {
    return (
      <div
        className="rounded-[8px] border-[0.5px] p-2 text-center min-h-[60px] flex items-center justify-center opacity-20 text-sm border-[var(--color-border)]"
        style={{ background: 'var(--color-card)' }}
      >
        —
      </div>
    )
  }

  const statusClass =
    status === true
      ? 'bg-primary-light border-primary'
      : status === 'pending'
        ? 'bg-accent-light border-accent'
        : 'border-[var(--color-border)]'

  return (
    <div
      className={`rounded-[8px] border-[0.5px] ${statusClass} p-2 text-center cursor-pointer text-[11px] leading-[1.3] min-h-[60px] flex flex-col items-center justify-center gap-[2px] select-none active:scale-95 transition-transform`}
      style={{ background: status ? undefined : 'var(--color-card)' }}
      onClick={onClick}
    >
      <span>{task.title}</span>
      <span className="text-[9px] text-[var(--color-muted)]">#{task.id}</span>
    </div>
  )
}
