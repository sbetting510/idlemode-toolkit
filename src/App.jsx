import { useState } from 'react'
import './styles/globals.css'
import Conditions  from './components/tabs/Conditions'
import Actions     from './components/tabs/Actions'
import CombatRules from './components/tabs/CombatRules'
import SavesDCs    from './components/tabs/SavesDCs'
import Spells      from './components/tabs/Spells'
import Monsters    from './components/tabs/Monsters'
import EncounterCalc from './components/tabs/EncounterCalc'

const TABS = [
  { id: 'conditions',  label: 'Conditions',     paid: false },
  { id: 'actions',     label: 'Actions',         paid: false },
  { id: 'combat',      label: 'Combat Rules',    paid: false },
  { id: 'saves',       label: 'Saves & DCs',     paid: false },
  { id: 'spells',      label: 'Spells',          paid: false },
  { id: 'monsters',    label: 'Monsters',        paid: false },
  { id: 'encounter',   label: 'Encounter Calc',  paid: true  },
]

export default function App() {
  const [currentTab, setCurrentTab] = useState('conditions')
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [encounter, setEncounter] = useState([])
  const [partySize, setPartySize] = useState(4)
  const [partyLevel, setPartyLevel] = useState(5)

  const activeTab = TABS.find(t => t.id === currentTab)

  function addToEncounter(name, cr) {
    setEncounter(prev => {
      const existing = prev.find(e => e.name === name)
      if (existing) return prev.map(e => e.name === name ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { name, cr, qty: 1 }]
    })
    setCurrentTab('encounter')
  }

  function changeQty(name, cr, delta, forceAdd = false) {
    setEncounter(prev => {
      const existing = prev.find(e => e.name === name)
      if (forceAdd && !existing) return [...prev, { name, cr, qty: 1 }]
      if (!existing) return prev
      const newQty = existing.qty + delta
      if (newQty <= 0) return prev.filter(e => e.name !== name)
      return prev.map(e => e.name === name ? { ...e, qty: newQty } : e)
    })
  }
  
  function removeMonster(name) {
    setEncounter(prev => prev.filter(e => e.name !== name))
  }

  function goTab(id) {
    setCurrentTab(id)
    setMenuOpen(false)
    setSearchTerm('')
    document.getElementById('search-input')?.focus()
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: '2rem' }}>

      {/* ── Header ── */}
      <header style={{
        background: 'var(--stone2)',
        borderBottom: '2px solid var(--gold)',
        padding: '1rem 1.25rem 0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--crimson)',
            border: '1.5px solid var(--gold)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>⚔</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.04em' }}>
              D&D Toolkit
              <span style={{
                background: 'rgba(30,100,30,0.3)', color: '#90c870',
                border: '1px solid rgba(30,100,30,0.5)', borderRadius: 3,
                fontSize: 10, fontFamily: 'sans-serif', padding: '1px 6px',
                fontWeight: 'bold', marginLeft: 6, verticalAlign: 'middle',
              }}>FREE</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--parch2)', opacity: 0.7, fontStyle: 'italic' }}>
              Complete Reference — 5th Edition SRD
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--border2)',
          borderRadius: 6, padding: '0 12px', height: 40,
        }}>
          <span style={{ color: 'var(--gold)', fontSize: 14, flexShrink: 0 }}>⚲</span>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search anything..."
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--parch)', fontSize: 14, width: '100%',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'none', border: 'none', color: 'var(--muted)',
                cursor: 'pointer', fontSize: 16, padding: '0 4px',
              }}
            >×</button>
          )}
        </div>
      </header>

      {/* ── Desktop nav ── */}
      <nav style={{
        display: 'flex', gap: 2,
        padding: '0.6rem 1.25rem 0',
        borderBottom: '1px solid var(--border)',
        background: 'var(--stone2)',
        overflowX: 'auto',
      }} className="nav-desktop">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => goTab(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 11px 10px',
              fontSize: 12, fontFamily: 'Georgia, serif',
              color: currentTab === tab.id ? 'var(--gold)' : 'var(--parch2)',
              opacity: currentTab === tab.id ? 1 : 0.6,
              borderBottom: currentTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
            {tab.paid && (
              <span style={{
                background: 'rgba(180,120,0,0.3)', color: '#f5c842',
                border: '1px solid rgba(180,120,0,0.5)',
                borderRadius: 3, fontSize: 9, fontFamily: 'sans-serif',
                padding: '1px 5px', marginLeft: 4, verticalAlign: 'middle',
              }}>Paid</span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Mobile nav ── */}
      <div style={{
        background: 'var(--stone2)',
        borderBottom: '1px solid var(--border)',
        padding: '0.5rem 1rem',
        position: 'relative',
      }} className="nav-mobile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'var(--gold)', fontWeight: 'bold' }}>
            {activeTab.label}
            {activeTab.paid && (
              <span style={{
                background: 'rgba(180,120,0,0.3)', color: '#f5c842',
                border: '1px solid rgba(180,120,0,0.5)',
                borderRadius: 3, fontSize: 9, fontFamily: 'sans-serif',
                padding: '1px 5px', marginLeft: 4, verticalAlign: 'middle',
              }}>Paid</span>
            )}
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
            style={{
              background: 'none', border: '1px solid var(--border2)',
              borderRadius: 5, cursor: 'pointer', padding: '7px 9px',
              display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 18, height: 2,
                background: 'var(--gold)', borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(6px) rotate(45deg)'
                  : i === 2 ? 'translateY(-6px) rotate(-45deg)'
                  : 'none'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Dropdown */}
        {menuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--stone2)', border: '1px solid var(--border2)',
            borderTop: 'none', zIndex: 200,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {TABS.map(tab => (
              <div
                key={tab.id}
                onClick={() => goTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 1.25rem',
                  fontSize: 14, fontFamily: 'Georgia, serif',
                  color: currentTab === tab.id ? 'var(--gold)' : 'var(--parch2)',
                  background: currentTab === tab.id ? 'rgba(201,168,76,0.06)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {currentTab === tab.id && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                  )}
                  {currentTab !== tab.id && (
                    <span style={{ width: 6, height: 6, display: 'inline-block' }} />
                  )}
                  {tab.label}
                </span>
                {tab.paid && (
                  <span style={{
                    background: 'rgba(180,120,0,0.3)', color: '#f5c842',
                    border: '1px solid rgba(180,120,0,0.5)',
                    borderRadius: 3, fontSize: 9, fontFamily: 'sans-serif',
                    padding: '1px 5px',
                  }}>Paid</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tab content ── */}
      <main style={{ padding: '1rem 1.25rem' }}>
        {currentTab === 'conditions' && <Conditions  searchTerm={searchTerm} />}
        {currentTab === 'actions'    && <Actions     searchTerm={searchTerm} />}
        {currentTab === 'combat'     && <CombatRules searchTerm={searchTerm} />}
        {currentTab === 'saves'      && <SavesDCs    searchTerm={searchTerm} />}
        {currentTab === 'spells'     && <Spells      searchTerm={searchTerm} />}
        {currentTab === 'monsters'   && (
          <Monsters    
            searchTerm={searchTerm} 
            onAddToEncounter={addToEncounter} 
          />
        )}
        {currentTab === 'encounter'  && (
          <EncounterCalc 
            encounter={encounter} 
            partySize={partySize} 
            partyLevel={partyLevel} 
            onPartySize={setPartySize} 
            onPartyLevel={setPartyLevel} 
            onChangeQty={changeQty} 
            onRemove={removeMonster} 
            onClear={() => setEncounter([])}
          />
        )}
      </main>

    </div>
  )
}