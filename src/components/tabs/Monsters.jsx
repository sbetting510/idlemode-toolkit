import { useState } from 'react'
import { MONSTERS } from '../../data/monsters'

const TYPES  = [...new Set(MONSTERS.map(m => m[2]))].sort()
const SIZES  = ["Tiny","Small","Medium","Large","Huge","Gargantuan"]
const ALL_CRS = [...new Set(MONSTERS.map(m => m[1]))].sort((a,b) => a - b)

function crLabel(cr) {
  if (cr === 0)     return '0'
  if (cr === 0.125) return '1/8'
  if (cr === 0.25)  return '1/4'
  if (cr === 0.5)   return '1/2'
  return String(cr)
}

function crColor(cr) {
  if (cr <= 0.5) return '#90c870'
  if (cr <= 4)   return 'var(--gold)'
  if (cr <= 10)  return '#f5c842'
  if (cr <= 16)  return '#f09595'
  return '#d090f8'
}

function modStr(v) {
  const m = Math.floor((v - 10) / 2)
  return (m >= 0 ? '+' : '') + m
}

const TYPE_BADGE = {
  Beast:      { bg:'rgba(30,100,30,0.35)',  color:'#90c870', border:'rgba(30,100,30,0.5)'   },
  Dragon:     { bg:'rgba(139,0,0,0.4)',     color:'#ff9999', border:'rgba(139,0,0,0.6)'     },
  Fiend:      { bg:'rgba(139,0,0,0.4)',     color:'#ff9999', border:'rgba(139,0,0,0.6)'     },
  Undead:     { bg:'rgba(80,20,120,0.4)',   color:'#d090f8', border:'rgba(80,20,120,0.6)'   },
  Humanoid:   { bg:'rgba(20,60,140,0.4)',   color:'#90b8f8', border:'rgba(20,60,140,0.6)'   },
  Monstrosity:{ bg:'rgba(180,120,0,0.35)',  color:'#f5c842', border:'rgba(180,120,0,0.5)'   },
  Elemental:  { bg:'rgba(0,100,100,0.35)',  color:'#70d8d8', border:'rgba(0,100,100,0.5)'   },
  Fey:        { bg:'rgba(140,0,80,0.35)',   color:'#f890c8', border:'rgba(140,0,80,0.5)'    },
  Aberration: { bg:'rgba(80,20,120,0.4)',   color:'#d090f8', border:'rgba(80,20,120,0.6)'   },
  Construct:  { bg:'rgba(20,60,140,0.4)',   color:'#90b8f8', border:'rgba(20,60,140,0.6)'   },
  Celestial:  { bg:'rgba(0,100,100,0.35)',  color:'#70d8d8', border:'rgba(0,100,100,0.5)'   },
  Giant:      { bg:'rgba(180,120,0,0.35)',  color:'#f5c842', border:'rgba(180,120,0,0.5)'   },
  Ooze:       { bg:'rgba(30,100,30,0.35)',  color:'#90c870', border:'rgba(30,100,30,0.5)'   },
}

function TypeBadge({ type }) {
  const s = TYPE_BADGE[type] || TYPE_BADGE.Humanoid
  return (
    <span style={{
      display:'inline-block', padding:'2px 7px', borderRadius:3,
      fontSize:10, fontWeight:'bold', fontFamily:'sans-serif',
      letterSpacing:'0.03em', whiteSpace:'nowrap',
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
    }}>{type}</span>
  )
}

function hl(text, term) {
  if (!term) return text
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) => re.test(part) ? <mark key={i}>{part}</mark> : part)
}

const filterSelect = {
  background: '#16213e',
  border: '1px solid var(--border2)',
  borderRadius: 5,
  color: '#f5f0e1',
  fontFamily: 'Georgia, serif',
  fontSize: 12,
  padding: '5px 8px',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function Monsters({ searchTerm, onAddToEncounter, encounter = [] }) {
  const [typeFilter, setTypeFilter] = useState('All')
  const [sizeFilter, setSizeFilter] = useState('All')
  const [crFilter,   setCrFilter]   = useState('All')
  const [selected,   setSelected]   = useState(null)

  const filtered = MONSTERS.filter(m => {
    const [name,,type,size] = m
    if (typeFilter !== 'All' && type !== typeFilter) return false
    if (sizeFilter !== 'All' && size !== sizeFilter) return false
    if (crFilter   !== 'All' && m[1] !== parseFloat(crFilter)) return false
    if (searchTerm && ![name, type, size].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false
    return true
  })

  function toggleSelected(name) {
    setSelected(prev => prev === name ? null : name)
  }

  const selectedMonster = selected ? MONSTERS.find(m => m[0] === selected) : null

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'1rem', alignItems:'flex-end' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          <span style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', letterSpacing:'0.05em', textTransform:'uppercase' }}>Type</span>
          <select style={filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="All" style={{ background: '#16213e', color: '#f5f0e1' }}>All types</option>
            {TYPES.map(t => (
              <option key={t} value={t} style={{ background: '#16213e', color: '#f5f0e1' }}>{t}</option>
          ))}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          <span style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', letterSpacing:'0.05em', textTransform:'uppercase' }}>Size</span>
          <select style={filterSelect} value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}>
            <option value="All" style={{ background: '#16213e', color: '#f5f0e1' }}>All sizes</option>
              {SIZES.map(s => (
                <option key={s} value={s} style={{ background: '#16213e', color: '#f5f0e1' }}>{s}</option>
              ))}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          <span style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', letterSpacing:'0.05em', textTransform:'uppercase' }}>CR</span>
          <select style={{ ...filterSelect, minWidth:90 }} value={crFilter} onChange={e => setCrFilter(e.target.value)}>
            <option value="All" style={{ background: '#16213e', color: '#f5f0e1' }}>All CRs</option>
            {ALL_CRS.map(c => (
              <option key={c} value={c} style={{ background: '#16213e', color: '#f5f0e1' }}>CR {crLabel(c)}</option>
            ))}
          </select>
        </div>
        <span style={{ fontSize:12, color:'var(--muted)', fontFamily:'sans-serif', marginLeft:'auto', alignSelf:'flex-end', paddingBottom:2 }}>
          {filtered.length} monster{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'2rem', color:'var(--muted)', fontStyle:'italic' }}>
          No monsters match the current filters
        </div>
      ) : (
        <div style={{ border:'1px solid var(--border)', borderRadius:6, overflow:'hidden', overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:560 }}>
            <thead>
              <tr style={{ background:'var(--crimson)' }}>
                {[['Name',150],['CR',55],['Type',105],['Size',70],['AC',45],['HP',50],['Resistances',120],['',80]].map(([h,w]) => (
                  <th key={h} style={{
                    padding:'8px 10px', textAlign:'left',
                    color:'var(--parch)', fontSize:11,
                    fontWeight:'bold', letterSpacing:'0.05em',
                    textTransform:'uppercase', width:w,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const [name, cr, type, size, ac, hp] = m
                const isSelected = selected === name
                return (
                  <tr
                    key={name}
                    onClick={() => toggleSelected(name)}
                    style={{
                      borderBottom:'1px solid rgba(201,168,76,0.1)',
                      background: isSelected
                        ? 'rgba(201,168,76,0.12)'
                        : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                      cursor:'pointer',
                    }}
                  >
                    <td style={{ padding:'8px 10px', verticalAlign:'middle', fontWeight:'bold', color:'var(--gold2)' }}>
                      {hl(name, searchTerm)}
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle' }}>
                      <span style={{ color:crColor(cr), fontWeight:'bold', fontFamily:'sans-serif' }}>
                        {crLabel(cr)}
                      </span>
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle' }}>
                      <TypeBadge type={type} />
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle', color:'var(--parch2)', fontSize:12 }}>
                      {size}
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle', color:'var(--parch2)', fontFamily:'sans-serif', fontSize:13 }}>
                      {ac}
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle', color:'var(--parch2)', fontFamily:'sans-serif', fontSize:13 }}>
                      {hp}
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle', color:'var(--muted)', fontSize:11 }}>
                      {m[7] || '—'}
                    </td>
                    <td style={{ padding:'8px 10px', verticalAlign:'middle' }}>
                      <button
                        onClick={e => { e.stopPropagation(); onAddToEncounter(name, cr) }}
                        style={{
                          background:'var(--crimson)',
                          border:'1px solid rgba(201,168,76,0.4)',
                          borderRadius:4, color:'var(--parch)',
                          fontSize:11, padding:'3px 8px', cursor:'pointer',
                        }}
                      >+ Add</button>
                      {(() => { const qty = encounter.find(e => e.name === name)?.qty ?? 0; return qty > 0 ? (
                        <span style={{
                          display:'inline-block', marginLeft:5,
                          padding:'1px 6px', borderRadius:10,
                          background:'rgba(201,168,76,0.12)',
                          border:'1px solid var(--gold)',
                          color:'var(--gold)',
                          fontFamily:'sans-serif', fontSize:11,
                          fontWeight:'bold',
                        }}>×{qty}</span>
                      ) : null })()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stat block */}
      {selectedMonster && (() => {
        const [name, cr, type, size, ac, hp, spd, stats, skills, res, saves, senses, actions] = selectedMonster
        return (
          <div style={{
            background:'rgba(255,255,255,0.04)',
            border:'1px solid var(--border)',
            borderRadius:6, padding:'1rem', marginTop:'0.75rem',
          }}>
            <div style={{ fontSize:16, fontWeight:'bold', color:'var(--gold2)', marginBottom:2 }}>{name}</div>
            <div style={{ fontSize:12, color:'var(--muted)', fontStyle:'italic', marginBottom:'0.75rem', lineHeight:1.5 }}>
              {size} {type} · CR {crLabel(cr)} · AC {ac} · HP {hp}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:6, marginBottom:'0.75rem' }}>
              {['STR','DEX','CON','INT','WIS','CHA'].map((label, i) => {
                const key = ['str','dex','con','int','wis','cha'][i]
                const val = stats[key]
                return (
                  <div key={label} style={{
                    textAlign:'center',
                    background:'rgba(255,255,255,0.05)',
                    borderRadius:4, padding:'5px 2px',
                  }}>
                    <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif' }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:'bold', color:'var(--parch)' }}>{val}</div>
                    <div style={{ fontSize:10, color:'var(--gold)', fontFamily:'sans-serif' }}>{modStr(val)}</div>
                  </div>
                )
              })}
            </div>
            <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'8px 0' }} />
            {res && res !== '—'    && <div style={{ fontSize:12, color:'var(--parch2)', marginBottom:4 }}><strong style={{ color:'var(--gold)' }}>Resistances</strong> {res}</div>}
            {skills && skills !== '—' && <div style={{ fontSize:12, color:'var(--parch2)', marginBottom:4 }}><strong style={{ color:'var(--gold)' }}>Skills</strong> {skills}</div>}
            {senses && senses !== '—' && <div style={{ fontSize:12, color:'var(--parch2)', marginBottom:4 }}><strong style={{ color:'var(--gold)' }}>Senses</strong> {senses}</div>}
            <div style={{ fontSize:12, color:'var(--parch2)', lineHeight:1.5 }}><strong style={{ color:'var(--gold)' }}>Actions</strong> {actions}</div>
          </div>
        )
      })()}
    </div>
  )
}