import { useVersion }         from '../../context/VersionContext'
import VersionBadge           from '../ui/VersionBadge'
import { COMBAT_RULES_2014 }  from '../../data/combatRules2014'
import { COMBAT_RULES_2024 }  from '../../data/combatRules2024'

const CAT_COLORS = {
  'Death & Dying':  'rgba(139,0,0,0.5)',
  'Spellcasting':   'rgba(80,20,120,0.5)',
  'Cover':          'rgba(20,60,140,0.5)',
  'Movement':       'rgba(30,100,30,0.5)',
  'Initiative':     'rgba(180,120,0,0.5)',
  'Special Attacks':'rgba(100,50,0,0.5)',
}

function hl(text, term) {
  if (!term) return text
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) => re.test(part) ? <mark key={i}>{part}</mark> : part)
}

export default function CombatRules({ searchTerm }) {
  const { getTabVersion } = useVersion()
  const version = getTabVersion('combat')

  const COMBAT_RULES = version === '2024' ? COMBAT_RULES_2024 : COMBAT_RULES_2014

  const filtered = COMBAT_RULES.filter(r =>
    !searchTerm || [r.name, r.desc, r.cat].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const categories = [...new Set(COMBAT_RULES.map(r => r.cat))]

  if (filtered.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontStyle: 'italic' }}>
        No combat rules match &ldquo;{searchTerm}&rdquo;
      </div>
    )
  }

  return (
    <div>
      {categories.map((cat, catIdx) => {
        const rules = filtered.filter(r => r.cat === cat)
        if (!rules.length) return null
        return (
          <div key={cat}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              margin: '1.25rem 0 0.75rem', paddingBottom: 6,
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {cat}
              </span>
              {catIdx === 0 && (
                <span style={{ marginLeft: 'auto' }}>
                  <VersionBadge tabId="combat" />
                </span>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 10,
            }}>
              {rules.map(r => (
                <div key={r.name} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: 6, padding: 12,
                  borderTop: `3px solid ${CAT_COLORS[cat] || 'var(--gold)'}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold2)', marginBottom: 6 }}>
                    {hl(r.name, searchTerm)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--parch2)', lineHeight: 1.6 }}>
                    {hl(r.desc, searchTerm)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
