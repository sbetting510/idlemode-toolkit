import { useVersion }    from '../../context/VersionContext'
import VersionBadge     from '../ui/VersionBadge'
import { SAVES_2014, DCS_2014 } from '../../data/saves2014'
import { SAVES_2024, DCS_2024 } from '../../data/saves2024'

function dcColor(dc) {
  if (dc <= 10) return '#90c870'
  if (dc <= 15) return 'var(--gold)'
  if (dc <= 20) return '#f5c842'
  if (dc <= 25) return '#f09595'
  return '#d090f8'
}

function hl(text, term) {
  if (!term) return text
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) => re.test(part) ? <mark key={i}>{part}</mark> : part)
}

function SectionHeader({ title, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      margin: '1.25rem 0 0.75rem', paddingBottom: 6,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {title}
      </span>
      {children && <span style={{ marginLeft: 'auto' }}>{children}</span>}
    </div>
  )
}

export default function SavesDCs({ searchTerm }) {
  const { getTabVersion } = useVersion()
  const version = getTabVersion('saves')

  const SAVES = version === '2024' ? SAVES_2024 : SAVES_2014
  const DCS   = version === '2024' ? DCS_2024   : DCS_2014

  const filteredSaves = SAVES.filter(s =>
    !searchTerm || [s.ability, s.triggers].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  const filteredDCs = DCS.filter(d =>
    !searchTerm || [d.label, d.example, String(d.dc)].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (!filteredSaves.length && !filteredDCs.length) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontStyle: 'italic' }}>
        No saves or DCs match &ldquo;{searchTerm}&rdquo;
      </div>
    )
  }

  return (
    <div>
      {filteredSaves.length > 0 && (
        <>
          <SectionHeader title="Saving throw triggers">
            <VersionBadge tabId="saves" />
          </SectionHeader>
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 400 }}>
              <thead>
                <tr style={{ background: 'var(--crimson)' }}>
                  {['Ability', 'Common triggers', 'Typical DC'].map((h, i) => (
                    <th key={h} style={{
                      padding: '8px 10px', textAlign: 'left',
                      color: 'var(--parch)', fontSize: 11,
                      fontWeight: 'bold', letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      width: i === 0 ? 120 : i === 2 ? 100 : undefined,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSaves.map((s, i) => (
                  <tr key={s.ability} style={{
                    borderBottom: '1px solid rgba(201,168,76,0.1)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)',
                  }}>
                    <td style={{ padding: '8px 10px', fontWeight: 'bold', color: 'var(--gold2)' }}>
                      {hl(s.ability, searchTerm)}
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--parch2)', lineHeight: 1.5 }}>
                      {hl(s.triggers, searchTerm)}
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--gold)', textAlign: 'center', fontFamily: 'sans-serif' }}>
                      {s.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {filteredDCs.length > 0 && (
        <>
          <SectionHeader title="Difficulty class reference" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}>
            {filteredDCs.map(d => (
              <div key={d.dc} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 6, padding: 10,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 'bold', color: dcColor(d.dc) }}>
                  DC {d.dc}
                </div>
                <div style={{ fontSize: 11, color: 'var(--parch2)', marginTop: 2, fontFamily: 'sans-serif' }}>
                  {hl(d.label, searchTerm)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
                  {hl(d.example, searchTerm)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
