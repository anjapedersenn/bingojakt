import { useState, useCallback } from 'react'
import type { SessionState } from '../types'

const SESSION_KEY = 'jakten_session'

function loadSession(): SessionState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionState) : null
  } catch {
    return null
  }
}

function saveSession(s: SessionState) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function useTeam() {
  const [session, setSession] = useState<SessionState | null>(loadSession)

  const login = useCallback((teamKey: string, teamName: string, teamIcon: string) => {
    const s: SessionState = {
      teamKey,
      teamName,
      teamIcon,
      isAdmin: false,
    }
    saveSession(s)
    setSession(s)
  }, [])

  const loginAdmin = useCallback(() => {
    const s: SessionState = {
      teamKey: '__admin__',
      teamName: '__admin__',
      teamIcon: '',
      isAdmin: true,
    }
    saveSession(s)
    setSession(s)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setSession(null)
  }, [])

  return { session, login, loginAdmin, logout }
}
