import { useState } from 'react'

export default function UnlockModal({ onUnlock, onClose }) {
  const [key, setKey]       = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit() {
    if (!key.trim()) {
      setError('Please enter your license key.')
      return
    }
    setLoading(true)
    setError('')

    // Small delay so it doesn't feel instant — builds trust
    setTimeout(() => {
      const success = onUnlock(key)
      if (!success) {
        setError('Invalid license key. Please check and try again.')
        setLoading(false)
      }
    }, 600)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') onClose()
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#16213e',
          border: '2px solid var(--gold)',
          borderRadius: 10,
          padding: '2rem',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--crimson)',
            border: '2px solid var(--gold)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 1rem',
          }}>⚔</div>
          <h2 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 8 }}>
            Unlock Full Toolkit
          </h2>
          <p style={{ fontSize: 14, color: 'var(--parch2)', lineHeight: 1.6 }}>
            Enter your license key to unlock the Encounter Calculator
            and all future paid features.
          </p>
        </div>

        {/* What you get */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          borderRadius: 6, padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
        }}>
          {[
            '⚔️  Encounter Calculator — build & balance encounters',
            '🧙  Class Cheat Sheets — level-aware reference',
            '📋  Campaign Manager — full campaign tracking',
            '✦   All future paid features',
          ].map(item => (
            <div key={item} style={{
              fontSize: 13, color: 'var(--parch2)',
              padding: '4px 0', lineHeight: 1.5,
            }}>{item}</div>
          ))}
        </div>

        {/* Key input */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block', fontSize: 11,
            color: 'var(--muted)', fontFamily: 'sans-serif',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            License key
          </label>
          <input
            type="text"
            value={key}
            onChange={e => { setKey(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            placeholder="IDLEMODE-TOOLKIT-XXXX"
            autoFocus
            style={{
              width: '100%',
              background: '#1a1a2e',
              border: `1px solid ${error ? '#f09595' : 'var(--border2)'}`,
              borderRadius: 5,
              color: '#f5f0e1',
              fontFamily: 'Georgia, serif',
              fontSize: 14,
              padding: '10px 12px',
              outline: 'none',
              letterSpacing: '0.05em',
            }}
          />
          {error && (
            <div style={{ fontSize: 12, color: '#f09595', marginTop: 6 }}>
              {error}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              background: loading ? 'rgba(139,0,0,0.5)' : 'var(--crimson)',
              border: '1px solid var(--gold)',
              borderRadius: 6,
              color: 'var(--gold)',
              fontFamily: 'Georgia, serif',
              fontSize: 15,
              fontWeight: 'bold',
              padding: '10px 0',
              cursor: loading ? 'default' : 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            {loading ? 'Checking...' : 'Unlock Toolkit'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid var(--border2)',
              borderRadius: 6,
              color: 'var(--muted)',
              fontFamily: 'Georgia, serif',
              fontSize: 15,
              padding: '10px 16px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>

        {/* Purchase link */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            Don&apos;t have a key?{' '}
          </span>
          <a
            href="https://idlemodeco.gumroad.com/l/toolkit"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: 'var(--gold)' }}
          >
            Get the full toolkit — $19.99
          </a>
        </div>
      </div>
    </div>
  )
}