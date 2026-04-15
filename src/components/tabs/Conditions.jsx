import { useVersion }        from '../../context/VersionContext'
import VersionBadge          from '../ui/VersionBadge'
import { CONDITIONS_2014, EXHAUSTION_2014 } from '../../data/conditions2014'
import { CONDITIONS_2024, EXHAUSTION_2024 } from '../../data/conditions2024'

const SEV_BADGE = {
  red:    { bg: 'rgba(139,0,0,0.4)',     color: '#ff9999', border: 'rgba(139,0,0,0.6)',     label: 'Severe'   },
  amber:  { bg: 'rgba(180,120,0,0.35)',  color: '#f5c842', border: 'rgba(180,120,0,0.5)',   label: 'Moderate' },
  green:  { bg: 'rgba(30,100,30,0.35)',  color: '#90c870', border: 'rgba(30,100,30,0.5)',   label: 'Minor'    },
  blue:   { bg: 'rgba(20,60,140,0.4)',   color: '#90b8f8', border: 'rgba(20,60,140,0.6)',   label: 'Sensory'  },
  purple: { bg: 'rgba(80,20,120,0.4)',   color: '#d090f8', border: 'rgba(80,20,120,0.6)',   label: 'Stealth'  },
}

function Badge({ sev }) {
  const s = SEV_BADGE[sev]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 3,
      fontSize: 10, fontWeight: 'bold', fontFamily: 'sans-serif',
      letterSpacing: '0.03em', whiteSpace: 'nowrap',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      marginLeft: 6,
    }}>{s.label}</span>
  )
}

function hl(text, term) {
  if (!term) return text
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) ? <mark key={i}>{part}</mark> : part
  )
}

function SectionHeader({ title, count, total, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      margin: '1.25rem 0 0.75rem', paddingBottom: 6,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</span>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif' }}>{count} / {total}</span>
      )}
      {children && <span style={{ marginLeft: 'auto' }}>{children}</span>}
    </div>
  )
}

export default function Conditions({ searchTerm }) {
  const { getTabVersion } = useVersion()
  const version = getTabVersion('conditions')

  const CONDITIONS = version === '2024' ? CONDITIONS_2024 : CONDITIONS_2014
  const EXHAUSTION = version === '2024' ? EXHAUSTION_2024 : EXHAUSTION_2014

  const filtered = CONDITIONS.filter(c =>
    !searchTerm || [c.name, c.effects, c.ends].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  const exFiltered = EXHAUSTION.filter(e =>
    !searchTerm || [e.level, e.effect].some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <SectionHeader title="Status conditions" count={filtered.length} total={CONDITIONS.length}>
        <VersionBadge tabId="conditions" />
      </SectionHeader>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontStyle: 'italic' }}>
          No conditions match &ldquo;{searchTerm}&rdquo;
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
            <thead>
              <tr style={{ background: 'var(--crimson)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--parch)', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', width: 160 }}>Condition</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--parch)', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Effects</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--parch)', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', width: 200 }}>How it ends</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.name} style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '8px 10px', verticalAlign: 'top', fontWeight: 'bold', color: 'var(--gold2)' }}>
                    {hl(c.name, searchTerm)}<Badge sev={c.sev} />
                  </td>
                  <td style={{ padding: '8px 10px', verticalAlign: 'top', color: 'var(--parch2)', lineHeight: 1.5 }}>
                    {hl(c.effects, searchTerm)}
                  </td>
                  <td style={{ padding: '8px 10px', verticalAlign: 'top', color: 'var(--muted)', fontSize: 12, lineHeight: 1.5 }}>
                    {hl(c.ends, searchTerm)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {exFiltered.length > 0 && (
        <>
          <SectionHeader title="Exhaustion levels" />
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--crimson)' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--parch)', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase', width: 100 }}>Level</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--parch)', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {version === '2024' ? 'Cumulative penalty' : 'Cumulative effect'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {exFiltered.map((e, i) => (
                  <tr key={e.level} style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 'bold', color: i >= 4 ? '#f09595' : i >= 2 ? 'var(--gold)' : 'var(--gold2)' }}>
                      {hl(e.level, searchTerm)}
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--parch2)' }}>
                      {hl(e.effect, searchTerm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
