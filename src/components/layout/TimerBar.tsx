import { useTimer } from '../../hooks/useTimer'
import type { GameState } from '../../types'

interface Props {
  timer: GameState['timer']
}

export default function TimerBar({ timer }: Props) {
  const { display, warn, visible } = useTimer(timer)
  if (!visible) return null
  return (
    <div
      className={`sticky top-0 z-50 text-center py-[10px] text-[15px] font-semibold tracking-widest text-white rounded-b-[8px] ${warn ? 'bg-accent' : 'bg-primary-dark'}`}
    >
      {display}
    </div>
  )
}
