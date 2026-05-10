import { NavLink } from 'react-router-dom'

interface Props {
  isAdmin: boolean
}

export default function BottomNav({ isAdmin }: Props) {
  const base =
    'flex-1 flex flex-col items-center gap-[3px] pt-3 pb-[10px] text-[10px] min-h-[56px] border-none bg-transparent cursor-pointer font-[inherit] no-underline transition-colors'
  const inactive = 'text-[var(--color-muted)]'
  const active = 'text-primary'

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex z-[100] border-t-[0.5px] border-[var(--color-border)]"
      style={{ background: 'var(--color-card)' }}
    >
      <NavLink
        to="/bingo"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <i className="ti ti-grid-dots text-[22px]" aria-hidden="true" />
        Brett
      </NavLink>
      <NavLink
        to="/leaderboard"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <i className="ti ti-trophy text-[22px]" aria-hidden="true" />
        Poeng
      </NavLink>
      <NavLink
        to="/map"
        className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      >
        <i className="ti ti-map text-[22px]" aria-hidden="true" />
        Kart
      </NavLink>
      {isAdmin && (
        <NavLink
          to="/admin"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <i className="ti ti-settings text-[22px]" aria-hidden="true" />
          Admin
        </NavLink>
      )}
    </nav>
  )
}
