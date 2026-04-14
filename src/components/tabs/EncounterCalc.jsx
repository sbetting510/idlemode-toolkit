import { useState } from 'react'
import { MONSTERS, CR_XP, XP_THRESHOLDS } from '../../data/monsters'

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
}) {
  const [monSearch, setMonSearch] = useState('')
  const [dropOpen,  setDropOpen]  = useState(false)

  const result = calcDifficulty(encounter, partySize, partyLevel)

  const dropResults = monSearch.trim()
    ? MONSTERS.filter(m => m[0].toLowerCase().includes(monSearch.toLowerCase())).slice(0, 8)
    : []

  function handleAdd(name, cr) {
    const fakeEvent = { name, cr }
    onChangeQty(name, cr, 1, true)
    setMonSearch('')
    setDropOpen(false)
  }

  return (
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
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={monSearch}
            placeholder="Search by name..."
            onChange={e => { setMonSearch(e.target.value); setDropOpen(true) }}
            onFocus={() => setDropOpen(true)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border2)',
              borderRadius: 5, color: 'var(--parch)',
              fontFamily: 'Georgia, serif', fontSize: 13,
              padding: '6px 10px', outline: 'none',
              marginBottom: 6,
            }}
          />
          {dropOpen && dropResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'var(--stone2)',
              border: '1px solid var(--border2)',
              borderRadius: 5, maxHeight: 200,
              overflowY: 'auto', zIndex: 100,
              marginTop: 2,
            }}>
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
            <button
              onClick={onClear}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 4, color: 'var(--muted)',
                fontSize: 12, padding: '4px 10px',
                cursor: 'pointer', marginTop: 6,
                fontFamily: 'Georgia, serif',
              }}
            >Clear all</button>
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
  )
}