import type { Task } from '../../types'
import { MAP_POS } from '../../types'
import MapPin from './MapPin'

interface Props {
  tasks: Task[]
  done: Record<string, true | 'pending'>
  onOpenTask: (id: string) => void
}

export default function MapView({ tasks, done, onOpenTask }: Props) {
  return (
    <div>
      <div
        className="relative rounded-[16px] overflow-hidden border-[0.5px] mb-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <img
          src="/map.png"
          alt="Kart over vingården"
          className="w-full block h-[280px] object-cover"
        />
        <div className="absolute inset-0">
          {tasks.map(task => {
            const pos = MAP_POS[task.id]
            if (!pos) return null
            const taskNum = task.row * 3 + task.col + 1
            return (
              <MapPin
                key={task.id}
                taskNum={taskNum}
                col={task.col}
                x={pos.x}
                y={pos.y}
                status={done[task.id] as true | 'pending' | undefined}
                onClick={() => onOpenTask(task.id)}
              />
            )
          })}
        </div>
      </div>

      <div className="flex gap-[14px] text-[12px] text-muted flex-wrap mb-3.5">
        <span>
          <span className="inline-block w-[10px] h-[10px] rounded-full bg-primary mr-1 align-middle" />
          Fullført
        </span>
        <span>
          <span className="inline-block w-[10px] h-[10px] rounded-full bg-accent mr-1 align-middle" />
          Venter poeng
        </span>
        <span>
          <span
            className="inline-block w-[10px] h-[10px] rounded-full border-[1.5px] border-primary mr-1 align-middle"
            style={{ background: 'var(--color-card)' }}
          />
          Ikke startet
        </span>
      </div>

      {([10, 20, 30] as const).map(pts => {
        const group = tasks.filter(t => t.pts === pts)
        if (!group.length) return null
        return (
          <div key={pts} className="mb-4">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1 pt-1">
              {pts} poeng
            </div>
            {group.map(task => {
              const d = done[task.id]
              const taskNum = task.row * 3 + task.col + 1
              const isDone = d === true || typeof d === 'number'
              const iconClass = isDone ? 'ti-check' : d === 'pending' ? 'ti-clock' : 'ti-circle'
              const statusColor = isDone
                ? 'var(--color-primary)'
                : d === 'pending'
                  ? 'var(--color-accent)'
                  : 'var(--color-muted)'
              const catColor = ['var(--color-primary-dark)', 'var(--color-accent-dark)', '#5a4080'][task.col]
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 py-3 border-b-[0.5px] cursor-pointer"
                  style={{ borderColor: 'var(--color-border)' }}
                  onClick={() => onOpenTask(task.id)}
                >
                  <i
                    className={`ti ${iconClass} text-[18px] min-w-4.5`}
                    style={{ color: statusColor }}
                    aria-hidden="true"
                  />
                  <div className="text-[13px] font-bold shrink-0 w-5" style={{ color: catColor }}>{taskNum}</div>
                  <div className="flex-1 text-[14px] font-medium" style={{ color: catColor }}>{task.title}</div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
