import { useState } from 'react'
import type { Task } from '../../types'
import { isCorrect, norm } from '../../lib/gameLogic'

interface Props {
  task: Task
  onMarkDone: () => void
  onMarkPending: () => void
}

type FeedbackState = { type: 'ok' | 'err' | 'wait'; message: string } | null

const feedbackClasses = {
  ok: 'bg-primary-light text-primary-dark',
  err: 'bg-[#FCEBEB] text-[#791F1F]',
  wait: 'bg-accent-light text-accent-dark',
}

export default function TaskForm({ task, onMarkDone, onMarkPending }: Props) {
  const [answers, setAnswers] = useState<string[]>(
    task.type === 'multi' ? (task.fields ?? []).map(() => '') : ['']
  )
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  const handleSubmit = () => {
    if (task.type === 'quiz') {
      if (isCorrect(task.answer, answers[0])) {
        setFeedback({ type: 'ok', message: `Riktig! +${task.pts}p` })
        setTimeout(onMarkDone, 1300)
      } else {
        setFeedback({ type: 'err', message: 'Feil svar — prøv igjen!' })
      }
    } else if (task.type === 'multi') {
      const fields = task.fields ?? []
      const hasDefinedAnswers = fields.some(f => f.answer !== null && f.answer !== '')
      if (!hasDefinedAnswers) {
        onMarkPending()
        setFeedback({ type: 'wait', message: 'Sendt! Venter på godkjenning.' })
        return
      }
      const allOk = fields.every(
        (f, i) => !f.answer || norm(answers[i]) === norm(f.answer ?? '')
      )
      if (allOk) {
        setFeedback({ type: 'ok', message: `Riktig! +${task.pts}p` })
        setTimeout(onMarkDone, 1300)
      } else {
        setFeedback({ type: 'err', message: 'Ett eller flere svar er feil!' })
      }
    } else {
      onMarkPending()
      setFeedback({ type: 'wait', message: 'Sendt! Venter på godkjenning.' })
    }
  }

  return (
    <div>
      {task.type === 'quiz' && (
            <div className="mb-3">
              <div className="text-[13px] text-[var(--color-muted)] mb-[2px]">
                Svar{task.hint ? ` — hint: ${task.hint}` : ''}
              </div>
              <input
                type="text"
                value={answers[0]}
                onChange={e => setAnswers([e.target.value])}
                placeholder="Skriv svar her"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className="w-full p-3 border-[0.5px] rounded-[8px] text-[16px] mt-1"
                style={{
                  borderColor: 'var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'inherit',
                }}
              />
            </div>
          )}

          {task.type === 'multi' && (
            <div>
              {(task.fields ?? []).map((f, i) => (
                <div key={i} className="mb-3">
                  <div className="text-[13px] text-[var(--color-muted)] mb-[2px]">{f.label}</div>
                  <input
                    type="text"
                    value={answers[i]}
                    onChange={e => {
                      const next = [...answers]
                      next[i] = e.target.value
                      setAnswers(next)
                    }}
                    placeholder="Svar"
                    autoComplete="off"
                    className="w-full p-3 border-[0.5px] rounded-[8px] text-[16px] mt-1"
                    style={{
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-card)',
                      color: 'inherit',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {task.type === 'admin' && (
            <div className="bg-accent-light p-3 rounded-[8px] text-[14px] text-accent-dark leading-[1.5] mt-2 mb-3">
              Marker oppgaven som fulført så tildeler admin poeng manuelt. 
            </div>
          )}

          {feedback && (
            <div
              className={`p-[14px] rounded-[8px] mt-[10px] text-[15px] font-medium text-center ${feedbackClasses[feedback.type]}`}
            >
              {feedback.message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white border-none p-[14px] rounded-[8px] text-[16px] cursor-pointer mt-2 min-h-[50px] font-medium font-[inherit] active:bg-primary-dark active:scale-[0.98] transition-transform"
          >
            Marker som fullført
          </button>
    </div>
  )
}
