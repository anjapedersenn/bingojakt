import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../hooks/useFirebase'
import { useTeam } from '../hooks/useTeam'
import { ICONS } from '../types'

export default function SetupPage() {
  const navigate = useNavigate()
  const { gameState, fbReady, writeTeam } = useFirebase()
  const { login, loginAdmin } = useTeam()

  const [teamName, setTeamName] = useState('')
  const [selIcon, setSelIcon] = useState<string>(ICONS[0])
  const [nameError, setNameError] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = () => {
    setNameError('')
    if (!teamName.trim()) {
      setNameError('Skriv inn et lagnavn!')
      return
    }
    if (!fbReady) {
      setNameError('Kobler til server… prøv igjen om et sekund.')
      return
    }
    const taken = Object.values(gameState.teams).some(
      t =>
        t.name.toLowerCase() === teamName.trim().toLowerCase() &&
        t.icon === selIcon
    )
    if (taken) {
      setNameError(`${selIcon} "${teamName.trim()}" er allerede tatt — velg annet navn eller symbol!`)
      return
    }
    const key = teamName.trim() + selIcon
    writeTeam(key, {
      key,
      name: teamName.trim(),
      icon: selIcon,
      done: {},
      adminPts: 0,
    })
    login(teamName.trim(), selIcon)
    navigate('/bingo')
  }

  const handleAdmin = () => {
    if (password !== import.meta.env.VITE_ADMIN_PW) {
      alert('Feil passord!')
      return
    }
    loginAdmin()
    navigate('/admin')
  }

  const inputClass =
    'w-full p-3 border-[0.5px] rounded-[8px] text-[16px] font-[inherit]'
  const inputStyle = {
    borderColor: 'var(--color-border)',
    background: 'var(--color-card)',
    color: 'inherit',
  }

  return (
    <div
      className="max-w-[430px] mx-auto min-h-screen flex flex-col p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Hero */}
      <div className="text-center py-8 px-4">
        <div className="text-[40px] mb-3">🇮🇹💍🥂</div>
        <h1 className="text-[26px] font-bold text-primary-dark m-0">
          Jakten på kjærligheten
        </h1>
        <div className="text-[16px] text-primary mt-2">Synne &amp; Aksel · Italia 2025</div>
        <div className="text-[14px] text-[var(--color-muted)] mt-2">
          Et bryllupsspill for spesielle gjester 🎉
        </div>
      </div>

      {/* Registrering */}
      <div
        className="rounded-[16px] p-[20px] mb-4 border-[0.5px]"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-[18px] font-semibold m-0 mb-1">Registrer lag</h2>
        <p className="text-[13px] text-[var(--color-muted)] mt-0 mb-4">
          Velg et lagnavn og et symbol
        </p>

        <div className="mb-3">
          <label className="text-[13px] text-[var(--color-muted)] mb-[4px] block">
            Lagnavn
          </label>
          <input
            className={inputClass}
            style={inputStyle}
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="Hva heter laget?"
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label className="text-[13px] text-[var(--color-muted)] mb-[8px] block">
            Lagsymbol
          </label>
          <div className="grid gap-[6px]" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {ICONS.map(icon => (
              <button
                key={icon}
                onClick={() => setSelIcon(icon)}
                className={`text-[22px] p-[6px] rounded-[8px] border-[2px] cursor-pointer bg-transparent font-[inherit] min-h-[44px] transition-colors ${
                  selIcon === icon
                    ? 'border-primary bg-primary-light'
                    : 'border-transparent'
                }`}
                style={selIcon !== icon ? { borderColor: 'var(--color-border)' } : undefined}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {nameError && (
          <div className="bg-[#FCEBEB] text-[#791F1F] p-3 rounded-[8px] text-[14px] mb-3">
            {nameError}
          </div>
        )}

        <div className="text-center text-[13px] text-[var(--color-muted)] mb-3">
          Valgt: {selIcon} {teamName.trim() || '…'}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-primary text-white border-none p-[14px] rounded-[8px] text-[16px] cursor-pointer min-h-[50px] font-semibold font-[inherit] active:bg-primary-dark transition-colors"
        >
          Start jakten! 🎯
        </button>
      </div>

      {/* Admin */}
      <div
        className="rounded-[16px] p-[20px] border-[0.5px]"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-[16px] font-semibold m-0 mb-3 text-[var(--color-muted)]">
          Admin-innlogging
        </h2>
        <div className="flex gap-2">
          <input
            type="password"
            className={`${inputClass} flex-1`}
            style={inputStyle}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Passord"
            onKeyDown={e => e.key === 'Enter' && handleAdmin()}
          />
          <button
            onClick={handleAdmin}
            className="bg-primary-light text-primary-dark border-none px-4 py-3 rounded-[8px] text-[14px] cursor-pointer font-[inherit] min-h-[50px] whitespace-nowrap"
          >
            Logg inn
          </button>
        </div>
      </div>
    </div>
  )
}
