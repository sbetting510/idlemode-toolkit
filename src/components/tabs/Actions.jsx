const ACTIONS = [
    { name: 'Action', type: 'action', desc: 'Attack, cast a spell, dash, disengage, dodge, help, hide, ready, search, or use an object. One per turn unless a feature grants more.', notes: 'One per turn' },
    { name: 'Bonus action', type: 'bonus', desc: 'Requires a class feature, spell, or item that specifically uses a bonus action. One per turn.', notes: 'Requires a feature' },
    { name: 'Reaction', type: 'reaction', desc: 'Triggered by a specific event (e.g. opportunity attack, Shield spell). Resets at start of your turn.', notes: 'Resets each turn' },
    { name: 'Free action', type: 'free', desc: 'Drop an item, speak a few words, open an unlocked door, draw a weapon as part of an attack.', notes: 'No cost' },
    { name: 'Move', type: 'move', desc: 'Move up to your speed. You can split movement before and after your action.', notes: 'Up to your speed' },
    { name: 'Dash', type: 'action', desc: 'Gain extra movement equal to your speed this turn.', notes: 'Uses Action' },
    { name: 'Disengage', type: 'action', desc: "Your movement doesn't provoke opportunity attacks for the rest of the turn.", notes: 'Uses Action' },
    { name: 'Dodge', type: 'action', desc: 'Until your next turn, attacks against you have disadvantage (if you can see the attacker) and you have advantage on Dex saves.', notes: 'Uses Action' },
    { name: 'Help', type: 'action', desc: 'Give an adjacent ally advantage on their next ability check or attack roll against a creature within 5 ft.', notes: 'Uses Action' },
    { name: 'Hide', type: 'action', desc: "Attempt a Stealth check. On success you are hidden; creatures can't target you unless they find you.", notes: 'Uses Action' },
    { name: 'Ready', type: 'action', desc: 'Declare a trigger and a reaction. When triggered, you can use your reaction to perform the readied action.', notes: 'Uses Action' },
    { name: 'Opportunity attack', type: 'reaction', desc: 'When a hostile creature you can see moves out of your reach, use your reaction to make one melee attack.', notes: 'Reaction trigger' },
    { name: 'Stand up (prone)', type: 'move', desc: 'Costs half your movement speed to stand up from prone.', notes: 'Costs half move' },
    { name: 'Offhand attack', type: 'bonus', desc: "When you Attack with a light melee weapon, use a bonus action to attack with a second light melee weapon. Don't add ability mod to damage unless negative.", notes: 'Two-Weapon Fighting' },
  ]
  
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
          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto', fontFamily: 'sans-serif' }}>
            {filtered.length} / {ACTIONS.length}
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