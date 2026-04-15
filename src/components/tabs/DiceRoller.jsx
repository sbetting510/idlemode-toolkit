import { useState } from 'react'

const DICE = [4, 6, 8, 10, 12, 20, 100]

function roll(sides) {
  return Math.floor(Math.random() * sides) + 1
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

function DieResult({ value, sides, isKept, isDropped }) {
  const isMax = value === sides
  const isMin = value === 1
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 40, height: 40, borderRadius: 6,
      background: isDropped
        ? 'rgba(255,255,255,0.04)'
        : isMax
          ? 'rgba(201,168,76,0.2)'
          : isMin
            ? 'rgba(139,0,0,0.25)'
            : 'rgba(255,255,255,0.08)',
      border: isDropped
        ? '1px solid rgba(255,255,255,0.1)'
        : isMax
          ? '1px solid var(--gold)'
          : isMin
            ? '1px solid rgba(139,0,0,0.6)'
            : '1px solid var(--border2)',
      color: isDropped
        ? 'var(--muted)'
        : isMax
          ? 'var(--gold2)'
          : isMin
            ? '#f09595'
            : 'var(--parch)',
      fontSize: 15, fontWeight: 'bold',
      textDecoration: isDropped ? 'line-through' : 'none',
      opacity: isDropped ? 0.5 : 1,
      flexShrink: 0,
    }}>
      {value}
    </span>
  )
}

export default function DiceRoller() {
  const [selectedDie, setSelectedDie] = useState(20)
  const [qty, setQty] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [advantage, setAdvantage] = useState('normal') // 'normal' | 'advantage' | 'disadvantage'
  const [lastRoll, setLastRoll] = useState(null)
  const [history, setHistory] = useState([])

  function doRoll(overrideDie, overrideQty, label) {
    const sides = overrideDie ?? selectedDie
    const count = overrideQty ?? qty
    const mod = modifier

    let rolls = []
    let keptIndex = null

    if (sides === 20 && count === 1 && advantage !== 'normal' && !overrideDie) {
      const r1 = roll(20)
      const r2 = roll(20)
      rolls = [r1, r2]
      keptIndex = advantage === 'advantage'
        ? (r1 >= r2 ? 0 : 1)
        : (r1 <= r2 ? 0 : 1)
    } else {
      rolls = Array.from({ length: count }, () => roll(sides))
    }

    const keptRolls = keptIndex !== null ? [rolls[keptIndex]] : rolls
    const subtotal = keptRolls.reduce((a, b) => a + b, 0)
    const total = subtotal + mod

    let formula = label
      ? `${label}`
      : `${count}d${sides}`
    if (keptIndex !== null) {
      formula += advantage === 'advantage' ? ' (Adv)' : ' (Dis)'
    }
    if (mod !== 0) formula += mod > 0 ? ` +${mod}` : ` ${mod}`

    const entry = { rolls, keptIndex, sides, total, formula, timestamp: Date.now() }
    setLastRoll(entry)
    setHistory(prev => [entry, ...prev].slice(0, 10))
  }

  function quickRoll(type) {
    if (type === 'attack') {
      const sides = 20
      let rolls, keptIndex = null
      if (advantage !== 'normal') {
        const r1 = roll(20)
        const r2 = roll(20)
        rolls = [r1, r2]
        keptIndex = advantage === 'advantage'
          ? (r1 >= r2 ? 0 : 1)
          : (r1 <= r2 ? 0 : 1)
      } else {
        rolls = [roll(20)]
      }
      const keptRolls = keptIndex !== null ? [rolls[keptIndex]] : rolls
      const total = keptRolls[0] + modifier
      let formula = 'Attack Roll'
      if (keptIndex !== null) formula += advantage === 'advantage' ? ' (Adv)' : ' (Dis)'
      if (modifier !== 0) formula += modifier > 0 ? ` +${modifier}` : ` ${modifier}`
      const entry = { rolls, keptIndex, sides, total, formula, timestamp: Date.now() }
      setLastRoll(entry)
      setHistory(prev => [entry, ...prev].slice(0, 10))
    } else if (type === 'damage') {
      const sides = selectedDie === 20 || selectedDie === 100 ? 8 : selectedDie
      const rolls = Array.from({ length: qty }, () => roll(sides))
      const total = rolls.reduce((a, b) => a + b, 0) + modifier
      let formula = `Damage (${qty}d${sides})`
      if (modifier !== 0) formula += modifier > 0 ? ` +${modifier}` : ` ${modifier}`
      const entry = { rolls, keptIndex: null, sides, total, formula, timestamp: Date.now() }
      setLastRoll(entry)
      setHistory(prev => [entry, ...prev].slice(0, 10))
    } else if (type === 'death') {
      const r = roll(20)
      const rolls = [r]
      const total = r
      const result = r === 20 ? 'Crit — regain 1 HP!' : r === 1 ? 'Two failures!' : r >= 10 ? 'Success' : 'Failure'
      const formula = `Death Save → ${result}`
      const entry = { rolls, keptIndex: null, sides: 20, total, formula, timestamp: Date.now() }
      setLastRoll(entry)
      setHistory(prev => [entry, ...prev].slice(0, 10))
    }
  }

  const canShowAdvantage = selectedDie === 20 && qty === 1

  return (
    <div>
      {/* ── Die Selection ── */}
      <SectionHeader title="Select Die" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {DICE.map(sides => (
          <button
            key={sides}
            onClick={() => setSelectedDie(sides)}
            style={{
              padding: '8px 0', width: 60,
              background: selectedDie === sides
                ? 'var(--crimson)'
                : 'rgba(255,255,255,0.05)',
              border: selectedDie === sides
                ? '1.5px solid var(--gold)'
                : '1px solid var(--border2)',
              borderRadius: 6,
              color: selectedDie === sides ? 'var(--gold)' : 'var(--parch2)',
              fontSize: 14, fontWeight: 'bold', fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            d{sides}
          </button>
        ))}
      </div>

      {/* ── Controls ── */}
      <SectionHeader title="Roll Options" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>

        {/* Quantity */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quantity
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{
                width: 32, height: 36, background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border2)', borderRight: 'none',
                borderRadius: '6px 0 0 6px', color: 'var(--parch)',
                fontSize: 18, cursor: 'pointer', lineHeight: 1,
              }}
            >−</button>
            <div style={{
              width: 44, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border2)',
              color: 'var(--gold)', fontWeight: 'bold', fontSize: 15,
            }}>
              {qty}
            </div>
            <button
              onClick={() => setQty(q => Math.min(10, q + 1))}
              style={{
                width: 32, height: 36, background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border2)', borderLeft: 'none',
                borderRadius: '0 6px 6px 0', color: 'var(--parch)',
                fontSize: 18, cursor: 'pointer', lineHeight: 1,
              }}
            >+</button>
          </div>
        </div>

        {/* Modifier */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Modifier
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <button
              onClick={() => setModifier(m => m - 1)}
              style={{
                width: 32, height: 36, background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border2)', borderRight: 'none',
                borderRadius: '6px 0 0 6px', color: 'var(--parch)',
                fontSize: 18, cursor: 'pointer', lineHeight: 1,
              }}
            >−</button>
            <div style={{
              width: 52, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border2)',
              color: modifier === 0 ? 'var(--muted)' : modifier > 0 ? '#90c870' : '#f09595',
              fontWeight: 'bold', fontSize: 15,
            }}>
              {modifier > 0 ? `+${modifier}` : modifier}
            </div>
            <button
              onClick={() => setModifier(m => m + 1)}
              style={{
                width: 32, height: 36, background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border2)', borderLeft: 'none',
                borderRadius: '0 6px 6px 0', color: 'var(--parch)',
                fontSize: 18, cursor: 'pointer', lineHeight: 1,
              }}
            >+</button>
          </div>
        </div>

        {/* Advantage toggle — only relevant for d20 qty=1 */}
        {canShowAdvantage && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              d20 Mode
            </div>
            <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border2)' }}>
              {[
                { id: 'disadvantage', label: 'Dis', color: '#f09595' },
                { id: 'normal',       label: 'Normal', color: 'var(--parch2)' },
                { id: 'advantage',    label: 'Adv', color: '#90c870' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAdvantage(opt.id)}
                  style={{
                    padding: '6px 12px', height: 36,
                    background: advantage === opt.id
                      ? opt.id === 'advantage' ? 'rgba(30,100,30,0.4)' : opt.id === 'disadvantage' ? 'rgba(139,0,0,0.4)' : 'rgba(201,168,76,0.15)'
                      : 'rgba(255,255,255,0.04)',
                    border: 'none',
                    borderRight: opt.id !== 'advantage' ? '1px solid var(--border2)' : 'none',
                    color: advantage === opt.id ? opt.color : 'var(--muted)',
                    fontFamily: 'Georgia, serif', fontSize: 12,
                    fontWeight: advantage === opt.id ? 'bold' : 'normal',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Roll button */}
        <button
          onClick={() => doRoll()}
          style={{
            height: 36, padding: '0 28px',
            background: 'var(--crimson)',
            border: '1.5px solid var(--gold)',
            borderRadius: 6,
            color: 'var(--gold)', fontFamily: 'Georgia, serif',
            fontSize: 15, fontWeight: 'bold',
            cursor: 'pointer', letterSpacing: '0.04em',
            transition: 'background 0.15s',
            alignSelf: 'flex-end',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#a00000'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--crimson)'}
        >
          Roll {qty}d{selectedDie}{modifier !== 0 ? (modifier > 0 ? ` +${modifier}` : ` ${modifier}`) : ''}
        </button>
      </div>

      {/* ── Last Roll Result ── */}
      {lastRoll && (
        <>
          <SectionHeader title="Result" />
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border2)',
            borderRadius: 8, padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontFamily: 'sans-serif' }}>
              {lastRoll.formula}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {lastRoll.rolls.map((val, i) => (
                <DieResult
                  key={i}
                  value={val}
                  sides={lastRoll.sides}
                  isKept={lastRoll.keptIndex !== null && i === lastRoll.keptIndex}
                  isDropped={lastRoll.keptIndex !== null && i !== lastRoll.keptIndex}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 36, fontWeight: 'bold', color: 'var(--gold2)', lineHeight: 1 }}>
                {lastRoll.total}
              </span>
              {modifier !== 0 && (
                <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                  ({lastRoll.rolls
                    .filter((_, i) => lastRoll.keptIndex === null || i === lastRoll.keptIndex)
                    .reduce((a, b) => a + b, 0)}
                  {' '}{modifier > 0 ? `+${modifier}` : modifier})
                </span>
              )}
              {lastRoll.sides === 20 && (
                <span style={{
                  fontSize: 12, fontFamily: 'sans-serif',
                  color: lastRoll.total >= 20 + modifier ? 'var(--gold)' : lastRoll.total <= 1 + Math.min(modifier, 0) ? '#f09595' : 'transparent',
                }}>
                  {lastRoll.rolls.find((_, i) => lastRoll.keptIndex === null ? true : i === lastRoll.keptIndex) === 20
                    ? '★ Natural 20!'
                    : lastRoll.rolls.find((_, i) => lastRoll.keptIndex === null ? true : i === lastRoll.keptIndex) === 1
                      ? '✗ Natural 1'
                      : ''}
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Quick Rolls ── */}
      <SectionHeader title="Quick Rolls" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { id: 'attack', label: 'Attack Roll', sub: 'd20' + (canShowAdvantage && advantage !== 'normal' ? (advantage === 'advantage' ? ' Adv' : ' Dis') : '') },
          { id: 'damage', label: 'Damage', sub: `${qty}d${selectedDie === 20 || selectedDie === 100 ? 8 : selectedDie}` },
          { id: 'death',  label: 'Death Save', sub: 'd20' },
        ].map(q => (
          <button
            key={q.id}
            onClick={() => quickRoll(q.id)}
            style={{
              padding: '10px 18px',
              background: 'rgba(139,0,0,0.15)',
              border: '1px solid rgba(139,0,0,0.5)',
              borderRadius: 6,
              color: 'var(--parch2)', fontFamily: 'Georgia, serif',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,0,0,0.3)'; e.currentTarget.style.borderColor = 'var(--crimson)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,0,0,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,0,0,0.5)' }}
          >
            <div style={{ fontSize: 13, fontWeight: 'bold' }}>{q.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', marginTop: 2 }}>{q.sub}</div>
          </button>
        ))}
      </div>

      {/* ── History ── */}
      {history.length > 0 && (
        <>
          <SectionHeader title="Roll History" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {history.map((entry, idx) => {
              const keptRolls = entry.keptIndex !== null
                ? [entry.rolls[entry.keptIndex]]
                : entry.rolls
              const subtotal = keptRolls.reduce((a, b) => a + b, 0)
              const rollStr = entry.keptIndex !== null
                ? entry.rolls.map((v, i) => i === entry.keptIndex ? `[${v}]` : `${v}`).join(', ')
                : entry.rolls.join(', ')

              return (
                <div
                  key={entry.timestamp}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: idx === 0 ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.03)',
                    border: idx === 0 ? '1px solid var(--border)' : '1px solid transparent',
                    borderRadius: 5,
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: idx === 0 ? 'bold' : 'normal' }}>
                      {entry.formula}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                      [{rollStr}]{entry.rolls.length > 1 || entry.keptIndex !== null ? ` = ${subtotal}` : ''}
                    </span>
                  </div>
                  <span style={{
                    fontSize: idx === 0 ? 20 : 16,
                    fontWeight: 'bold',
                    color: idx === 0 ? 'var(--gold2)' : 'var(--parch2)',
                    flexShrink: 0,
                  }}>
                    {entry.total}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
