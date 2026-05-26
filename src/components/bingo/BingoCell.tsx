import type { Task } from '../../types'

interface Props {
  task: Task | null
  status: true | 'pending' | number | undefined
  onClick: () => void
}

export default function BingoCell({ task, status, onClick }: Props) {
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

  const statusClass = isDone
    ? 'bg-primary-light border-primary'
    : isPending
      ? 'bg-accent-light border-accent'
      : 'border-[var(--color-border)]'

  return (
    <div
      className={`relative rounded-sm border-[0.5px] ${statusClass} p-2 pt-5 text-center cursor-pointer text-[11px] leading-[1.3] min-h-20 flex flex-col items-center justify-center gap-0.5 select-none active:scale-95 transition-transform shadow-sm`}
      style={{ background: isDone || isPending ? undefined : 'var(--color-card)' }}
      onClick={onClick}
    >
      <span className="absolute top-1.25 right-1.25 bg-primary-light text-primary text-[10px] font-semibold rounded-full px-1.5 py-px leading-none">
        {task.pts}p
      </span>

      {task.emoji && (
        <span className="text-2xl leading-none mb-0.5">{task.emoji}</span>
      )}

      {isDone ? (
        <>
          <span className="text-2xl text-primary leading-none">✓</span>
          <span className="line-through text-muted">{task.title}</span>
        </>
      ) : (
        <>
          {isPending && <span className="text-[12px] leading-none">⏳</span>}
          <span>{task.title}</span>
        </>
      )}
    </div>
  )
}
