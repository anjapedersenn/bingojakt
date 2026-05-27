import type { Task } from '../../types'

const CAT_COLORS = [
  'var(--color-primary)',
  'var(--color-accent)',
  '#7c5cbf',
]

interface Props {
  task: Task | null
  taskNum: number
  status: true | 'pending' | number | undefined
  onClick: () => void
}

export default function BingoCell({ task, taskNum, status, onClick }: Props) {
  if (!task) {
    return (
      <div
        className="rounded-sm border-[0.5px] p-2 text-center min-h-20 flex items-center justify-center opacity-20 text-sm border-border shadow-sm"
        style={{ background: 'var(--color-card)' }}
      >
        —
      </div>
    )
  }

  const isDone = status === true || typeof status === 'number'
  const isPending = status === 'pending'
  const catColor = CAT_COLORS[task.col]

  const statusClass = isDone
    ? 'bg-primary-light border-primary'
    : isPending
      ? 'bg-accent-light border-accent'
      : 'border-[var(--color-border)]'

  return (
    <div
      className={`rounded-sm border-[0.5px] ${statusClass} p-2 text-center cursor-pointer leading-[1.3] min-h-20 flex flex-col items-center justify-center gap-1 select-none active:scale-95 transition-transform shadow-sm`}
      style={{ background: isDone || isPending ? undefined : 'var(--color-card)' }}
      onClick={onClick}
    >
      {isDone ? (
        <>
          <span className="text-2xl text-primary leading-none">✓</span>
          <span className="text-[10px] line-through text-muted">{task.title}</span>
        </>
      ) : (
        <>
          <span
            className="text-[28px] font-bold leading-none"
            style={{ color: catColor }}
          >
            {taskNum}
          </span>
          {isPending && <span className="text-[11px] leading-none">⏳</span>}
          <span className="text-[10px] text-muted leading-snug">{task.title}</span>
        </>
      )}
    </div>
  )
}
