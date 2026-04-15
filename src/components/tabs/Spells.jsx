import { useState } from 'react'
import { useVersion }  from '../../context/VersionContext'
import VersionBadge    from '../ui/VersionBadge'
import { SPELLS as SPELLS_2014 } from '../../data/spells'
import { SPELLS_2024 }           from '../../data/spells2024'

const SCHOOLS = ["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation"]

const SCHOOL_STYLES = {
  Abjuration:   { bg: 'rgba(20,60,140,0.4)',   color: '#90b8f8', border: 'rgba(20,60,140,0.6)'   },
  Conjuration:  { bg: 'rgba(30,100,30,0.35)',  color: '#90c870', border: 'rgba(30,100,30,0.5)'   },
  Divination:   { bg: 'rgba(180,120,0,0.35)',  color: '#f5c842', border: 'rgba(180,120,0,0.5)'   },
  Enchantment:  { bg: 'rgba(140,0,80,0.35)',   color: '#f890c8', border: 'rgba(140,0,80,0.5)'    },
  Evocation:    { bg: 'rgba(139,0,0,0.4)',     color: '#ff9999', border: 'rgba(139,0,0,0.6)'     },
  Illusion:     { bg: 'rgba(0,100,100,0.35)',  color: '#70d8d8', border: 'rgba(0,100,100,0.5)'   },
  Necromancy:   { bg: 'rgba(80,20,120,0.4)',   color: '#d090f8', border: 'rgba(80,20,120,0.6)'   },
  Transmutation:{ bg: 'rgba(20,60,140,0.4)',   color: '#90b8f8', border: 'rgba(20,60,140,0.6)'   },
}

function SchoolBadge({ school }) {
  const s = SCHOOL_STYLES[school] || SCHOOL_STYLES.Abjuration
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 3,
      fontSize: 10, fontWeight: 'bold', fontFamily: 'sans-serif',
      letterSpacing: '0.03em', whiteSpace: 'nowrap',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{school}</span>
  )
}

function SmallBadge({ label, color, bg, border }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 5px', borderRadius: 3,
      fontSize: 9, fontWeight: 'bold', fontFamily: 'sans-serif',
      marginLeft: 3, verticalAlign: 'middle',
      background: bg, color, border: `1px solid ${border}`,
    }}>{label}</span>
  )
}

function levelColor(lvl) {
  if (lvl === 0) return 'var(--gold2)'
  if (lvl <= 2)  return 'var(--parch2)'
  if (lvl <= 5)  return '#f5c842'
  if (lvl <= 8)  return '#f09595'
  return '#d090f8'
}

function hl(text, term) {
  if (!term) return text
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) => re.test(part) ? <mark key={i}>{part}</mark> : part)
}

export default function Spells({ searchTerm }) {
  const { getTabVersion } = useVersion()
  const version = getTabVersion('spells')

  const [levelFilter, setLevelFilter]   = useState('All')
  const [schoolFilter, setSchoolFilter] = useState('All')
  const [concOnly, setConcOnly]         = useState(false)
  const [ritualOnly, setRitualOnly]     = useState(false)

  const SPELLS = version === '2024' ? SPELLS_2024 : SPELLS_2014

  const filtered = SPELLS.filter(s => {
    const [name, lvl, school,,,, conc,, ritual, desc] = s
    if (levelFilter  !== 'All' && lvl !== parseInt(levelFilter)) return false
    if (schoolFilter !== 'All' && school !== schoolFilter)       return false
    if (concOnly   && conc   !== 'Yes') return false
    if (ritualOnly && ritual !== 'Yes') return false
    if (searchTerm && ![name, school, desc].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false
    return true
  })

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
    minWidth: 110,
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  const toggleBtn = (active) => ({
    background: active ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)',
    border: `1px solid ${active ? 'var(--gold)' : 'var(--border2)'}`,
    borderRadius: 5,
    color: active ? 'var(--gold)' : 'var(--parch2)',
    fontFamily: 'Georgia, serif', fontSize: 12,
    padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
  })

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Level</span>
          <select style={filterSelect} value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="All" style={{ background: '#16213e', color: '#f5f0e1' }}>All levels</option>
            <option value="0"   style={{ background: '#16213e', color: '#f5f0e1' }}>Cantrip</option>
            {[1,2,3,4,5,6,7,8,9].map(l => (
              <option key={l} value={l} style={{ background: '#16213e', color: '#f5f0e1' }}>Level {l}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>School</span>
          <select style={filterSelect} value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}>
            <option value="All" style={{ background: '#16213e', color: '#f5f0e1' }}>All schools</option>
            {SCHOOLS.map(s => (
              <option key={s} value={s} style={{ background: '#16213e', color: '#f5f0e1' }}>{s}</option>
          ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>&nbsp;</span>
          <button style={toggleBtn(concOnly)} onClick={() => setConcOnly(!concOnly)}>Concentration</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>&nbsp;</span>
          <button style={toggleBtn(ritualOnly)} onClick={() => setRitualOnly(!ritualOnly)}>Ritual</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif', paddingBottom: 2 }}>
            {filtered.length} spell{filtered.length !== 1 ? 's' : ''}
          </span>
          <VersionBadge tabId="spells" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontStyle: 'italic' }}>
          No spells match the current filters
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
            <thead>
              <tr style={{ background: 'var(--crimson)' }}>
                {[['Spell', 150],['Level', 65],['School', 115],['Cast time', 110],['Description', undefined]].map(([h, w]) => (
                  <th key={h} style={{
                    padding: '8px 10px', textAlign: 'left',
                    color: 'var(--parch)', fontSize: 11,
                    fontWeight: 'bold', letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    width: w,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const [name, lvl, school, cast,,, conc,, ritual, desc] = s
                return (
                  <tr key={name} style={{
                    borderBottom: '1px solid rgba(201,168,76,0.1)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                  }}>
                    <td style={{ padding: '8px 10px', verticalAlign: 'top', fontWeight: 'bold', color: 'var(--gold2)' }}>
                      {hl(name, searchTerm)}
                      {conc   === 'Yes' && <SmallBadge label="C" color="#f5c842" bg="rgba(180,120,0,0.35)" border="rgba(180,120,0,0.5)" />}
                      {ritual === 'Yes' && <SmallBadge label="R" color="#70d8d8" bg="rgba(0,100,100,0.35)" border="rgba(0,100,100,0.5)" />}
                    </td>
                    <td style={{ padding: '8px 10px', verticalAlign: 'top', color: levelColor(lvl), fontFamily: 'sans-serif', fontSize: 12 }}>
                      {lvl === 0 ? 'Cantrip' : `Lvl ${lvl}`}
                    </td>
                    <td style={{ padding: '8px 10px', verticalAlign: 'top' }}>
                      <SchoolBadge school={school} />
                    </td>
                    <td style={{ padding: '8px 10px', verticalAlign: 'top', color: 'var(--parch2)', fontSize: 12 }}>
                      {hl(cast, searchTerm)}
                    </td>
                    <td style={{ padding: '8px 10px', verticalAlign: 'top', color: 'var(--parch2)', fontSize: 12, lineHeight: 1.5 }}>
                      {hl(desc, searchTerm)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}