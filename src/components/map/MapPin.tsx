interface Props {
  id: string
  x: number
  y: number
  status: true | 'pending' | undefined
  onClick: () => void
}

export default function MapPin({ id, x, y, status, onClick }: Props) {
  const colorClass =
    status === true
      ? 'bg-primary text-white border-white'
      : status === 'pending'
        ? 'bg-accent text-white border-white'
        : 'bg-white text-primary border-primary'

  return (
    <div
      className={`absolute w-[30px] h-[30px] rounded-full flex items-center justify-center text-[9px] font-semibold cursor-pointer border-2 -translate-x-1/2 -translate-y-1/2 z-[2] shadow-[0_2px_6px_rgba(0,0,0,0.3)] ${colorClass}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
    >
      {id}
    </div>
  )
}
