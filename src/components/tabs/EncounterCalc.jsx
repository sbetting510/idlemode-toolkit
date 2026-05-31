import { useState, useEffect, useRef } from 'react'
import { MONSTERS, CR_XP, XP_THRESHOLDS } from '../../data/monsters'
import { useCampaign } from '../../hooks/useCampaign'

// ── Utility ───────────────────────────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
function d20() { return Math.floor(Math.random() * 20) + 1 }

const COMBAT_STORAGE_KEY = 'idlemode_combat'

function saveCombatState(state) {
  try { localStorage.setItem(COMBAT_STORAGE_KEY, JSON.stringify(state)) } catch {}
}
function loadCombatState() {
  try { const raw = localStorage.getItem(COMBAT_STORAGE_KEY); return raw ? JSON.parse(raw) : null } catch { return null }
}
function clearCombatState() {
  try { localStorage.removeItem(COMBAT_STORAGE_KEY) } catch {}
}

// ── Compact Dice Roller (used inside tracker) ─────────────────────────────────
function CombatDiceRoller() {
  const DICE = [4, 6, 8, 10, 12, 20, 100]
  const [modifier, setModifier] = useState(0)
  const [rolls, setRolls]       = useState([])
  const [diceCount, setDiceCount] = useState(1)

  function roll(sides) {
    const results = Array.from({ length: diceCount }, () => Math.floor(Math.random() * sides) + 1)
    const total   = results.reduce((s, r) => s + r, 0) + (parseInt(modifier) || 0)
    const label   = `${diceCount > 1 ? diceCount : ''}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`
    setRolls(prev => [{ label, results, modifier: parseInt(modifier) || 0, total }, ...prev].slice(0, 6))
  }

  function rollAdvantage() {
    const r1 = Math.floor(Math.random() * 20) + 1
    const r2 = Math.floor(Math.random() * 20) + 1
    const best = Math.max(r1, r2) + (parseInt(modifier) || 0)
    setRolls(prev => [{ label: 'd20 Adv', results: [r1, r2], modifier: parseInt(modifier) || 0, total: best, adv: true }, ...prev].slice(0, 6))
  }

  function rollDisadvantage() {
    const r1 = Math.floor(Math.random() * 20) + 1
    const r2 = Math.floor(Math.random() * 20) + 1
    const worst = Math.min(r1, r2) + (parseInt(modifier) || 0)
    setRolls(prev => [{ label: 'd20 Dis', results: [r1, r2], modifier: parseInt(modifier) || 0, total: worst, dis: true }, ...prev].slice(0, 6))
  }

  const inputSm = { background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'sans-serif', fontSize:12, padding:'3px 6px', outline:'none', textAlign:'center', width:'100%' }

  return (
    <div style={{ borderTop:'1px solid var(--border)', marginTop:12, paddingTop:10 }}>
      <div style={{ fontSize:10, color:'var(--gold)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>🎲 Dice Roller</div>

      <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', marginBottom:8 }}>
        {/* Dice count + modifier */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <input type="number" min={1} max={20} value={diceCount} onChange={e => setDiceCount(Math.max(1, parseInt(e.target.value)||1))}
            style={{ ...inputSm, width:36 }} title="Number of dice" />
          <span style={{ fontSize:11, color:'var(--muted)' }}>dice</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:11, color:'var(--muted)' }}>mod</span>
          <input type="number" value={modifier} onChange={e => setModifier(e.target.value)}
            style={{ ...inputSm, width:44 }} title="Modifier (±)" />
        </div>
        {/* Dice buttons */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {DICE.map(d => (
            <button key={d} onClick={() => roll(d)} style={{
              background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.35)',
              borderRadius:4, color:'var(--gold)', fontFamily:'sans-serif', fontSize:11,
              padding:'3px 7px', cursor:'pointer', fontWeight:'bold',
            }}>d{d}</button>
          ))}
        </div>
        {/* Advantage / Disadvantage */}
        <div style={{ display:'flex', gap:4 }}>
          <button onClick={rollAdvantage} style={{ background:'rgba(144,200,112,.1)', border:'1px solid rgba(144,200,112,.3)', borderRadius:4, color:'#90c870', fontFamily:'sans-serif', fontSize:10, padding:'3px 8px', cursor:'pointer' }} title="Roll 2d20, take highest">Adv</button>
          <button onClick={rollDisadvantage} style={{ background:'rgba(240,149,149,.1)', border:'1px solid rgba(240,149,149,.3)', borderRadius:4, color:'#f09595', fontFamily:'sans-serif', fontSize:10, padding:'3px 8px', cursor:'pointer' }} title="Roll 2d20, take lowest">Dis</button>
        </div>
      </div>

      {/* Roll history */}
      {rolls.length > 0 && (
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {rolls.map((r, i) => (
            <div key={i} style={{
              background: i === 0 ? 'rgba(201,168,76,.12)' : 'rgba(255,255,255,.03)',
              border: `1px solid ${i === 0 ? 'rgba(201,168,76,.4)' : 'var(--border)'}`,
              borderRadius:5, padding:'4px 10px', textAlign:'center', minWidth:52,
            }}>
              <div style={{ fontSize: i === 0 ? 18 : 14, fontWeight:'bold', color: i === 0 ? 'var(--gold)' : 'var(--parch2)', fontFamily:'sans-serif', lineHeight:1 }}>{r.total}</div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginTop:1 }}>{r.label}</div>
              {r.results.length > 1 && <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif' }}>[{r.results.join(',')}]</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Initiative Tracker ────────────────────────────────────────────────────────
function InitiativeTracker({ encounter, onEnd, campaignCharacters }) {
  function buildFromEncounter() {
    const list = []
    if (campaignCharacters?.length) {
      campaignCharacters.forEach(c => {
        list.push({
          id: uid(), name: c.name,
          initiative: 0,
          hp: String(c.hp || c.maxHp || ''),
          maxHp: String(c.maxHp || ''),
          type: 'pc',
          dexMod: c.dex ? Math.floor((parseInt(c.dex) - 10) / 2) : 0,
        })
      })
    }
    encounter.forEach(e => {
      const monsterData = MONSTERS.find(m => m[0] === e.name)
      const hp = monsterData?.[5] || ''
      for (let i = 0; i < e.qty; i++) {
        list.push({
          id: uid(), name: e.qty > 1 ? `${e.name} ${i + 1}` : e.name,
          initiative: 0, hp: hp ? String(hp) : '', maxHp: hp ? String(hp) : '',
          type: 'monster', dexMod: 0,
        })
      }
    })
    return list
  }

  // Restore from localStorage if present, otherwise build fresh
  const [combatants, setCombatants] = useState(() => {
    const saved = loadCombatState()
    return saved?.combatants ?? buildFromEncounter()
  })
  const [currentIdx, setCurrentIdx] = useState(() => loadCombatState()?.currentIdx ?? null)
  const [round, setRound]           = useState(() => loadCombatState()?.round ?? 1)
  const [started, setStarted]       = useState(() => loadCombatState()?.started ?? false)
  const [newName, setNewName]       = useState('')
  const [newHp, setNewHp]           = useState('')
  const [newType, setNewType]       = useState('pc')
  const [newDex, setNewDex]         = useState(0)
  const [endingCombat, setEndingCombat] = useState(false)

  // Persist combat state whenever it changes
  useEffect(() => {
    saveCombatState({ combatants, currentIdx, round, started })
  }, [combatants, currentIdx, round, started])

  const sorted = started
    ? [...combatants].sort((a, b) => b.initiative - a.initiative || b.dexMod - a.dexMod)
    : combatants

  // keep an id→idx map so we can highlight current combatant regardless of re-sort
  const currentId = started && currentIdx !== null ? sorted[currentIdx]?.id : null

  function rollAll() {
    setCombatants(prev => prev.map(c => ({ ...c, initiative: d20() + c.dexMod })))
  }

  function setInit(id, val) {
    setCombatants(prev => prev.map(c => c.id === id ? { ...c, initiative: parseInt(val) || 0 } : c))
  }

  function setHp(id, val) {
    const clamped = Math.max(0, parseInt(val) || 0)
    setCombatants(prev => prev.map(c => c.id === id ? { ...c, hp: String(clamped) } : c))
  }

  function removeCombatant(id) {
    setCombatants(prev => {
      const next = prev.filter(c => c.id !== id)
      return next
    })
    if (started) setCurrentIdx(0)
  }

  function addCombatant() {
    if (!newName.trim()) return
    setCombatants(prev => [...prev, {
      id: uid(), name: newName.trim(),
      initiative: 0, hp: newHp, maxHp: newHp,
      type: newType, dexMod: parseInt(newDex) || 0,
    }])
    setNewName(''); setNewHp(''); setNewDex(0)
  }

  function startCombat() {
    setCurrentIdx(0)
    setStarted(true)
  }

  function nextTurn() {
    const next = (currentIdx + 1) % sorted.length
    if (next === 0) setRound(r => r + 1)
    setCurrentIdx(next)
  }

  function endCombat() {
    setEndingCombat(true)
  }

  function confirmEnd(outcome) {
    clearCombatState()
    onEnd(outcome, round)
  }

  const rowStyle = (isCurrent, isDead) => ({
    display: 'grid',
    gridTemplateColumns: '56px 1fr 80px 80px 28px',
    alignItems: 'center', gap: 8,
    padding: '6px 10px', borderRadius: 6, marginBottom: 4,
    background: isCurrent ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${isCurrent ? 'var(--gold)' : 'var(--border)'}`,
    opacity: isDead ? 0.4 : 1,
    transition: 'background 0.2s, border-color 0.2s',
  })

  const inputSm = {
    background: '#1a1a2e', border: '1px solid var(--border2)', borderRadius: 4,
    color: '#f5f0e1', fontFamily: 'Georgia, serif', fontSize: 12,
    padding: '3px 6px', outline: 'none', width: '100%', textAlign: 'center',
  }

  return (
    <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>⚔ Initiative Tracker</span>
          {started && (
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
              Round <strong style={{ color: 'var(--gold)' }}>{round}</strong>
              {currentIdx !== null && sorted[currentIdx] && (
                <> · <strong style={{ color: '#f5c842' }}>{sorted[currentIdx].name}'s turn</strong></>
              )}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {!started && <button onClick={rollAll} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--border2)', borderRadius: 5, color: 'var(--parch2)', fontFamily: 'Georgia, serif', fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>🎲 Roll All</button>}
          {!started && combatants.length > 0 && <button onClick={startCombat} style={{ background: 'var(--crimson)', border: '1px solid rgba(201,168,76,.5)', borderRadius: 5, color: '#f5f0e1', fontFamily: 'Georgia, serif', fontSize: 12, padding: '4px 14px', cursor: 'pointer', fontWeight: 'bold' }}>▶ Start Combat</button>}
          {started && <button onClick={nextTurn} style={{ background: 'var(--crimson)', border: '1px solid rgba(201,168,76,.5)', borderRadius: 5, color: '#f5f0e1', fontFamily: 'Georgia, serif', fontSize: 13, padding: '4px 16px', cursor: 'pointer', fontWeight: 'bold' }}>Next Turn →</button>}
          {!endingCombat && <button onClick={endCombat} style={{ background: 'none', border: '1px solid rgba(240,100,100,.3)', borderRadius: 5, color: '#f09595', fontFamily: 'Georgia, serif', fontSize: 12, padding: '4px 12px', cursor: 'pointer' }}>End Combat</button>}
        </div>
      </div>

      {/* End combat outcome picker */}
      {endingCombat && (
        <div style={{ background: 'rgba(240,100,100,.08)', border: '1px solid rgba(240,100,100,.3)', borderRadius: 6, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: '#f09595', fontWeight: 'bold', marginBottom: 8 }}>How did the encounter end?</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {['Victory','Defeat','Fled','Avoided','Ongoing'].map(outcome => (
              <button
                key={outcome}
                onClick={() => confirmEnd(outcome)}
                style={{
                  background: outcome === 'Victory' ? 'rgba(144,200,112,.15)' : outcome === 'Defeat' ? 'rgba(240,100,100,.15)' : 'rgba(255,255,255,.06)',
                  border: `1px solid ${outcome === 'Victory' ? 'rgba(144,200,112,.5)' : outcome === 'Defeat' ? 'rgba(240,100,100,.4)' : 'var(--border2)'}`,
                  borderRadius: 5, color: outcome === 'Victory' ? '#90c870' : outcome === 'Defeat' ? '#f09595' : 'var(--parch2)',
                  fontFamily: 'Georgia, serif', fontSize: 12, padding: '5px 14px', cursor: 'pointer',
                }}
              >{outcome}</button>
            ))}
          </div>
          <button onClick={() => setEndingCombat(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'sans-serif' }}>← Cancel</button>
        </div>
      )}

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 80px 80px 28px', gap: 8, padding: '0 10px', marginBottom: 4 }}>
        {['Initiative', 'Name', 'Curr HP', 'Max HP', ''].map((h, i) => (
          <div key={i} style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: i === 0 || i >= 2 ? 'center' : 'left' }}>{h}</div>
        ))}
      </div>

      {/* Combatant rows */}
      {(started ? sorted : combatants).map((c) => {
        const isCurrent = c.id === currentId
        const hpNum = parseInt(c.hp)
        const isDead = c.maxHp && !isNaN(hpNum) && hpNum <= 0
        return (
          <div key={c.id} style={rowStyle(isCurrent, isDead)}>
            {/* Initiative */}
            {started ? (
              <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: 'var(--gold)', fontFamily: 'Georgia, serif' }}>
                {c.initiative}
              </div>
            ) : (
              <input
                type="number"
                value={c.initiative === 0 ? '' : c.initiative}
                onChange={e => setInit(c.id, e.target.value || '0')}
                placeholder="—"
                style={{ ...inputSm, fontSize: 14, fontWeight: 'bold', color: c.initiative !== 0 ? '#f5c842' : 'var(--muted)', border: '1px solid var(--border2)' }}
              />
            )}
            {/* Name + type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
              {isCurrent && <span style={{ fontSize: 10, color: 'var(--gold)', flexShrink: 0 }}>▶</span>}
              <span style={{ fontSize: 13, color: isCurrent ? 'var(--gold)' : isDead ? 'var(--muted)' : 'var(--parch2)', fontWeight: isCurrent ? 'bold' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: isDead ? 'line-through' : 'none' }}>{c.name}</span>
              <span style={{ fontSize: 9, fontFamily: 'sans-serif', padding: '1px 5px', borderRadius: 2, background: c.type === 'pc' ? 'rgba(144,184,248,.15)' : 'rgba(240,149,149,.12)', color: c.type === 'pc' ? '#90b8f8' : '#f09595', border: `1px solid ${c.type === 'pc' ? 'rgba(144,184,248,.3)' : 'rgba(240,149,149,.3)'}`, flexShrink: 0 }}>{c.type === 'pc' ? 'PC' : 'MON'}</span>
            </div>
            {/* Current HP */}
            <input
              type="number"
              value={c.hp}
              onChange={e => setHp(c.id, e.target.value)}
              placeholder="—"
              style={{ ...inputSm, color: isDead ? '#f09595' : parseInt(c.hp) <= (parseInt(c.maxHp) * 0.5) && c.maxHp ? '#f5c842' : '#90c870' }}
            />
            {/* Max HP (read-only) */}
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>{c.maxHp || '—'}</div>
            {/* Remove */}
            <button onClick={() => removeCombatant(c.id)} style={{ background: 'none', border: 'none', color: 'rgba(240,100,100,.5)', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        )
      })}

      {combatants.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--muted)', fontSize: 12, fontStyle: 'italic' }}>No combatants. Add monsters to the encounter above, or add party members below.</div>
      )}

      {!started && combatants.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', fontStyle: 'italic', padding: '4px 10px' }}>
          Click <strong style={{ color: 'var(--gold)' }}>🎲 Roll All</strong> to randomise initiatives, or type values manually — then click <strong style={{ color: 'var(--gold)' }}>▶ Start Combat</strong> to sort and begin.
        </div>
      )}

      {/* Inline dice roller */}
      <CombatDiceRoller />

      {/* Add combatant form */}
      <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,.02)', borderRadius: 6, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Add combatant</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px 70px auto', gap: 6, alignItems: 'flex-end' }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name..." onKeyDown={e => e.key === 'Enter' && addCombatant()} style={{ background: '#1a1a2e', border: '1px solid var(--border2)', borderRadius: 4, color: '#f5f0e1', fontFamily: 'Georgia, serif', fontSize: 12, padding: '5px 8px', outline: 'none' }} />
          <input type="number" value={newHp} onChange={e => setNewHp(e.target.value)} placeholder="HP" style={{ ...inputSm, padding: '5px 8px' }} />
          <input type="number" value={newDex} onChange={e => setNewDex(e.target.value)} placeholder="DEX mod" title="Dex modifier for initiative tiebreaks" style={{ ...inputSm, padding: '5px 8px' }} />
          <select value={newType} onChange={e => setNewType(e.target.value)} style={{ background: '#16213e', border: '1px solid var(--border2)', borderRadius: 4, color: '#f5f0e1', fontFamily: 'Georgia, serif', fontSize: 12, padding: '5px 6px', outline: 'none', cursor: 'pointer' }}>
            <option value="pc" style={{ background: '#16213e' }}>PC</option>
            <option value="monster" style={{ background: '#16213e' }}>Monster</option>
          </select>
          <button onClick={addCombatant} style={{ background: 'var(--crimson)', border: '1px solid rgba(201,168,76,.4)', borderRadius: 5, color: '#f5f0e1', fontFamily: 'Georgia, serif', fontSize: 12, padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add</button>
        </div>
      </div>
    </div>
  )
}

function crLabel(cr) {
  if (cr === 0)     return '0'
  if (cr === 0.125) return '1/8'
  if (cr === 0.25)  return '1/4'
  if (cr === 0.5)   return '1/2'
  return String(cr)
}

function calcDifficulty(encounter, partySize, partyLevel) {
  if (!encounter.length) return null

  const lvl = Math.min(Math.max(partyLevel, 1), 20)
  const thr = XP_THRESHOLDS[lvl - 1]
  const [easy, med, hard, deadly] = thr.map(t => t * partySize)

  let rawXP = 0
  let totalMonsters = 0
  encounter.forEach(e => {
    rawXP += (CR_XP[e.cr] || 0) * e.qty
    totalMonsters += e.qty
  })

  // XP multiplier based on monster count and party size
  const multTable = [[1,1.5],[1,2],[2,2],[3,2.5],[4,3],[5,4],[6,5]]
  const idx = Math.min(Math.max(totalMonsters - 1, 0), 6)
  const mult = partySize < 3
    ? multTable[Math.min(idx + 1, 6)][1]
    : partySize > 5
      ? multTable[Math.max(idx - 1, 0)][1]
      : multTable[idx][1]

  const adjXP = Math.round(rawXP * mult)

  let diff = 'Trivial', color = '#90c870', pct = 0
  if (adjXP >= deadly)     { diff = 'Deadly';  color = '#d090f8'; pct = 100 }
  else if (adjXP >= hard)  { diff = 'Hard';    color = '#f09595'; pct = 70 + 30 * (adjXP - hard)  / (deadly - hard) }
  else if (adjXP >= med)   { diff = 'Medium';  color = '#f5c842'; pct = 40 + 30 * (adjXP - med)   / (hard - med)   }
  else if (adjXP >= easy)  { diff = 'Easy';    color = 'var(--gold)'; pct = 15 + 25 * (adjXP - easy) / (med - easy) }
  else                     { pct = Math.min(15, adjXP / easy * 15) }

  return { rawXP, adjXP, mult, easy, med, hard, deadly, diff, color, pct }
}

const selectStyle = {
    background: '#16213e',
    border: '1px solid var(--border2)',
    borderRadius: 5,
    color: '#f5f0e1',
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    padding: '5px 10px',
    outline: 'none',
    textAlign: 'center',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

const panelStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: 8, padding: '1rem',
}

const panelTitle = {
  fontSize: 13, fontWeight: 'bold', color: 'var(--gold)',
  letterSpacing: '0.06em', textTransform: 'uppercase',
  marginBottom: '0.75rem', paddingBottom: 6,
  borderBottom: '1px solid var(--border)',
}

export default function EncounterCalc({
  encounter, partySize, partyLevel,
  onPartySize, onPartyLevel,
  onChangeQty, onRemove, onClear,
  campaignCharacters,
}) {
  const { campaign, encounters } = useCampaign()
  const [monSearch, setMonSearch] = useState('')
  const [dropOpen,  setDropOpen]  = useState(false)
  const [showTracker, setShowTracker] = useState(false)
  const [trackerKey, setTrackerKey]   = useState(0)
  const searchRef = useRef(null)

  // Fall back to campaign active characters when prop not provided
  const partyForTracker = campaignCharacters
    ?? campaign.characters.filter(c => c.str !== undefined && (c.status === 'Active' || !c.status))

  const result = calcDifficulty(encounter, partySize, partyLevel)

  // Show all monsters on focus; filter when typing; show up to 20
  const dropResults = dropOpen
    ? MONSTERS.filter(m =>
        !monSearch.trim() || m[0].toLowerCase().includes(monSearch.toLowerCase())
      ).slice(0, 20)
    : []

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleAdd(name, cr) {
    onChangeQty(name, cr, 1, true)
    setMonSearch('')
    setDropOpen(false)
  }

  function handleEncounterEnd(outcome, rounds) {
    const monsterDesc = encounter.map(e => e.qty > 1 ? `${e.qty}× ${e.name}` : e.name).join(', ')
    const name        = monsterDesc ? `Combat: ${monsterDesc}` : 'Combat Encounter'
    const difficulty  = result?.diff || 'Unknown'
    const possibleXp  = result?.rawXP ? String(result.rawXP) : ''
    // Only award XP on a clear victory; anything else defaults to 0
    const xpAwarded   = outcome === 'Victory' && result?.rawXP ? String(result.rawXP) : '0'
    const notes       = [
      monsterDesc && `Monsters: ${monsterDesc}`,
      `Lasted ${rounds} round${rounds !== 1 ? 's' : ''}.`,
    ].filter(Boolean).join(' ')

    encounters.add({ name, difficulty, outcome, xpAwarded, possibleXp, notes })
    setShowTracker(false)
  }

  return (
    <div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

      {/* ── Left panel: party + monsters ── */}
      <div style={panelStyle}>
        <div style={panelTitle}>Party</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--parch2)', minWidth: 100 }}>Party size</span>
          <select style={{ ...selectStyle, width: 70 }} value={partySize} onChange={e => onPartySize(parseInt(e.target.value))}>
            {[2,3,4,5,6,7,8].map(n => (
            <option key={n} value={n} style={{ background: '#16213e', color: '#f5f0e1' }}>{n}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <span style={{ fontSize: 13, color: 'var(--parch2)', minWidth: 100 }}>Party level</span>
          <select style={{ ...selectStyle, width: 70 }} value={partyLevel} onChange={e => onPartyLevel(parseInt(e.target.value))}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n} style={{ background: '#16213e', color: '#f5f0e1' }}>{n}</option>
            ))}
        </select>
        </div>

        <div style={panelTitle}>Add monsters</div>
        <div ref={searchRef} style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={monSearch}
            placeholder="Search or browse all monsters..."
            onChange={e => { setMonSearch(e.target.value); setDropOpen(true) }}
            onFocus={() => setDropOpen(true)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${dropOpen ? 'var(--gold)' : 'var(--border2)'}`,
              borderRadius: dropOpen ? '5px 5px 0 0' : 5,
              color: 'var(--parch)',
              fontFamily: 'Georgia, serif', fontSize: 13,
              padding: '6px 10px', outline: 'none',
            }}
          />
          {dropOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'var(--stone2)',
              border: '1px solid var(--gold)',
              borderTop: 'none',
              borderRadius: '0 0 5px 5px',
              maxHeight: 240,
              overflowY: 'auto', zIndex: 100,
            }}>
              {dropResults.length === 0 && (
                <div style={{ padding: '10px', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>No monsters match "{monSearch}"</div>
              )}
              {dropResults.map(m => (
                <div
                  key={m[0]}
                  onClick={() => handleAdd(m[0], m[1])}
                  style={{
                    padding: '7px 10px', fontSize: 13, cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: 'var(--parch2)' }}>{m[0]}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'sans-serif' }}>
                    CR {crLabel(m[1])} · {m[2]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ ...panelTitle, marginTop: '0.5rem' }}>Encounter</div>
        {encounter.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', fontSize: 13, fontStyle: 'italic' }}>
            No monsters yet.<br />Search above or use &ldquo;+ Add&rdquo; in the Monsters tab.
          </div>
        ) : (
          <>
            {encounter.map(e => (
              <div key={e.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                borderRadius: 5, padding: '6px 10px', marginBottom: 6, fontSize: 13,
              }}>
                <span style={{ fontWeight: 'bold', color: 'var(--parch2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.name}
                </span>
                <span style={{ color: 'var(--gold)', fontSize: 12, fontFamily: 'sans-serif', margin: '0 8px', flexShrink: 0 }}>
                  CR {crLabel(e.cr)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => onChangeQty(e.name, e.cr, -1)} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid var(--border)', borderRadius:3, color:'var(--parch)', width:22, height:22, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ fontSize: 13, color: 'var(--parch)', minWidth: 16, textAlign: 'center', fontFamily: 'sans-serif' }}>{e.qty}</span>
                  <button onClick={() => onChangeQty(e.name, e.cr, 1)} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid var(--border)', borderRadius:3, color:'var(--parch)', width:22, height:22, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  <button onClick={() => onRemove(e.name)} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:16, padding:'0 2px', lineHeight:1 }}>×</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={onClear}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--muted)', fontSize: 12, padding: '4px 10px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
              >Clear all</button>
              <button
                onClick={() => {
                  const saved = loadCombatState()
                  // Only reset if no active saved combat
                  if (!saved?.started) setTrackerKey(k => k + 1)
                  setShowTracker(true)
                }}
                style={{ background: 'rgba(201,168,76,.12)', border: '1px solid var(--gold)', borderRadius: 4, color: 'var(--gold)', fontSize: 12, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
              >{loadCombatState()?.started ? '⚔ Resume Combat' : '⚔ Track Combat'}</button>
            </div>
          </>
        )}
      </div>

      {/* ── Right panel: difficulty ── */}
      <div style={panelStyle}>
        <div style={panelTitle}>Difficulty</div>

        {!result ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: 13, fontStyle: 'italic' }}>
            Add monsters to calculate encounter difficulty.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: result.color, padding: '8px 0 4px' }}>
              {result.diff}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 12, overflow: 'hidden', margin: '8px 0' }}>
              <div style={{ height: '100%', borderRadius: 4, background: result.color, width: `${Math.min(result.pct, 100)}%`, transition: 'width 0.3s, background 0.3s' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', marginTop: 4, flexWrap: 'wrap', gap: 4 }}>
              <span>Raw XP: {result.rawXP.toLocaleString()}</span>
              <span>×{result.mult} multiplier</span>
              <span>Adjusted: {result.adjXP.toLocaleString()}</span>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              {[
                ['Easy',   result.easy,   'rgba(30,100,30,0.35)',  '#90c870', 'rgba(30,100,30,0.5)'  ],
                ['Medium', result.med,    'rgba(180,120,0,0.35)',  '#f5c842', 'rgba(180,120,0,0.5)'  ],
                ['Hard',   result.hard,   'rgba(139,0,0,0.4)',     '#ff9999', 'rgba(139,0,0,0.6)'    ],
                ['Deadly', result.deadly, 'rgba(80,20,120,0.4)',   '#d090f8', 'rgba(80,20,120,0.6)'  ],
              ].map(([label, val, bg, color, border]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '4px 0', borderBottom: '1px solid rgba(201,168,76,0.08)',
                  fontSize: 12, fontFamily: 'sans-serif',
                }}>
                  <span>
                    <span style={{ display:'inline-block', padding:'2px 7px', borderRadius:3, fontSize:10, fontWeight:'bold', background:bg, color, border:`1px solid ${border}` }}>
                      {label}
                    </span>
                  </span>
                  <span style={{
                    color: result.diff === label ? result.color : 'var(--parch2)',
                    fontWeight: result.diff === label ? 'bold' : 'normal',
                  }}>
                    {val.toLocaleString()}+ XP
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', padding: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 5, fontSize: 12, color: 'var(--muted)' }}>
              <div style={{ color: 'var(--parch2)', marginBottom: 4 }}>Breakdown</div>
              {encounter.map(e => (
                <div key={e.name}>
                  {e.qty}× {e.name} = {((CR_XP[e.cr] || 0) * e.qty).toLocaleString()} XP
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6, color: 'var(--parch2)' }}>
                {encounter.reduce((a, e) => a + e.qty, 0)} monsters · ×{result.mult} for {partySize} players (lvl {partyLevel})
              </div>
            </div>
          </>
        )}
      </div>
      </div>

      {/* ── Initiative Tracker ── */}
      {showTracker && (
        <InitiativeTracker
          key={trackerKey}
          encounter={encounter}
          onEnd={handleEncounterEnd}
          campaignCharacters={partyForTracker}
        />
      )}
    </div>
  )
}