import { useState } from 'react'
import { CLASSES, SPELL_SLOT_TABLE } from '../../data/classes'

const TYPE_COLORS = {
  Feature:  { color: 'var(--parch2)', dot: 'var(--gold)'    },
  Subclass: { color: '#90c870',       dot: '#90c870'         },
  ASI:      { color: '#f5c842',       dot: '#f5c842'         },
  Capstone: { color: '#d090f8',       dot: '#d090f8'         },
}

function profBonus(level) {
  return level <= 4 ? 2 : level <= 8 ? 3 : level <= 12 ? 4 : level <= 16 ? 5 : 6
}

function ClassSelector({ classes, selected, onSelect }) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 6,
      marginBottom: '1rem',
    }}>
      {classes.map(cls => (
        <button
          key={cls.id}
          onClick={() => onSelect(cls.id)}
          style={{
            background: selected === cls.id ? cls.color : 'rgba(255,255,255,0.05)',
            border: `1px solid ${selected === cls.id ? cls.color : 'var(--border)'}`,
            borderRadius: 5,
            color: selected === cls.id ? '#f5f0e1' : 'var(--parch2)',
            fontFamily: 'Georgia, serif',
            fontSize: 12,
            padding: '5px 12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {cls.name}
        </button>
      ))}
    </div>
  )
}

function SectionHeader({ title }) {
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
    </div>
  )
}

function SpellSlotTable({ type, level }) {
  if (!type || !SPELL_SLOT_TABLE[type]) return null
  const slots = SPELL_SLOT_TABLE[type][level - 1]
  const hasSlots = slots.some(s => s > 0)
  if (!hasSlots) return (
    <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
      No spell slots at level {level}.
    </div>
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {slots.map((count, i) => count > 0 && (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)',
          borderRadius: 6, padding: '8px 14px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--gold)' }}>{count}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
            {i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : `${i+1}th`} level
          </div>
        </div>
      ))}
      {type === 'pact' && (
        <div style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center', fontStyle: 'italic' }}>
          Recharge on short or long rest
        </div>
      )}
    </div>
  )
}

export default function ClassSheets({ searchTerm }) {
  const [selectedClass, setSelectedClass] = useState('barbarian')
  const [level, setLevel] = useState(1)

  const cls = CLASSES.find(c => c.id === selectedClass)
  if (!cls) return null

  const prof = profBonus(level)
  const featuresAtOrBelow = cls.features.filter(f => f.level <= level)
  const featuresAbove     = cls.features.filter(f => f.level > level)
  const currentFeatures   = cls.features.filter(f => f.level === level)

  return (
    <div>
      {/* Class selector */}
      <ClassSelector
        classes={CLASSES}
        selected={selectedClass}
        onSelect={(id) => { setSelectedClass(id); setLevel(1) }}
      />

      {/* Class header */}
      <div style={{
        background: cls.color,
        borderRadius: 8, padding: '1rem 1.25rem',
        marginBottom: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: '#f5f0e1' }}>{cls.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(245,240,225,0.75)', marginTop: 2 }}>
            {cls.hitDie} hit die · {cls.primaryAbility} · Saves: {cls.savingThrows.join(', ')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(245,240,225,0.6)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proficiency</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: '#f5f0e1' }}>+{prof}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(245,240,225,0.6)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setLevel(l => Math.max(1, l - 1))}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,240,225,0.3)', borderRadius: 4, color: '#f5f0e1', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}
              >−</button>
              <span style={{ fontSize: 22, fontWeight: 'bold', color: '#f5f0e1', minWidth: 32, textAlign: 'center' }}>{level}</span>
              <button
                onClick={() => setLevel(l => Math.min(20, l + 1))}
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,240,225,0.3)', borderRadius: 4, color: '#f5f0e1', width: 28, height: 28, cursor: 'pointer', fontSize: 16 }}
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Level selector bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: '1rem' }}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            style={{
              width: 34, height: 30,
              background: l === level
                ? cls.color
                : l < level
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
              border: `1px solid ${l === level ? cls.color : l < level ? 'var(--border)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 4,
              color: l === level ? '#f5f0e1' : l < level ? 'var(--parch2)' : 'rgba(255,255,255,0.3)',
              fontSize: 12, fontFamily: 'sans-serif',
              cursor: 'pointer',
            }}
          >{l}</button>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Left column */}
        <div>
          {/* Ability priorities */}
          <SectionHeader title="Ability score priorities" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cls.abilityPriorities.map(a => (
              <div key={a.priority} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 5, padding: '8px 10px',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: cls.color, color: '#f5f0e1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 'bold', fontFamily: 'sans-serif',
                  flexShrink: 0,
                }}>{a.priority}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold2)' }}>{a.ability}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{a.reason}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Key resources */}
          <SectionHeader title={`Key resources at level ${level}`} />
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: cls.color }}>
                  {['Resource', 'Amount', 'Recharge'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: '#f5f0e1', fontSize: 11, fontWeight: 'bold', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cls.resources.map((r, i) => (
                  <tr key={r.name} style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 'bold', color: 'var(--gold2)' }}>{r.name}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--parch2)', fontFamily: 'sans-serif' }}>
                      {typeof r.formula === 'function' ? String(r.formula(level)) : r.formula}
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--muted)', fontSize: 12 }}>
                      {typeof r.recharge === 'function' ? r.recharge(level) : r.recharge}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action economy */}
          <SectionHeader title="Action economy" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cls.actionEconomy.map(a => (
              <div key={a.action} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 5, padding: '8px 10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold2)' }}>{a.action}</span>
                  <span style={{
                    fontSize: 10, fontFamily: 'sans-serif', fontWeight: 'bold',
                    padding: '1px 6px', borderRadius: 3,
                    background: 'rgba(139,0,0,0.4)', color: '#ff9999',
                    border: '1px solid rgba(139,0,0,0.6)',
                  }}>{a.type}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.notes}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Features at current level */}
          {currentFeatures.length > 0 && (
            <>
              <SectionHeader title={`New at level ${level}`} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '0.5rem' }}>
                {currentFeatures.map(f => {
                  const tc = TYPE_COLORS[f.type] || TYPE_COLORS.Feature
                  return (
                    <div key={f.name} style={{
                      background: 'rgba(201,168,76,0.08)',
                      border: `1px solid ${tc.dot}`,
                      borderRadius: 5, padding: '8px 10px',
                      borderLeft: `3px solid ${tc.dot}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 'bold', color: tc.dot }}>{f.name}</span>
                        <span style={{ fontSize: 10, color: tc.dot, fontFamily: 'sans-serif', opacity: 0.7 }}>{f.type}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--parch2)', lineHeight: 1.5 }}>{f.desc}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* All features list */}
          <SectionHeader title="Class features by level" />
          <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', maxHeight: 400, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr style={{ background: cls.color }}>
                  {['Lvl', 'Feature', 'Type'].map(h => (
                    <th key={h} style={{ padding: '7px 8px', textAlign: 'left', color: '#f5f0e1', fontSize: 10, fontWeight: 'bold', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cls.features.map((f, i) => {
                  const tc = TYPE_COLORS[f.type] || TYPE_COLORS.Feature
                  const isCurrent = f.level === level
                  const isPast    = f.level < level
                  return (
                    <tr key={`${f.level}-${f.name}`} style={{
                      borderBottom: '1px solid rgba(201,168,76,0.08)',
                      background: isCurrent
                        ? 'rgba(201,168,76,0.1)'
                        : isPast
                          ? 'transparent'
                          : 'transparent',
                      opacity: f.level > level ? 0.35 : 1,
                    }}>
                      <td style={{ padding: '6px 8px', fontWeight: 'bold', color: isCurrent ? cls.color : isPast ? 'var(--muted)' : 'var(--muted)', fontFamily: 'sans-serif', width: 32 }}>
                        {f.level}
                      </td>
                      <td style={{ padding: '6px 8px', color: isCurrent ? 'var(--gold2)' : isPast ? 'var(--parch2)' : 'var(--parch2)' }}>
                        {f.name}
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <span style={{ fontSize: 10, color: tc.dot, fontFamily: 'sans-serif' }}>{f.type}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Spell slots */}
          {cls.spellSlots && (
            <>
              <SectionHeader title={`Spell slots at level ${level}`} />
              <SpellSlotTable type={cls.spellSlots} level={level} />
            </>
          )}

          {/* Subclasses */}
          <SectionHeader title={`${cls.subclassName} options (choose at level ${cls.subclassLevel})`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cls.subclasses.map(s => (
              <div key={s.name} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 5, padding: '8px 10px',
                borderLeft: `3px solid ${cls.color}`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold2)', marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}