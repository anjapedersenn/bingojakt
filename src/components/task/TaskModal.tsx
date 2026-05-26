import { useEffect } from 'react'
import type { Task } from '../../types'
import TaskForm from './TaskForm'

interface Props {
  task: Task | null
  doneStatus: true | 'pending' | number | undefined
  onClose: () => void
  onMarkDone: (pts?: number) => void
  onMarkPending: () => void
}

const typePillClass: Record<string, string> = {
  quiz: 'bg-primary-light text-primary-dark',
  multi: 'bg-[#FAF4E1] text-[#6B4E10]',
  admin: 'bg-accent-light text-accent-dark',
}

const typeLabel: Record<string, string> = {
  quiz: 'Quiz',
  multi: 'Fler-felt',
  admin: 'Admin bedømmer',
}

export default function TaskModal({ task, doneStatus, onClose, onMarkDone, onMarkPending }: Props) {
  useEffect(() => {
    if (!task) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [task, onClose])

  if (!task) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="rounded-[20px_20px_0_0] p-5 w-full max-w-[430px] max-h-[88vh] overflow-y-auto"
        style={{ background: 'var(--color-card)' }}
      >
        <div
          className="w-9 h-1 rounded-sm mx-auto mb-[18px]"
          style={{ background: 'var(--color-border)' }}
        />

        <div className="flex items-center gap-2 mb-[14px]">
          <span
            className={`inline-block text-[11px] px-[9px] py-[3px] rounded-[20px] font-semibold ${typePillClass[task.type]}`}
          >
            {typeLabel[task.type]}
          </span>
          <span className="text-[12px] text-[var(--color-muted)] ml-auto">
            {task.pts}p · #{task.id}
          </span>
        </div>

        <h3 className="text-[16px] font-semibold mb-2">{task.title}</h3>
        <p className="text-[15px] text-[var(--color-muted)] mb-4 leading-[1.6]">{task.question}</p>

        {doneStatus === true ? (
          <div className="p-[14px] rounded-[8px] mt-[10px] text-[15px] font-medium text-center bg-primary-light text-primary-dark">
            Fullført! +{task.pts}p
          </div>
        ) : typeof doneStatus === 'number' ? (
          <div className="p-[14px] rounded-[8px] mt-[10px] text-[15px] font-medium text-center bg-primary-light text-primary-dark">
            Delvis fullført! +{doneStatus}p
          </div>
        ) : doneStatus === 'pending' ? (
          <div className="p-[14px] rounded-[8px] mt-[10px] text-[15px] font-medium text-center bg-accent-light text-accent-dark">
            Innlevert — venter på admin
          </div>
        ) : (
          <TaskForm task={task} onMarkDone={onMarkDone} onMarkPending={onMarkPending} />
        )}

        <button
          onClick={onClose}
          className="w-full mt-[10px] p-[13px] border-[0.5px] bg-transparent rounded-[8px] cursor-pointer text-[15px] font-[inherit] text-[var(--color-muted)]"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Lukk
        </button>
      </div>
    </div>
  )
}
