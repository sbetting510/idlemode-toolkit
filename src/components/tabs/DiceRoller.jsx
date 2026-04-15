import { useState } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────

const DICE = [4, 6, 8, 10, 12, 20, 100]

const ABILITIES = [
  { id: 'str', label: 'Strength',     abbr: 'STR' },
  { id: 'dex', label: 'Dexterity',    abbr: 'DEX' },
  { id: 'con', label: 'Constitution', abbr: 'CON' },
  { id: 'int', label: 'Intelligence', abbr: 'INT' },
  { id: 'wis', label: 'Wisdom',       abbr: 'WIS' },
  { id: 'cha', label: 'Charisma',     abbr: 'CHA' },
]

const ROLL_TYPES = [
  { id: 'custom',     label: 'Custom'        },
  { id: 'ability',    label: 'Ability Check' },
  { id: 'attack',     label: 'Attack Roll'   },
  { id: 'saving',     label: 'Saving Throw'  },
  { id: 'skill',      label: 'Skill Check'   },
  { id: 'initiative', label: 'Initiative'    },
  { id: 'death',      label: 'Death Save'    },
]

// Roll types that always use a single d20
const D20_TYPES = new Set(['ability', 'attack', 'saving', 'skill', 'initiative', 'death'])

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1
}

function abilityMod(score) {
  return Math.floor((score - 10) / 2)
}

function profBonus(level) {
  // 1-4 → +2, 5-8 → +3, 9-12 → +4, 13-16 → +5, 17-20 → +6
  return Math.floor((level - 1) / 4) + 2
}

function signed(n) {
  return n >= 0 ? `+${n}` : `${n}`
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Shared sub-components ───────────────────────────────────────────────────

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

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, color: 'var(--muted)', marginBottom: 5,
      fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {children}
    </div>
  )
}

function DieBadge({ value, sides, isDropped }) {
  const isNat20 = sides === 20 && value === 20
  const isNat1  = sides === 20 && value === 1
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 40, height: 40, padding: '0 8px', borderRadius: 6,
      background: isDropped     ? 'rgba(255,255,255,0.03)'
                : isNat20       ? 'rgba(201,168,76,0.22)'
                : isNat1        ? 'rgba(139,0,0,0.3)'
                :                 'rgba(255,255,255,0.08)',
      border:    isDropped      ? '1px solid rgba(255,255,255,0.08)'
               : isNat20        ? '1.5px solid var(--gold)'
               : isNat1         ? '1.5px solid rgba(200,60,60,0.8)'
               :                  '1px solid var(--border2)',
      color:     isDropped      ? 'var(--muted)'
               : isNat20        ? 'var(--gold2)'
               : isNat1         ? '#f09595'
               :                  'var(--parch)',
      fontSize: 15, fontWeight: 'bold',
      textDecoration: isDropped ? 'line-through' : 'none',
      opacity: isDropped ? 0.45 : 1,
      flexShrink: 0,
    }}>
      {value}
    </span>
  )
}

// +/− counter stepper
function Stepper({ value, min, max, onChange, display }) {
  const btnBase = {
    width: 30, height: 34, fontSize: 16, cursor: 'pointer', lineHeight: 1,
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border2)',
    color: 'var(--parch)',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ ...btnBase, borderRight: 'none', borderRadius: '5px 0 0 5px' }}
      >−</button>
      <div style={{
        minWidth: 48, height: 34, padding: '0 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border2)',
        color: 'var(--gold)', fontWeight: 'bold', fontSize: 14,
      }}>
        {display ?? value}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ ...btnBase, borderLeft: 'none', borderRadius: '0 5px 5px 0' }}
      >+</button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DiceRoller() {
  // Die config (custom roll type only)
  const [selectedDie, setSelectedDie] = useState(20)
  const [qty, setQty]                 = useState(1)

  // Advantage / disadvantage — applies whenever die is d20 qty=1
  const [advantage, setAdvantage] = useState('normal')

  // Roll type
  const [rollType, setRollType] = useState('custom')

  // Custom fields
  const [flatMod, setFlatMod] = useState(0)

  // Ability-based fields
  const [ability, setAbility]           = useState('str')
  const [abilityScore, setAbilityScore] = useState(10)

  // Character level (drives prof bonus)
  const [level, setLevel] = useState(1)

  // Proficiency / expertise toggles
  const [proficient, setProficient] = useState(false)
  const [expertise,  setExpertise]  = useState(false)

  // Result state
  const [lastRoll, setLastRoll] = useState(null)
  const [history,  setHistory]  = useState([])

  // ── Derived values ──────────────────────────────────────────────────────────

  const useD20  = D20_TYPES.has(rollType)
  const activeDie = useD20 ? 20 : selectedDie
  const activeQty = useD20 ? 1  : qty
  const showAdv   = activeDie === 20 && activeQty === 1
  const curProf   = profBonus(level)

  // Returns { total, parts: [{label, value}] }
  function getModBreakdown() {
    if (rollType === 'custom') {
      return {
        total: flatMod,
        parts: flatMod !== 0 ? [{ label: 'modifier', value: flatMod }] : [],
      }
    }
    if (rollType === 'death') {
      return { total: 0, parts: [] }
    }

    const abilityKey = rollType === 'initiative' ? 'dex' : ability
    const ab  = ABILITIES.find(a => a.id === abilityKey)
    const mod = abilityMod(abilityScore)
    const parts = [{ label: ab.abbr, value: mod }]

    if (rollType === 'attack') {
      parts.push({ label: 'prof', value: curProf })
      return { total: mod + curProf, parts }
    }
    if (rollType === 'saving') {
      if (proficient) {
        parts.push({ label: 'prof', value: curProf })
        return { total: mod + curProf, parts }
      }
      return { total: mod, parts }
    }
    if (rollType === 'skill') {
      if (expertise) {
        const ep = curProf * 2
        parts.push({ label: 'expertise', value: ep })
        return { total: mod + ep, parts }
      }
      if (proficient) {
        parts.push({ label: 'prof', value: curProf })
        return { total: mod + curProf, parts }
      }
      return { total: mod, parts }
    }
    // ability check or initiative
    return { total: mod, parts }
  }

  function buildFormula(advMode) {
    const { total: modTotal } = getModBreakdown()
    const av = advMode ?? (showAdv ? advantage : 'normal')
    let base = useD20 ? 'd20' : `${qty}d${selectedDie}`
    if (av === 'advantage')    base += ' (Adv)'
    if (av === 'disadvantage') base += ' (Dis)'
    const modStr   = modTotal !== 0 ? ` ${signed(modTotal)}` : ''
    const typeLabel = ROLL_TYPES.find(t => t.id === rollType).label
    return rollType === 'custom' ? `${base}${modStr}` : `${typeLabel}: ${base}${modStr}`
  }

  // ── Roll logic ──────────────────────────────────────────────────────────────

  function pushEntry(entry) {
    setLastRoll(entry)
    setHistory(prev => [entry, ...prev].slice(0, 10))
  }

  function executeRoll(die, count, advMode, formula, modTotal, modParts, isDeathSave) {
    let rolls = []
    let keptIdx = null

    if (die === 20 && count === 1 && advMode !== 'normal') {
      const r1 = rollDie(20), r2 = rollDie(20)
      rolls = [r1, r2]
      keptIdx = advMode === 'advantage'
        ? (r1 >= r2 ? 0 : 1)
        : (r1 <= r2 ? 0 : 1)
    } else {
      rolls = Array.from({ length: count }, () => rollDie(die))
    }

    const keptRolls = keptIdx !== null ? [rolls[keptIdx]] : rolls
    const rollSum   = keptRolls.reduce((a, b) => a + b, 0)
    const total     = rollSum + modTotal

    // For single d20 results only
    const singleKept = keptRolls.length === 1 ? keptRolls[0] : null
    const nat20 = die === 20 && singleKept === 20
    const nat1  = die === 20 && singleKept === 1

    let deathResult = null
    if (isDeathSave) {
      deathResult = nat20     ? 'Critical — Regain 1 HP!'
                  : nat1      ? 'Critical Fail — Two Failures'
                  : total >= 10 ? 'Success'
                  :               'Failure'
    }

    pushEntry({
      id: Date.now(), die, rolls, keptIdx, total, formula,
      modParts, modTotal, nat20, nat1, deathResult, time: new Date(),
    })
  }

  function doMainRoll() {
    const advMode = showAdv ? advantage : 'normal'
    const { total: modTotal, parts: modParts } = getModBreakdown()
    executeRoll(
      activeDie, activeQty, advMode,
      buildFormula(advMode),
      modTotal, modParts,
      rollType === 'death',
    )
  }

  // Quick roll strip — no modifiers, no roll-type state
  function doQuickRoll(die, count, advMode, formula) {
    executeRoll(die, count, advMode, formula, 0, [], false)
  }

  // ── Derived display values ──────────────────────────────────────────────────

  const { total: modTotal, parts: modParts } = getModBreakdown()
  const currentFormula = buildFormula()
  const currentAbMod   = abilityMod(abilityScore)

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* ════════════════ QUICK ROLL STRIP ════════════════ */}
      <SectionHeader title="Quick Rolls" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          { label: 'd20',    die: 20, count: 1, adv: 'normal',       formula: 'd20'       },
          { label: 'Adv',    die: 20, count: 1, adv: 'advantage',    formula: 'd20 (Adv)' },
          { label: 'Dis',    die: 20, count: 1, adv: 'disadvantage', formula: 'd20 (Dis)' },
          { label: 'd6 dmg', die: 6,  count: 1, adv: 'normal',       formula: 'd6 damage' },
          { label: 'd8 dmg', die: 8,  count: 1, adv: 'normal',       formula: 'd8 damage' },
        ].map(q => (
          <button
            key={q.label}
            onClick={() => doQuickRoll(q.die, q.count, q.adv, q.formula)}
            style={{
              padding: '7px 14px', height: 36,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border2)',
              borderRadius: 6, color: 'var(--parch2)',
              fontFamily: 'Georgia, serif', fontSize: 13, cursor: 'pointer',
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* ════════════════ ROLL TYPE ════════════════ */}
      <SectionHeader title="Roll Type" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {ROLL_TYPES.map(t => {
          const active = rollType === t.id
          return (
            <button
              key={t.id}
              onClick={() => setRollType(t.id)}
              style={{
                padding: '6px 12px',
                background: active ? 'var(--crimson)' : 'rgba(255,255,255,0.04)',
                border: active ? '1.5px solid var(--gold)' : '1px solid var(--border2)',
                borderRadius: 6,
                color: active ? 'var(--gold)' : 'var(--parch2)',
                fontFamily: 'Georgia, serif', fontSize: 12,
                fontWeight: active ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ════════════════ CONFIGURATION ════════════════ */}
      <SectionHeader title="Configuration" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Die picker — Custom only */}
        {rollType === 'custom' && (
          <div>
            <FieldLabel>Die Type</FieldLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {DICE.map(sides => {
                const active = selectedDie === sides
                return (
                  <button
                    key={sides}
                    onClick={() => setSelectedDie(sides)}
                    style={{
                      padding: '7px 0', width: 54,
                      background: active ? 'var(--crimson)' : 'rgba(255,255,255,0.05)',
                      border: active ? '1.5px solid var(--gold)' : '1px solid var(--border2)',
                      borderRadius: 6,
                      color: active ? 'var(--gold)' : 'var(--parch2)',
                      fontSize: 13, fontWeight: 'bold', fontFamily: 'Georgia, serif',
                      cursor: 'pointer',
                    }}
                  >
                    d{sides}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked d20 badge — non-custom types */}
        {rollType !== 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              padding: '5px 16px',
              background: 'rgba(201,168,76,0.1)',
              border: '1.5px solid var(--gold)',
              borderRadius: 6, color: 'var(--gold)',
              fontSize: 14, fontWeight: 'bold', fontFamily: 'Georgia, serif',
            }}>d20</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
              {rollType === 'death'
                ? 'DC 10 · Nat 20 → Regain 1 HP · Nat 1 → Two Failures'
                : 'always d20 for this roll type'}
            </span>
          </div>
        )}

        {/* Quantity — Custom only */}
        {rollType === 'custom' && (
          <div>
            <FieldLabel>Quantity</FieldLabel>
            <Stepper value={qty} min={1} max={10} onChange={setQty} />
          </div>
        )}

        {/* Advantage / Disadvantage — any d20 */}
        {showAdv && (
          <div>
            <FieldLabel>d20 Mode</FieldLabel>
            <div style={{
              display: 'inline-flex', borderRadius: 6, overflow: 'hidden',
              border: '1px solid var(--border2)',
            }}>
              {[
                { id: 'disadvantage', label: 'Disadvantage', activeColor: '#f09595',      activeBg: 'rgba(139,0,0,0.4)'       },
                { id: 'normal',       label: 'Normal',       activeColor: 'var(--parch2)', activeBg: 'rgba(201,168,76,0.12)'   },
                { id: 'advantage',    label: 'Advantage',    activeColor: '#90c870',       activeBg: 'rgba(30,100,30,0.4)'     },
              ].map((opt, i, arr) => {
                const active = advantage === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAdvantage(opt.id)}
                    style={{
                      padding: '6px 14px', height: 34,
                      background: active ? opt.activeBg : 'rgba(255,255,255,0.04)',
                      border: 'none',
                      borderRight: i < arr.length - 1 ? '1px solid var(--border2)' : 'none',
                      color: active ? opt.activeColor : 'var(--muted)',
                      fontFamily: 'Georgia, serif', fontSize: 12,
                      fontWeight: active ? 'bold' : 'normal',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Ability selector — ability, attack, saving, skill */}
        {['ability', 'attack', 'saving', 'skill'].includes(rollType) && (
          <div>
            <FieldLabel>Ability</FieldLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {ABILITIES.map(ab => {
                const active = ability === ab.id
                return (
                  <button
                    key={ab.id}
                    onClick={() => setAbility(ab.id)}
                    style={{
                      padding: '5px 10px',
                      background: active ? 'rgba(201,168,76,0.14)' : 'rgba(255,255,255,0.04)',
                      border: active ? '1px solid var(--gold)' : '1px solid var(--border2)',
                      borderRadius: 5,
                      color: active ? 'var(--gold)' : 'var(--parch2)',
                      fontFamily: 'Georgia, serif', fontSize: 12,
                      fontWeight: active ? 'bold' : 'normal',
                      cursor: 'pointer',
                    }}
                  >
                    {ab.abbr}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Ability / Dex score + computed modifier */}
        {['ability', 'attack', 'saving', 'skill', 'initiative'].includes(rollType) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <FieldLabel>
                {rollType === 'initiative' ? 'Dexterity Score' : 'Ability Score'}
              </FieldLabel>
              <Stepper
                value={abilityScore}
                min={1} max={30}
                onChange={setAbilityScore}
              />
            </div>
            <div style={{
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
                modifier
              </span>
              <span style={{
                fontSize: 18, fontWeight: 'bold', lineHeight: 1,
                color: currentAbMod >= 0 ? '#90c870' : '#f09595',
              }}>
                {signed(currentAbMod)}
              </span>
            </div>
          </div>
        )}

        {/* Character level + computed prof bonus */}
        {['attack', 'saving', 'skill'].includes(rollType) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <FieldLabel>Character Level</FieldLabel>
              <Stepper value={level} min={1} max={20} onChange={setLevel} />
            </div>
            <div style={{
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
                prof bonus
              </span>
              <span style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 1, color: 'var(--gold)' }}>
                +{curProf}
              </span>
            </div>
          </div>
        )}

        {/* Proficient / Expertise toggles */}
        {(rollType === 'saving' || rollType === 'skill') && (
          <div>
            <FieldLabel>Proficiency</FieldLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const next = !proficient
                  setProficient(next)
                  if (!next) setExpertise(false)
                }}
                style={{
                  padding: '6px 16px',
                  background: proficient ? 'rgba(201,168,76,0.14)' : 'rgba(255,255,255,0.04)',
                  border: proficient ? '1px solid var(--gold)' : '1px solid var(--border2)',
                  borderRadius: 6,
                  color: proficient ? 'var(--gold)' : 'var(--muted)',
                  fontFamily: 'Georgia, serif', fontSize: 13,
                  fontWeight: proficient ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                Proficient {proficient && `(${signed(curProf)})`}
              </button>
              {rollType === 'skill' && (
                <button
                  onClick={() => {
                    const next = !expertise
                    setExpertise(next)
                    if (next) setProficient(true)
                  }}
                  style={{
                    padding: '6px 16px',
                    background: expertise ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                    border: expertise ? '1px solid var(--gold2)' : '1px solid var(--border2)',
                    borderRadius: 6,
                    color: expertise ? 'var(--gold2)' : 'var(--muted)',
                    fontFamily: 'Georgia, serif', fontSize: 13,
                    fontWeight: expertise ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  Expertise {expertise && `(${signed(curProf * 2)})`}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Flat modifier — Custom only */}
        {rollType === 'custom' && (
          <div>
            <FieldLabel>Modifier</FieldLabel>
            <Stepper
              value={flatMod}
              min={-20} max={20}
              onChange={setFlatMod}
              display={flatMod === 0 ? '0' : flatMod > 0 ? `+${flatMod}` : `${flatMod}`}
            />
          </div>
        )}

        {/* Modifier summary pill (non-custom, non-zero) */}
        {rollType !== 'custom' && modParts.length > 0 && (
          <div style={{
            display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
            padding: '7px 12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: 6, alignSelf: 'flex-start',
          }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>Total modifier:</span>
            {modParts.map((p, i) => (
              <span key={i} style={{ fontSize: 12, fontFamily: 'sans-serif', color: p.value >= 0 ? '#90c870' : '#f09595' }}>
                {signed(p.value)}<span style={{ color: 'var(--muted)' }}> ({p.label})</span>
                {i < modParts.length - 1 && <span style={{ color: 'var(--muted)' }}> +</span>}
              </span>
            ))}
            <span style={{ fontSize: 15, fontWeight: 'bold', color: 'var(--gold)', marginLeft: 2 }}>
              = {signed(modTotal)}
            </span>
          </div>
        )}
      </div>

      {/* ════════════════ ROLL BUTTON ════════════════ */}
      <div style={{ marginTop: '1.25rem' }}>
        <button
          onClick={doMainRoll}
          style={{
            padding: '10px 28px',
            background: 'var(--crimson)',
            border: '1.5px solid var(--gold)',
            borderRadius: 7,
            color: 'var(--gold)', fontFamily: 'Georgia, serif',
            fontSize: 15, fontWeight: 'bold',
            cursor: 'pointer', letterSpacing: '0.03em',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#a00000'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--crimson)'}
        >
          Roll — {currentFormula}
        </button>
      </div>

      {/* ════════════════ RESULT ════════════════ */}
      {lastRoll && (
        <>
          <SectionHeader title="Result" />
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: lastRoll.nat20 ? '1.5px solid var(--gold)'
                  : lastRoll.nat1  ? '1.5px solid rgba(200,60,60,0.7)'
                  :                  '1px solid var(--border2)',
            borderRadius: 8, padding: '1rem 1.25rem',
          }}>
            {/* Formula label */}
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, fontFamily: 'sans-serif' }}>
              {lastRoll.formula}
            </div>

            {/* Individual dice */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {lastRoll.rolls.map((val, i) => (
                <DieBadge
                  key={i}
                  value={val}
                  sides={lastRoll.die}
                  isDropped={lastRoll.keptIdx !== null && i !== lastRoll.keptIdx}
                />
              ))}
            </div>

            {/* Modifier breakdown */}
            {lastRoll.modParts.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>modifier:</span>
                {lastRoll.modParts.map((p, i) => (
                  <span key={i} style={{ fontSize: 12, fontFamily: 'sans-serif' }}>
                    <span style={{ color: p.value >= 0 ? '#90c870' : '#f09595' }}>{signed(p.value)}</span>
                    <span style={{ color: 'var(--muted)' }}> ({p.label})</span>
                    {i < lastRoll.modParts.length - 1 && <span style={{ color: 'var(--muted)' }}> +</span>}
                  </span>
                ))}
              </div>
            )}

            {/* Total + critical / death result */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 42, fontWeight: 'bold', lineHeight: 1,
                color: lastRoll.nat20 ? 'var(--gold2)'
                     : lastRoll.nat1  ? '#f09595'
                     :                  'var(--parch)',
              }}>
                {lastRoll.total}
              </span>
              {lastRoll.nat20 && (
                <span style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 'bold' }}>
                  ★ Natural 20!
                </span>
              )}
              {lastRoll.nat1 && !lastRoll.nat20 && (
                <span style={{ fontSize: 14, color: '#f09595', fontWeight: 'bold' }}>
                  ✗ Natural 1
                </span>
              )}
              {lastRoll.deathResult && (
                <span style={{
                  fontSize: 15, fontWeight: 'bold',
                  color: lastRoll.deathResult.startsWith('Success') || lastRoll.deathResult.startsWith('Critical —')
                    ? '#90c870' : '#f09595',
                }}>
                  {lastRoll.deathResult}
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {/* ════════════════ HISTORY ════════════════ */}
      {history.length > 0 && (
        <>
          <SectionHeader title="Roll History" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {history.map((entry, idx) => {
              const keptRolls = entry.keptIdx !== null ? [entry.rolls[entry.keptIdx]] : entry.rolls
              const rollSum   = keptRolls.reduce((a, b) => a + b, 0)
              const diceStr   = entry.rolls.map((v, i) =>
                entry.keptIdx !== null
                  ? (i === entry.keptIdx ? `[${v}]` : `${v}`)
                  : `${v}`
              ).join(', ')

              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', gap: 10, borderRadius: 5,
                    background: idx === 0 ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.03)',
                    border: idx === 0      ? '1px solid var(--border)'
                          : entry.nat20   ? '1px solid rgba(201,168,76,0.25)'
                          : entry.nat1    ? '1px solid rgba(200,60,60,0.25)'
                          :                 '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 12,
                        color: idx === 0 ? 'var(--gold)' : 'var(--parch2)',
                        fontWeight: idx === 0 ? 'bold' : 'normal',
                      }}>
                        {entry.formula}
                      </span>
                      {entry.nat20 && (
                        <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'sans-serif' }}>★ nat 20</span>
                      )}
                      {entry.nat1 && !entry.nat20 && (
                        <span style={{ fontSize: 10, color: '#f09595', fontFamily: 'sans-serif' }}>✗ nat 1</span>
                      )}
                      {entry.deathResult && (
                        <span style={{
                          fontSize: 10, fontFamily: 'sans-serif',
                          color: entry.deathResult.startsWith('Success') || entry.deathResult.startsWith('Critical —')
                            ? '#90c870' : '#f09595',
                        }}>
                          {entry.deathResult}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
                      [{diceStr}]
                      {(entry.rolls.length > 1 || entry.keptIdx !== null) && ` = ${rollSum}`}
                      {entry.modTotal !== 0 && ` ${signed(entry.modTotal)} mod`}
                      {' · '}{formatTime(entry.time)}
                    </span>
                  </div>
                  <span style={{
                    fontSize: idx === 0 ? 20 : 15,
                    fontWeight: 'bold',
                    flexShrink: 0,
                    color: entry.nat20  ? 'var(--gold2)'
                         : entry.nat1   ? '#f09595'
                         : idx === 0    ? 'var(--gold2)'
                         :                'var(--parch2)',
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
