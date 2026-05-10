import { useEffect } from 'react'
import type { GameConfig } from '../types'

interface Props {
  config: GameConfig
  onClose: () => void
}

export default function HelpModal({ config, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="rounded-[20px_20px_0_0] p-5 w-full max-w-[430px] max-h-[88vh] overflow-y-auto"
        style={{ background: 'var(--color-card)' }}
      >
        <div className="w-9 h-1 rounded-sm mx-auto mb-[18px]" style={{ background: 'var(--color-border)' }} />

        <h3 className="text-[16px] font-semibold mb-4">Spilleregler</h3>

        <p className="text-[15px] text-[var(--color-muted)] leading-[1.8] whitespace-pre-wrap mb-4">
          {config.rules}
        </p>

        {config.phone && (
          <a
            href={`tel:${config.phone}`}
            className="flex items-center gap-3 bg-primary-light rounded-[10px] p-4 mb-4 no-underline"
          >
            <i className="ti ti-phone text-[22px] text-primary" aria-hidden="true" />
            <div>
              <div className="text-[13px] text-primary font-semibold">Lurer du på noe?</div>
              <div className="text-[15px] text-primary-dark font-bold">{config.phone}</div>
            </div>
          </a>
        )}

        <button
          onClick={onClose}
          className="w-full p-[13px] border-[0.5px] bg-transparent rounded-[8px] cursor-pointer text-[15px] font-[inherit] text-[var(--color-muted)]"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Lukk
        </button>
      </div>
    </div>
  )
}
