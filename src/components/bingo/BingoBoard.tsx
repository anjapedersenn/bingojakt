import { COLS, ROWS } from '../../types'
import BingoCell from './BingoCell'
import type { Task } from '../../types'

interface Props {
  tasks: Task[]
  done: Record<string, true | 'pending' | number>
  onOpenTask: (id: string) => void
}

const HEADER_STYLES = [
  'bg-primary-light text-primary-dark',
  'bg-accent-light text-accent-dark',
  'bg-[#ede8f5] text-[#5a4080]',
]



export default function BingoBoard({ tasks, done, onOpenTask }: Props) {
  return (
    <div
      className="grid mb-3.5"
      style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}
    >
      {COLS.map((col, ci) => (
        <div
          key={col}
          className={`text-[11px] font-semibold text-center py-[5px] px-[2px] rounded-[6px] ${HEADER_STYLES[ci]}`}
        >
          {col}
        </div>
      ))}
      {ROWS.map((_, ri) =>
        COLS.map((__, ci) => {
          const task = tasks.find(t => t.row === ri && t.col === ci) ?? null
          return (
            <BingoCell
              key={`${ri}-${ci}`}
              task={task}
              status={task ? done[task.id] : undefined}
              onClick={() => task && onOpenTask(task.id)}
            />
          )
        })
      )}
    </div>
  )
}
