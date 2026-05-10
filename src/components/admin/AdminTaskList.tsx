import type { Task } from '../../types'

interface Props {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const typePillClass: Record<string, string> = {
  quiz: 'bg-primary-light text-primary-dark',
  multi: 'bg-[#FAF4E1] text-[#6B4E10]',
  admin: 'bg-accent-light text-accent-dark',
}

const typeLabel: Record<string, string> = {
  quiz: 'Quiz',
  multi: 'Fler-felt',
  admin: 'Admin',
}

export default function AdminTaskList({ tasks, onEdit, onDelete }: Props) {
  if (!tasks.length) {
    return <p className="text-[var(--color-muted)] py-4">Ingen oppgaver</p>
  }

  return (
    <div>
      {tasks.map(task => (
        <div
          key={task.id}
          className="border-[0.5px] rounded-[12px] p-[14px] mb-3"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}
        >
          <div className="flex items-start gap-2 mb-2">
            <span
              className={`inline-block text-[10px] px-[7px] py-[2px] rounded-[20px] font-semibold shrink-0 ${typePillClass[task.type]}`}
            >
              {typeLabel[task.type]}
            </span>
            <span className="text-[14px] font-semibold flex-1">{task.title}</span>
            <span className="text-[13px] text-primary font-bold shrink-0">{task.pts}p</span>
          </div>

          <div className="text-[12px] text-[var(--color-muted)] mb-2 space-y-[2px]">
            <div>
              Kode: <strong>{task.code}</strong> · ID: {task.id} · Rad: {task.row + 1} · Kol:{' '}
              {task.col + 1}
            </div>
            <div className="line-clamp-2">{task.question}</div>
            {task.answer && (
              <div>
                Svar: <strong>{task.answer}</strong>
                {task.hint && ` (hint: ${task.hint})`}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="flex-1 bg-primary-light text-primary-dark text-[13px] py-2 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[36px]"
            >
              Rediger
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Slett "${task.title}"?`)) onDelete(task.id)
              }}
              className="flex-1 bg-[#FCEBEB] text-[#791F1F] text-[13px] py-2 rounded-[6px] border-none cursor-pointer font-[inherit] min-h-[36px]"
            >
              Slett
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
