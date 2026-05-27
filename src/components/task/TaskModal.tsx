import { useEffect } from 'react'
import type { Task } from '../../types'
import { isCorrect, norm } from '../../lib/gameLogic'
import TaskForm from './TaskForm'

interface Props {
  task: Task | null
  doneStatus: true | 'pending' | number | undefined
  submittedAnswers?: string[]
  onClose: () => void
  onMarkDone: (pts?: number, answers?: string[]) => void
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

function ReviewAnswers({ task, answers }: { task: Task; answers: string[] }) {
  if (task.type === 'quiz') {
    const correct = isCorrect(task.answer, answers[0])
    return (
      <div className="mt-3 flex items-center gap-3 p-3 rounded-[8px] border-[0.5px]"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-[var(--color-muted)] mb-[2px]">Ditt svar</div>
          <div className="text-[15px]">{answers[0] || '—'}</div>
          {!correct && task.answer && (
            <div className="text-[12px] text-primary mt-1">Fasit: {task.answer}</div>
          )}
        </div>
        <span className={`text-[12px] font-semibold px-2 py-[3px] rounded-full shrink-0 ${correct ? 'bg-primary-light text-primary-dark' : 'bg-[#FCEBEB] text-[#791F1F]'}`}>
          {correct ? 'Riktig' : 'Feil'}
        </span>
      </div>
    )
  }

  if (task.type === 'multi') {
    const fields = task.fields ?? []
    return (
      <div className="mt-3 space-y-2">
        {fields.map((f, i) => {
          const hasCorrect = f.answer !== null && f.answer !== ''
          const correct = hasCorrect && norm(answers[i] ?? '') === norm(f.answer ?? '')

          return (
            <div key={i}
              className="flex items-center gap-3 p-3 rounded-[8px] border-[0.5px]"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-[var(--color-muted)] mb-[2px]">{f.label}</div>
                <div className="text-[14px]">{answers[i] || '—'}</div>
                {hasCorrect && !correct && (
                  <div className="text-[12px] text-primary mt-1">Fasit: {f.answer}</div>
                )}
              </div>
              {hasCorrect && (
                <span className={`text-[12px] font-semibold px-2 py-[3px] rounded-full shrink-0 ${correct ? 'bg-primary-light text-primary-dark' : 'bg-[#FCEBEB] text-[#791F1F]'}`}>
                  {correct ? 'Riktig' : 'Feil'}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

export default function TaskModal({ task, doneStatus, submittedAnswers, onClose, onMarkDone, onMarkPending }: Props) {
  useEffect(() => {
    if (!task) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [task, onClose])

  if (!task) return null

  const isDone = doneStatus === true || typeof doneStatus === 'number'
  const earnedPts = doneStatus === true ? task.pts : typeof doneStatus === 'number' ? doneStatus : null

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

        <div className="flex items-center mb-[14px]">
          <span className="text-[12px] text-[var(--color-muted)]">
            {task.pts}p
          </span>
        </div>

        <h3 className="text-[16px] font-semibold mb-2">{task.title}</h3>
        <p className="text-[15px] text-[var(--color-muted)] mb-4 leading-[1.6]">{task.question}</p>

        {isDone ? (
          <>
            <div className="p-[14px] rounded-[8px] text-[15px] font-medium text-center bg-primary-light text-primary-dark">
              Fullført! +{earnedPts}p
            </div>
            {submittedAnswers && (task.type === 'quiz' || task.type === 'multi') && (
              <ReviewAnswers task={task} answers={submittedAnswers} />
            )}
          </>
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
