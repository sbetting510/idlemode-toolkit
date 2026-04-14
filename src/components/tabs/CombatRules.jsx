const COMBAT_RULES = [
    { name: 'Death saving throws', desc: 'Roll d20 each turn at 0 HP. 10+ = success, 9− = failure. 3 successes = stable. 3 failures = dead. Roll of 1 = 2 failures. Roll of 20 = regain 1 HP.', cat: 'Death & Dying' },
    { name: 'Stabilizing', desc: 'Use an action to make DC 10 Medicine check on a 0 HP creature to stabilize it. Any healing also stabilizes. A stable creature regains 1 HP after 1d4 hours.', cat: 'Death & Dying' },
    { name: 'Concentration', desc: 'You can concentrate on one spell at a time. Taking damage requires a Con save (DC = max(10, half damage taken)). Being incapacitated or killed ends it instantly.', cat: 'Spellcasting' },
    { name: 'Casting in melee', desc: 'Being within 5 ft of a hostile creature does not impose disadvantage on spell attack rolls. Ranged spell attacks do have disadvantage if a hostile creature is within 5 ft.', cat: 'Spellcasting' },
    { name: 'Half cover', desc: '+2 bonus to AC and Dex saves. Provided by a low wall, large furniture, or another creature.', cat: 'Cover' },
    { name: 'Three-quarters cover', desc: '+5 bonus to AC and Dex saves. Provided by a portcullis, arrow slit, or thick tree trunk.', cat: 'Cover' },
    { name: 'Full cover', desc: "Can't be targeted directly by attacks or spells. Provided by complete concealment — a wall, closed door, etc.", cat: 'Cover' },
    { name: 'Difficult terrain', desc: 'Costs 1 extra foot of movement per foot traveled. Rubble, deep snow, shallow water, dense forest, etc.', cat: 'Movement' },
    { name: 'Falling', desc: '1d6 bludgeoning damage per 10 ft fallen, max 20d6. Land prone unless you avoid damage somehow.', cat: 'Movement' },
    { name: 'Climbing & swimming', desc: 'Each foot costs 1 extra foot of movement unless you have the appropriate speed.', cat: 'Movement' },
    { name: 'Surprise', desc: "If surprised, you can't move or take an action on your first turn, and can't take reactions until that turn ends.", cat: 'Initiative' },
    { name: 'Initiative', desc: 'Roll d20 + Dex modifier at the start of combat. Higher results act first. Ties broken by higher Dex modifier.', cat: 'Initiative' },
    { name: 'Grappling', desc: 'Use the Attack action: Strength (Athletics) vs target\'s Athletics or Acrobatics. On success, target is grappled (speed 0).', cat: 'Special Attacks' },
    { name: 'Shoving', desc: "Use the Attack action: Strength (Athletics) vs target's Athletics or Acrobatics. On success, knock prone or push 5 ft.", cat: 'Special Attacks' },
    { name: 'Two-weapon fighting', desc: "When you Attack with a light melee weapon, use a bonus action to attack with a different light melee weapon. Don't add ability mod to bonus attack damage unless negative.", cat: 'Special Attacks' },
    { name: 'Flanking (optional)', desc: 'When you and an ally are on opposite sides of an enemy, you both have advantage on melee attacks against it. DM decides whether to use this rule.', cat: 'Special Attacks' },
  ]
  
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
        {categories.map(cat => {
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