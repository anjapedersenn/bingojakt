const CAT_COLORS: Record<0 | 1 | 2, string> = {
  0: 'var(--color-primary-dark)',
  1: 'var(--color-accent-dark)',
  2: '#5a4080',
}

interface Props {
  taskNum: number
  col: 0 | 1 | 2
  x: number
  y: number
  status: true | 'pending' | undefined
  onClick: () => void
}

export default function MapPin({ taskNum, col, x, y, status, onClick }: Props) {
  const catColor = CAT_COLORS[col]
  const isDone = status === true || typeof status === 'number'
  const bg =
    isDone
      ? 'var(--color-primary)'
      : status === 'pending'
        ? 'var(--color-accent)'
        : 'white'
  const color = status !== undefined ? 'white' : catColor

  return (
    <div
      className="absolute w-7.5 h-7.5 rounded-full flex items-center justify-center text-[9px] font-semibold cursor-pointer -translate-x-1/2 -translate-y-1/2 z-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
      style={{ left: `${x}%`, top: `${y}%`, background: bg, color, border: `2.5px solid ${catColor}` }}
      onClick={onClick}
    >
      {taskNum}
    </div>
  )
}
