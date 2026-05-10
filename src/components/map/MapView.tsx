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
            return (
              <MapPin
                key={task.id}
                id={task.id}
                x={pos.x}
                y={pos.y}
                status={done[task.id] as true | 'pending' | undefined}
                onClick={() => onOpenTask(task.id)}
              />
            )
          })}
        </div>
      </div>

      <div className="flex gap-[14px] text-[12px] text-[var(--color-muted)] flex-wrap mb-[14px]">
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

    {/* const HEADER_STYLES = [
      'bg-primary-light text-primary-dark',
      'bg-accent-light text-accent-dark',
      'bg-[#ede8f5] text-[#5a4080]',
      ] */}

      {tasks.map(task => {
        const d = done[task.id]
        const iconClass = d === true ? 'ti-check' : d === 'pending' ? 'ti-clock' : 'ti-circle'
        const colorStyle =
          d === true
            ? 'var(--color-primary)'
            : d === 'pending'
              ? 'var(--color-accent)'
              : 'var(--color-muted)'
        return (
          <div
            key={task.id}
            className="flex items-center gap-3 py-3 border-b-[0.5px] cursor-pointer"
            style={{ borderColor: 'var(--color-border)' }}
            onClick={() => onOpenTask(task.id)}
          >
            <i
              className={`ti ${iconClass} text-[18px] min-w-[18px]`}
              style={{ color: colorStyle }}
              aria-hidden="true"
            />
            <div className="flex-1 text-[14px]">{task.title}</div>
            <div className="text-[13px] text-primary font-semibold">{task.pts}p</div>
            <div className="text-[11px] text-[var(--color-muted)]">#{task.id}</div>
          </div>
        )
      })}
    </div>
  )
}
