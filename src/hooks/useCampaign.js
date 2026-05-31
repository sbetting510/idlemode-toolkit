import { useState, useCallback } from 'react'

const STORAGE_KEY = 'idlemode_campaign'

const DEFAULT_CAMPAIGN = {
  name: 'My Campaign',
  setting: '',
  createdAt: null,
  characters: [],
  sessions: [],
  encounters: [],
  loot: [],
  npcs: [],
  quests: [],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.warn('localStorage unavailable')
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useCampaign() {
  const [campaign, setCampaign] = useState(() => {
    const stored = load()
    return stored || { ...DEFAULT_CAMPAIGN, createdAt: Date.now() }
  })

  const update = useCallback((updater) => {
    setCampaign(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      save(next)
      return next
    })
  }, [])

  // Campaign meta
  function updateMeta(fields) {
    update(prev => ({ ...prev, ...fields }))
  }

  function resetCampaign() {
    const fresh = { ...DEFAULT_CAMPAIGN, createdAt: Date.now() }
    save(fresh)
    setCampaign(fresh)
  }

  // Generic CRUD factory
  function makeModule(key) {
    return {
      add(item) {
        update(prev => ({
          ...prev,
          [key]: [...prev[key], { ...item, id: uid(), createdAt: Date.now() }],
        }))
      },
      update(id, fields) {
        update(prev => ({
          ...prev,
          [key]: prev[key].map(item => item.id === id ? { ...item, ...fields } : item),
        }))
      },
      remove(id) {
        update(prev => ({
          ...prev,
          [key]: prev[key].filter(item => item.id !== id),
        }))
      },
    }
  }

  function exportCampaign() {
    const filename = `${(campaign.name || 'campaign').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_backup.json`
    const blob = new Blob([JSON.stringify(campaign, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function importCampaign(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          // Basic validation — must have at least characters array
          if (!data || typeof data !== 'object' || !Array.isArray(data.characters)) {
            reject(new Error('Invalid campaign file.'))
            return
          }
          const merged = { ...DEFAULT_CAMPAIGN, ...data }
          save(merged)
          setCampaign(merged)
          resolve(merged)
        } catch {
          reject(new Error('Could not parse file. Make sure it is a valid backup JSON.'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file.'))
      reader.readAsText(file)
    })
  }

  return {
    campaign,
    updateMeta,
    resetCampaign,
    exportCampaign,
    importCampaign,
    characters: makeModule('characters'),
    sessions:   makeModule('sessions'),
    encounters: makeModule('encounters'),
    loot:       makeModule('loot'),
    npcs:       makeModule('npcs'),
    quests:     makeModule('quests'),
  }
}