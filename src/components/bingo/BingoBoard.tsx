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

const ROW_PTS = [10, 20, 30]

export default function BingoBoard({ tasks, done, onOpenTask }: Props) {
  return (
    <div
      className="grid mb-3.5"
      style={{ gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '4px' }}
    >
      {/* Top-left empty corner */}
      <div />
      {COLS.map((col, ci) => (
        <div
          key={col}
          className={`text-[11px] font-semibold text-center py-[5px] px-[2px] rounded-[6px] ${HEADER_STYLES[ci]}`}
        >
          {col}
        </div>
      ))}
      {ROWS.map((_, ri) => (
        <>
          {/* Left column: point label for this row */}
          <div
            key={`pts-${ri}`}
            className="flex items-center justify-center text-[11px] font-semibold text-muted w-7"
          >
            {ROW_PTS[ri]}p
          </div>
          {COLS.map((__, ci) => {
            const task = tasks.find(t => t.row === ri && t.col === ci) ?? null
            const taskNum = ri * 3 + ci + 1
            return (
              <BingoCell
                key={`${ri}-${ci}`}
                task={task}
                taskNum={taskNum}
                status={task ? done[task.id] : undefined}
                onClick={() => task && onOpenTask(task.id)}
              />
            )
          })}
        </>
      ))}
    </div>
  )
}
