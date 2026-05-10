import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../hooks/useFirebase'
import { useTeam } from '../hooks/useTeam'
import { ICONS } from '../types'

type Tab = 'create' | 'login'

export default function SetupPage() {
  const navigate = useNavigate()
  const { gameState, fbReady, createTeam, loginTeam } = useFirebase()
  const { session, login, loginAdmin } = useTeam()

  const [tab, setTab] = useState<Tab>('create')

  // Create tab state
  const [teamName, setTeamName] = useState('')
  const [selIcon, setSelIcon] = useState<string>(ICONS[0])
  const [pin, setPin] = useState('')
  const [nameError, setNameError] = useState('')
  const [pinError, setPinError] = useState('')
  const [loading, setLoading] = useState(false)
  const [splash, setSplash] = useState<string | null>(null)

  // Login tab state
  const [selTeamKey, setSelTeamKey] = useState('')
  const [loginPin, setLoginPin] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Admin state
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (session) {
      navigate(session.isAdmin ? '/admin' : '/bingo', { replace: true })
    }
  }, [session, navigate])

  const teamList = Object.values(gameState.teams).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const handleCreate = async () => {
    setNameError('')
    setPinError('')
    let valid = true
    if (!teamName.trim()) {
      setNameError('Skriv inn et lagnavn!')
      valid = false
    }
    if (!/^\d{4}$/.test(pin)) {
      setPinError('PIN må være nøyaktig 4 siffer')
      valid = false
    }
    if (!valid) return
    if (!fbReady) {
      setNameError('Kobler til server… prøv igjen om et sekund.')
      return
    }
    setLoading(true)
    try {
      await createTeam(teamName.trim(), selIcon, pin)
      const key = encodeURIComponent(teamName.trim() + selIcon)
      setSplash(selIcon)
      setTimeout(() => login(key, teamName.trim(), selIcon), 2000)
    } catch (err: unknown) {
      setNameError(err instanceof Error ? err.message : 'Noe gikk galt')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoginError('')
    if (!selTeamKey) {
      setLoginError('Velg et lag fra listen')
      return
    }
    if (!fbReady) {
      setLoginError('Kobler til server… prøv igjen om et sekund.')
      return
    }
    const team = gameState.teams[selTeamKey]
    if (!team) {
      setLoginError('Feil lagnavn eller PIN')
      return
    }
    setLoginLoading(true)
    try {
      const found = await loginTeam(team.name, loginPin)
      login(found.key, found.name, found.icon)
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Feil lagnavn eller PIN')
    } finally {
      setLoginLoading(false)
    }
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
  const errorBox = (msg: string) => (
    <div className="bg-[#FCEBEB] text-[#791F1F] p-3 rounded-[8px] text-[14px] mb-3">
      {msg}
    </div>
  )

  return (
    <div
      className="max-w-[430px] mx-auto min-h-screen flex flex-col p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Hero */}
      <div className="text-center py-8 px-4">
        <h1 className="text-[26px] font-bold text-primary-dark m-0">
          Bingojakt
        </h1>
        <div className="text-[15px] mb-3">☀️ 🌸 💍 🌿 🍋 🦋 🌺 🥂 ✨ 🌻</div>
        <div className="text-[16px] text-primary mt-2">Synne &amp; Aksel gifter seg i Italia</div>
      </div>

      {/* Tab toggle */}
      <div
        className="flex rounded-[10px] p-[3px] mb-4"
        style={{ background: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}
      >
        {(['create', 'login'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-[10px] rounded-[8px] text-[14px] font-semibold border-none cursor-pointer font-[inherit] transition-colors"
            style={
              tab === t
                ? { background: 'var(--color-primary)', color: '#fff' }
                : { background: 'transparent', color: 'var(--color-muted)' }
            }
          >
            {t === 'create' ? 'Opprett lag' : 'Logg inn'}
          </button>
        ))}
      </div>

      {/* Create tab */}
      {tab === 'create' && (
        <div
          className="rounded-[16px] p-[20px] mb-4 border-[0.5px]"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-[18px] font-semibold m-0 mb-1">Opprett nytt lag</h2>
          <p className="text-[13px] text-[var(--color-muted)] mt-0 mb-4">
            Velg lagnavn, symbol og en PIN dere husker. 
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
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoComplete="off"
            />
            {nameError && errorBox(nameError)}
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

          <div className="mb-4">
            <label className="text-[13px] text-[var(--color-muted)] mb-[4px] block">
              PIN (4 siffer)
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoComplete="off"
            />
            {pinError && errorBox(pinError)}
          </div>
          <p className="text-[13px] text-[var(--color-muted)] mt-0 mb-4">
            Når laget er opprettet kan flere teammedlemmer logge inn på sin enhet med lagnavn og PIN.  
          </p>

          <div className="text-center text-[13px] text-[var(--color-muted)] mb-3">
            Valgt: {selIcon} {teamName.trim() || '…'}
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-primary text-white border-none p-[14px] rounded-[8px] text-[16px] cursor-pointer min-h-[50px] font-semibold font-[inherit] active:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Oppretter…' : 'Opprett lag 🎯'}
          </button>
        </div>
      )}

      {/* Login tab */}
      {tab === 'login' && (
        <div
          className="rounded-[16px] p-[20px] mb-4 border-[0.5px]"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-[18px] font-semibold m-0 mb-1">Logg inn</h2>
          <p className="text-[13px] text-[var(--color-muted)] mt-0 mb-4">
            Velg laget ditt og skriv inn PIN
          </p>

          <div className="mb-3">
            <label className="text-[13px] text-[var(--color-muted)] mb-[4px] block">
              Velg lag
            </label>
            <select
              className={inputClass}
              style={inputStyle}
              value={selTeamKey}
              onChange={e => setSelTeamKey(e.target.value)}
            >
              <option value="">— Velg lag —</option>
              {teamList.map(t => (
                <option key={t.key} value={t.key}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-[13px] text-[var(--color-muted)] mb-[4px] block">
              PIN (4 siffer)
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={loginPin}
              onChange={e => setLoginPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="off"
            />
          </div>

          {loginError && errorBox(loginError)}

          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full bg-primary text-white border-none p-[14px] rounded-[8px] text-[16px] cursor-pointer min-h-[50px] font-semibold font-[inherit] active:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loginLoading ? 'Logger inn…' : 'Logg inn'}
          </button>

          {!fbReady && (
            <p className="text-center text-[12px] text-[var(--color-muted)] mt-3">
              Kobler til server…
            </p>
          )}
          {fbReady && teamList.length === 0 && (
            <p className="text-center text-[12px] text-[var(--color-muted)] mt-3">
              Ingen lag registrert ennå — opprett et lag først.
            </p>
          )}
        </div>
      )}

      {splash && (
        <div className="splash-overlay">
          <span style={{ fontSize: 80 }}>{splash}</span>
          <p className="text-[20px] font-semibold m-0">Laget er klart! Lykke til 🚀</p>
        </div>
      )}

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
