import { COLS, ROWS } from '../../types'
import BingoCell from './BingoCell'
import type { Task } from '../../types'

interface Props {
  tasks: Task[]
  done: Record<string, true | 'pending'>
  onOpenTask: (id: string) => void
}

export default function BingoBoard({ tasks, done, onOpenTask }: Props) {
  return (
    <div
      className="grid mb-[14px]"
      style={{ gridTemplateColumns: '34px 1fr 1fr 1fr', gap: '4px' }}
    >
      <div />
      {COLS.map(col => (
        <div
          key={col}
          className="text-[11px] font-semibold text-primary text-center py-[5px] px-[2px]"
        >
          {col}
        </div>
      ))}
      {ROWS.map((pts, ri) => (
        <>
          <div
            key={`pts-${ri}`}
            className="text-[11px] font-medium text-[var(--color-muted)] flex items-center justify-center"
          >
            {pts}p
          </div>
          {COLS.map((_, ci) => {
            const task = tasks.find(t => t.row === ri && t.col === ci) ?? null
            return (
              <BingoCell
                key={`${ri}-${ci}`}
                task={task}
                status={task ? (done[task.id] as true | 'pending' | undefined) : undefined}
                onClick={() => task && onOpenTask(task.id)}
              />
            )
          })}
        </>
      ))}
    </div>
  )
}
