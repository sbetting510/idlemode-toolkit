import { useVersion }    from '../../context/VersionContext'
import VersionBadge     from '../ui/VersionBadge'
import { ACTIONS_2014 } from '../../data/actions2014'
import { ACTIONS_2024 } from '../../data/actions2024'

const TYPE_STYLES = {
  action:   { bg: 'rgba(139,0,0,0.4)',    color: '#ff9999', border: 'rgba(139,0,0,0.6)'    },
  bonus:    { bg: 'rgba(180,120,0,0.35)', color: '#f5c842', border: 'rgba(180,120,0,0.5)'  },
  reaction: { bg: 'rgba(20,60,140,0.4)',  color: '#90b8f8', border: 'rgba(20,60,140,0.6)'  },
  free:     { bg: 'rgba(30,100,30,0.35)', color: '#90c870', border: 'rgba(30,100,30,0.5)'  },
  move:     { bg: 'rgba(80,20,120,0.4)',  color: '#d090f8', border: 'rgba(80,20,120,0.6)'  },
}

function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.action
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 3,
      fontSize: 10, fontWeight: 'bold', fontFamily: 'sans-serif',
      letterSpacing: '0.03em', whiteSpace: 'nowrap',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{type}</span>
  )
}

function hl(text, term) {
  if (!term) return text
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) => re.test(part) ? <mark key={i}>{part}</mark> : part)
}

export default function Actions({ searchTerm }) {
  const { getTabVersion } = useVersion()
  const version = getTabVersion('actions')

  const ACTIONS = version === '2024' ? ACTIONS_2024 : ACTIONS_2014

  const filtered = ACTIONS.filter(a =>
    !searchTerm || [a.name, a.desc, a.type, a.notes].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        margin: '0 0 0.75rem', paddingBottom: 6,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Action types
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
          {filtered.length} / {ACTIONS.length}
        </span>
        <span style={{ marginLeft: 'auto' }}>
          <VersionBadge tabId="actions" />
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontStyle: 'italic' }}>
          No actions match &ldquo;{searchTerm}&rdquo;
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 480 }}>
            <thead>
              <tr style={{ background: 'var(--crimson)' }}>
                {['Name', 'Description', 'Type'].map((h, i) => (
                  <th key={h} style={{
                    padding: '8px 10px', textAlign: 'left',
                    color: 'var(--parch)', fontSize: 11,
                    fontWeight: 'bold', letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    width: i === 0 ? 160 : i === 2 ? 120 : undefined,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.name} style={{
                  borderBottom: '1px solid rgba(201,168,76,0.1)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                }}>
                  <td style={{ padding: '8px 10px', verticalAlign: 'top', fontWeight: 'bold', color: 'var(--gold2)' }}>
                    {hl(a.name, searchTerm)}
                  </td>
                  <td style={{ padding: '8px 10px', verticalAlign: 'top', color: 'var(--parch2)', lineHeight: 1.5 }}>
                    {hl(a.desc, searchTerm)}
                  </td>
                  <td style={{ padding: '8px 10px', verticalAlign: 'top' }}>
                    <TypeBadge type={a.type} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
