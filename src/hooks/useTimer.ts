import { useState, useEffect } from 'react'
import type { GameState } from '../types'

export function useTimer(timer: GameState['timer']) {
  const [display, setDisplay] = useState('')
  const [warn, setWarn] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!timer.running || !timer.endsAt) {
      setVisible(false)
      return
    }

    const tick = () => {
      const left = Math.max(0, timer.endsAt! - Date.now())
      const mins = Math.floor(left / 60000)
      const secs = Math.floor((left % 60000) / 1000)
      setDisplay(
        left === 0
          ? 'Tid er ute! ⏰'
          : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      )
      setWarn(mins < 10)
      setVisible(true)
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timer.running, timer.endsAt])

  return { display, warn, visible }
}
