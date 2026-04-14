import { useState } from 'react'

const STORAGE_KEY = 'idlemode_license'

// In production these come from Gumroad
// Add real keys here as they're generated
const VALID_KEYS = [
  'IDLEMODE-TOOLKIT-2024',
  'IDLEMODE-TOOLKIT-2025',
]

export function useLicense() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return VALID_KEYS.includes(stored)
    } catch {
      return false
    }
  })

  function unlock(key) {
    const trimmed = key.trim().toUpperCase()
    if (VALID_KEYS.includes(trimmed)) {
      try {
        localStorage.setItem(STORAGE_KEY, trimmed)
      } catch {
        // localStorage unavailable — still unlock for the session
      }
      setUnlocked(true)
      return true
    }
    return false
  }

  function revoke() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setUnlocked(false)
  }

  return { unlocked, unlock, revoke }
}