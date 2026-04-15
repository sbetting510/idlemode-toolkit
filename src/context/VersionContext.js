import { createContext, useContext, useState, useCallback } from 'react'

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'idlemode_versions'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable — silent fail
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const VersionContext = createContext(null)

export function VersionProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = loadState()
    return {
      globalVersion: saved?.globalVersion ?? '2014',
      tabVersions:   saved?.tabVersions   ?? {},
    }
  })

  // Returns the effective version for a given tab ID
  const getTabVersion = useCallback(
    (tabId) => state.tabVersions[tabId] ?? state.globalVersion,
    [state]
  )

  // Sets global version and clears all per-tab overrides
  const setGlobalVersion = useCallback((v) => {
    setState(prev => {
      const next = { globalVersion: v, tabVersions: {} }
      saveState(next)
      return next
    })
  }, [])

  // Sets a per-tab version override without touching global or other tabs
  const setTabVersion = useCallback((tabId, v) => {
    setState(prev => {
      const next = {
        ...prev,
        tabVersions: { ...prev.tabVersions, [tabId]: v },
      }
      saveState(next)
      return next
    })
  }, [])

  return (
    <VersionContext.Provider value={{
      globalVersion: state.globalVersion,
      tabVersions:   state.tabVersions,
      getTabVersion,
      setGlobalVersion,
      setTabVersion,
    }}>
      {children}
    </VersionContext.Provider>
  )
}

export function useVersion() {
  const ctx = useContext(VersionContext)
  if (!ctx) throw new Error('useVersion must be used inside <VersionProvider>')
  return ctx
}
