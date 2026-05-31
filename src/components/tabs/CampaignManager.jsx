import { useState } from 'react'
import { useCampaign } from '../../hooks/useCampaign'
import { printCharacter } from './CharacterBuilder'
import EncounterCalc from './EncounterCalc'
import { ABILITY_SHORT, ABILITY_LABELS, ABILITIES, SKILLS, PROF_BONUS, abilityMod, modStr, XP_LEVELS } from '../../data/characterData'

const MODULES = [
  { id: 'overview',   label: 'Overview',    icon: '⚔' },
  { id: 'characters', label: 'Characters',  icon: '🧙' },
  { id: 'sessions',   label: 'Sessions',    icon: '📖' },
  { id: 'encounters', label: 'Encounters',  icon: '⚔' },
  { id: 'loot',       label: 'Loot',        icon: '💰' },
  { id: 'npcs',       label: 'NPCs',        icon: '👥' },
  { id: 'quests',     label: 'Quests',      icon: '📜' },
  { id: 'spells',     label: 'Party Spells', icon: '✨' },
  { id: 'combat',     label: 'Combat',       icon: '⚔' },
]

const DISPOSITIONS = ['Friendly','Neutral','Hostile','Unknown']
const QUEST_STATUSES = ['Active','Completed','Failed','On Hold']
const QUEST_PRIORITIES = ['Critical','High','Medium','Low']
const ENCOUNTER_DIFFICULTIES = ['Trivial','Easy','Medium','Hard','Deadly']
const ENCOUNTER_OUTCOMES = ['Victory','Defeat','Fled','Ongoing','Avoided']
const LOOT_RARITIES = ['Common','Uncommon','Rare','Very Rare','Legendary','Artifact']
const LOOT_TYPES = ['Weapon','Armor','Potion','Scroll','Wondrous Item','Gold','Gem','Other']
const CHAR_STATUSES = ['Active','Inactive','Dead','Retired']

const sidebarStyle = {
  width: 160,
  flexShrink: 0,
  borderRight: '1px solid var(--border)',
  paddingRight: '0.75rem',
}

const contentStyle = {
  flex: 1,
  minWidth: 0,
}

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '0.75rem',
  marginBottom: 8,
}

const inputStyle = {
  width: '100%',
  background: '#1a1a2e',
  border: '1px solid var(--border2)',
  borderRadius: 5,
  color: '#f5f0e1',
  fontFamily: 'Georgia, serif',
  fontSize: 13,
  padding: '6px 10px',
  outline: 'none',
}

const selectStyle = {
  background: '#16213e',
  border: '1px solid var(--border2)',
  borderRadius: 5,
  color: '#f5f0e1',
  fontFamily: 'Georgia, serif',
  fontSize: 13,
  padding: '6px 8px',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
}

const btnPrimary = {
  background: 'var(--crimson)',
  border: '1px solid rgba(201,168,76,0.4)',
  borderRadius: 5,
  color: '#f5f0e1',
  fontFamily: 'Georgia, serif',
  fontSize: 13,
  padding: '6px 14px',
  cursor: 'pointer',
}

const btnGhost = {
  background: 'none',
  border: '1px solid var(--border)',
  borderRadius: 5,
  color: 'var(--muted)',
  fontFamily: 'Georgia, serif',
  fontSize: 12,
  padding: '4px 10px',
  cursor: 'pointer',
}

const btnDanger = {
  background: 'none',
  border: 'none',
  color: 'rgba(240,100,100,0.6)',
  cursor: 'pointer',
  fontSize: 14,
  padding: '0 4px',
}

function SectionHeader({ title, onAdd, addLabel = '+ Add' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '0.75rem', paddingBottom: 6,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
        <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      {onAdd && (
        <button onClick={onAdd} style={btnPrimary}>{addLabel}</button>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontStyle: 'italic', fontSize: 13 }}>
      {message}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      {children}
    </div>
  )
}

function StatusBadge({ status, colorMap }) {
  const color = colorMap[status] || '#888'
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 3,
      fontSize: 11, fontWeight: 'bold', fontFamily: 'sans-serif',
      background: `${color}33`, color, border: `1px solid ${color}66`,
    }}>{status}</span>
  )
}

const dispositionColors = { Friendly:'#90c870', Neutral:'#f5c842', Hostile:'#f09595', Unknown:'#888' }
const questStatusColors  = { Active:'#90b8f8', Completed:'#90c870', Failed:'#f09595', 'On Hold':'#f5c842' }
const questPriorityColors= { Critical:'#f09595', High:'#f5c842', Medium:'var(--gold)', Low:'#888' }
const encDiffColors      = { Trivial:'#90c870', Easy:'var(--gold)', Medium:'#f5c842', Hard:'#f09595', Deadly:'#d090f8' }
const encOutcomeColors   = { Victory:'#90c870', Defeat:'#f09595', Fled:'#f5c842', Ongoing:'#90b8f8', Avoided:'#888' }
const rarityColors       = { Common:'#888', Uncommon:'#90c870', Rare:'#90b8f8', 'Very Rare':'#d090f8', Legendary:'#f5c842', Artifact:'#ff9999' }
const charStatusColors   = { Active:'#90c870', Inactive:'#f5c842', Dead:'#f09595', Retired:'#888' }

// ── Overview ──
function Overview({ campaign, updateMeta, resetCampaign, exportCampaign, importCampaign }) {
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(campaign.name)
  const [setting, setSetting] = useState(campaign.setting || '')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)

  function save() {
    updateMeta({ name, setting })
    setEditing(false)
  }

  const stats = [
    { label: 'Characters', value: campaign.characters.length },
    { label: 'Sessions',   value: campaign.sessions.length   },
    { label: 'Encounters', value: campaign.encounters.length },
    { label: 'Quests',     value: campaign.quests.length     },
    { label: 'NPCs',       value: campaign.npcs.length       },
    { label: 'Loot items', value: campaign.loot.length       },
  ]

  const activeQuests    = campaign.quests.filter(q => q.status === 'Active').length
  const activePCs       = campaign.characters.filter(c => c.status === 'Active').length
  const totalXP         = campaign.sessions.reduce((a, s) => a + (parseInt(s.xpAwarded) || 0), 0)
  const totalGold       = campaign.sessions.reduce((a, s) => a + (parseInt(s.goldAwarded) || 0), 0)

  return (
    <div>
      <div style={{ ...cardStyle, borderLeft: '3px solid var(--gold)', marginBottom: '1rem' }}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field label="Campaign name">
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
            </Field>
            <Field label="Setting / world">
              <input style={inputStyle} value={setting} onChange={e => setSetting(e.target.value)} placeholder="e.g. Forgotten Realms, homebrew..." />
            </Field>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btnPrimary} onClick={save}>Save</button>
              <button style={btnGhost} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: 'var(--gold)' }}>{campaign.name}</div>
              {campaign.setting && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{campaign.setting}</div>}
            </div>
            <button style={btnGhost} onClick={() => setEditing(true)}>Edit</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...cardStyle, textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--gold)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Active party</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--gold2)' }}>{activePCs} <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 'normal' }}>players</span></div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Active quests</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--gold2)' }}>{activeQuests} <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 'normal' }}>ongoing</span></div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Total XP awarded</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--gold2)' }}>{totalXP.toLocaleString()}</div>
        </div>
        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Total gold earned</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--gold2)' }}>{totalGold.toLocaleString()} gp</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
          Campaign data is saved automatically in your browser. Clearing browser data will erase it.
          <strong style={{ color: '#f5c842' }}> Export a backup regularly to keep it safe.</strong>
        </div>

        {/* Export / Import */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <button style={{ ...btnPrimary, background: 'rgba(144,200,112,0.15)', border: '1px solid #90c870', color: '#90c870' }} onClick={exportCampaign}>
            ⬇ Export backup
          </button>
          <label style={{ ...btnGhost, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
            ⬆ Import backup
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files[0]
                if (!file) return
                e.target.value = ''
                setImportError('')
                setImportSuccess(false)
                if (!window.confirm('Import this backup? Your current campaign data will be replaced.')) return
                try {
                  await importCampaign(file)
                  setImportSuccess(true)
                  setTimeout(() => setImportSuccess(false), 4000)
                } catch (err) {
                  setImportError(err.message)
                }
              }}
            />
          </label>
        </div>

        {importSuccess && (
          <div style={{ fontSize: 12, color: '#90c870', marginBottom: 8 }}>✓ Campaign imported successfully.</div>
        )}
        {importError && (
          <div style={{ fontSize: 12, color: '#f09595', marginBottom: 8 }}>⚠ {importError}</div>
        )}

        <button
          style={{ ...btnGhost, color: '#f09595', borderColor: 'rgba(240,100,100,0.3)' }}
          onClick={() => { if (window.confirm('Reset all campaign data? This cannot be undone.')) resetCampaign() }}
        >
          Reset campaign data
        </button>
      </div>
    </div>
  )
}

// ── DM Panel (expanded character details) ──
function DMPanel({ c, module }) {
  const prof = c.profBonus || PROF_BONUS[c.level] || 2
  const [hpInput, setHpInput] = useState(String(c.hp || 0))

  function saveHp() {
    const val = parseInt(hpInput)
    if (!isNaN(val)) module.update(c.id, { hp: val })
  }

  // Spell slot tracking — usedSpellSlots is an array parallel to spellSlots
  const slots = Array.isArray(c.spellSlots) ? c.spellSlots : []
  const used  = Array.isArray(c.usedSpellSlots) ? c.usedSpellSlots : slots.map(() => 0)

  function toggleSlotUsed(levelIdx, slotIdx) {
    const nextUsed = used.map((u, i) => {
      if (i !== levelIdx) return u
      // clicking below used count restores, clicking at/above uses one
      return slotIdx < u ? u - 1 : u + 1
    })
    module.update(c.id, { usedSpellSlots: nextUsed })
  }

  function shortRest() {
    // Short rest: restore no spell slots (RAW), but reset death saves
    module.update(c.id, { deathSaves: { successes: 0, failures: 0 } })
  }

  function longRest() {
    module.update(c.id, {
      hp: c.maxHp || c.hp,
      usedSpellSlots: slots.map(() => 0),
      deathSaves: { successes: 0, failures: 0 },
    })
  }

  // Death saves — shown when HP = 0
  const deathSaves  = c.deathSaves || { successes: 0, failures: 0 }
  const isDying     = parseInt(c.hp) <= 0 && c.maxHp

  function toggleDeathSave(type, idx) {
    const current = deathSaves[type] || 0
    // clicking at/above current count adds, clicking below removes
    const next = idx < current ? current - 1 : current + 1
    module.update(c.id, { deathSaves: { ...deathSaves, [type]: Math.min(next, 3) } })
  }

  // Saving throws
  const savingThrows = ABILITIES.map(ab => {
    const proficient = (c.savingThrows || []).includes(ab)
    const bonus = abilityMod(c[ab] || 10) + (proficient ? prof : 0)
    return { ab, proficient, bonus }
  })

  // All skills with bonuses
  const skillRows = SKILLS.map(skill => {
    const proficient = (c.skillProfs || []).includes(skill.name)
    const bonus = abilityMod(c[skill.ability] || 10) + (proficient ? prof : 0)
    return { ...skill, proficient, bonus }
  })

  const dmLabel = { fontSize:9, color:'var(--gold)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }
  const divider = { borderTop:'1px solid rgba(255,255,255,.06)', marginTop:12, paddingTop:12 }

  // Active conditions
  const CONDITIONS = ['Blinded','Charmed','Deafened','Exhausted','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious']
  const activeConditions = Array.isArray(c.activeConditions) ? c.activeConditions : []

  function toggleCondition(cond) {
    const next = activeConditions.includes(cond)
      ? activeConditions.filter(x => x !== cond)
      : [...activeConditions, cond]
    module.update(c.id, { activeConditions: next })
  }

  return (
    <div style={{ marginTop:10, ...divider }}>

      {/* Active Conditions */}
      <div style={{ marginBottom:12 }}>
        <div style={dmLabel}>Active Conditions</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {CONDITIONS.map(cond => {
            const active = activeConditions.includes(cond)
            return (
              <button
                key={cond}
                onClick={() => toggleCondition(cond)}
                title={active ? `Remove ${cond}` : `Apply ${cond}`}
                style={{
                  fontSize:10, fontFamily:'sans-serif', padding:'2px 8px',
                  borderRadius:3, cursor:'pointer', border:'1px solid',
                  background: active ? 'rgba(240,149,149,.15)' : 'rgba(255,255,255,.04)',
                  color: active ? '#f09595' : 'var(--muted)',
                  borderColor: active ? 'rgba(240,149,149,.5)' : 'rgba(255,255,255,.1)',
                  fontWeight: active ? 'bold' : 'normal',
                }}
              >{cond}</button>
            )
          })}
        </div>
      </div>

      {/* HP editor + Passive Perception */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div>
          <div style={dmLabel}>Current HP</div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <input
              type="number"
              value={hpInput}
              onChange={e => setHpInput(e.target.value)}
              onBlur={saveHp}
              onKeyDown={e => e.key === 'Enter' && saveHp()}
              style={{ ...inputStyle, width:70, fontSize:16, fontWeight:'bold', color:'#f09595', textAlign:'center', padding:'4px 6px' }}
            />
            <span style={{ fontSize:13, color:'var(--muted)' }}>/ {c.maxHp || '—'}</span>
          </div>
        </div>
        <div>
          <div style={dmLabel}>Passive Perception</div>
          <div style={{ fontSize:28, fontWeight:'bold', color:'var(--gold)', lineHeight:1 }}>
            {c.passivePerception || (10 + abilityMod(c.wis || 10))}
          </div>
        </div>
      </div>

      {/* Saving Throws */}
      <div style={divider}>
        <div style={dmLabel}>Saving Throws</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4 }}>
          {savingThrows.map(({ ab, proficient, bonus }) => (
            <div key={ab} style={{
              display:'flex', alignItems:'center', gap:6, padding:'4px 8px',
              borderRadius:4, background:'rgba(255,255,255,.02)',
              border:`1px solid ${proficient ? 'rgba(144,184,248,.3)' : 'var(--border)'}`,
            }}>
              <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0,
                background: proficient ? '#90b8f8' : 'transparent',
                border:`1.5px solid ${proficient ? '#90b8f8' : 'var(--muted)'}`,
              }} />
              <span style={{ fontSize:11, color:'var(--parch2)', flex:1 }}>{ABILITY_SHORT[ab]}</span>
              <span style={{ fontSize:12, fontFamily:'sans-serif', fontWeight:'bold', color: bonus >= 0 ? '#90b8f8' : '#f09595' }}>
                {bonus >= 0 ? '+' : ''}{bonus}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={divider}>
        <div style={dmLabel}>Skills</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:3 }}>
          {skillRows.map(({ name, ability, proficient, bonus }) => (
            <div key={name} style={{
              display:'flex', alignItems:'center', gap:6, padding:'3px 6px',
              borderRadius:4, opacity: proficient ? 1 : 0.45,
              background: proficient ? 'rgba(144,200,112,.06)' : 'transparent',
            }}>
              <div style={{ width:7, height:7, borderRadius:'50%', flexShrink:0,
                background: proficient ? '#90c870' : 'transparent',
                border:`1.5px solid ${proficient ? '#90c870' : 'var(--muted)'}`,
              }} />
              <span style={{ fontSize:11, color:'var(--parch2)', flex:1 }}>{name}</span>
              <span style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif' }}>{ABILITY_SHORT[ability]}</span>
              <span style={{ fontSize:11, fontFamily:'sans-serif', fontWeight: proficient ? 'bold' : 'normal',
                color: bonus >= 0 ? (proficient ? '#90c870' : 'var(--muted)') : '#f09595', minWidth:22, textAlign:'right',
              }}>{bonus >= 0 ? '+' : ''}{bonus}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spell Slots — interactive */}
      {slots.some(n => n > 0) && (
        <div style={divider}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <div style={dmLabel}>Spell Slots</div>
            <div style={{ display:'flex', gap:4 }}>
              <button style={{ ...btnGhost, padding:'2px 8px', fontSize:10, color:'#90b8f8', borderColor:'rgba(144,184,248,.3)' }} onClick={shortRest} title="Short rest — resets death saves">Short Rest</button>
              <button style={{ ...btnGhost, padding:'2px 8px', fontSize:10, color:'#90c870', borderColor:'rgba(144,200,112,.3)' }} onClick={longRest} title="Long rest — restore all slots and HP">Long Rest</button>
            </div>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {slots.map((count, levelIdx) => {
              if (count <= 0) return null
              const usedCount = used[levelIdx] || 0
              return (
                <div key={levelIdx} style={{ background:'rgba(208,144,248,.06)', border:'1px solid rgba(208,144,248,.25)', borderRadius:6, padding:'4px 8px', textAlign:'center', minWidth:52 }}>
                  <div style={{ fontSize:9, color:'#d090f8', fontFamily:'sans-serif', marginBottom:4 }}>L{levelIdx+1}</div>
                  <div style={{ display:'flex', gap:3, justifyContent:'center', flexWrap:'wrap' }}>
                    {Array.from({ length: count }).map((_, slotIdx) => {
                      const isUsed = slotIdx < usedCount
                      return (
                        <div
                          key={slotIdx}
                          onClick={() => toggleSlotUsed(levelIdx, slotIdx)}
                          title={isUsed ? 'Click to restore' : 'Click to expend'}
                          style={{
                            width:14, height:14, borderRadius:'50%', cursor:'pointer',
                            background: isUsed ? 'transparent' : '#d090f8',
                            border: `2px solid ${isUsed ? 'rgba(208,144,248,.4)' : '#d090f8'}`,
                            transition:'background 0.15s',
                          }}
                        />
                      )
                    })}
                  </div>
                  <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginTop:3 }}>
                    {count - usedCount}/{count}
                  </div>
                </div>
              )
            })}
            {(c.cantrips?.length > 0) && (
              <div style={{ background:'rgba(208,144,248,.04)', border:'1px solid rgba(208,144,248,.15)', borderRadius:6, padding:'4px 8px', textAlign:'center', minWidth:52 }}>
                <div style={{ fontSize:13, fontWeight:'bold', color:'#d090f8' }}>{c.cantrips.length}</div>
                <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif' }}>Cantrips</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Death Saves — shown when HP = 0 */}
      {isDying && (
        <div style={{ ...divider, background:'rgba(240,100,100,.06)', border:'1px solid rgba(240,100,100,.25)', borderRadius:6, padding:'10px 12px', marginTop:12 }}>
          <div style={{ fontSize:10, color:'#f09595', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8, fontWeight:'bold' }}>
            ☠ Death Saves
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['successes','Successes','#90c870'],['failures','Failures','#f09595']].map(([type, label, color]) => (
              <div key={type}>
                <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:5 }}>{label}</div>
                <div style={{ display:'flex', gap:5 }}>
                  {[0,1,2].map(idx => {
                    const filled = idx < (deathSaves[type] || 0)
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDeathSave(type, idx)}
                        style={{
                          width:20, height:20, borderRadius:'50%', cursor:'pointer',
                          background: filled ? color : 'transparent',
                          border: `2px solid ${filled ? color : 'rgba(255,255,255,.25)'}`,
                          transition:'background 0.15s',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {deathSaves.failures >= 3 && (
            <div style={{ fontSize:11, color:'#f09595', marginTop:8, fontStyle:'italic' }}>Character has died — 3 failed death saves.</div>
          )}
          {deathSaves.successes >= 3 && (
            <div style={{ fontSize:11, color:'#90c870', marginTop:8, fontStyle:'italic' }}>Stabilized — 3 successful death saves.</div>
          )}
        </div>
      )}

      {/* Spells */}
      {(c.cantrips?.length > 0 || c.spells?.length > 0) && (
        <div style={divider}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
            <div style={dmLabel}>Spells</div>
            {c.spellcastingAbility && (
              <span style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif' }}>
                Save DC {8 + (c.profBonus || prof) + abilityMod(c[c.spellcastingAbility] || 10)} · Attack +{(c.profBonus || prof) + abilityMod(c[c.spellcastingAbility] || 10)}
              </span>
            )}
          </div>
          {c.cantrips?.length > 0 && (
            <div style={{ marginBottom:6 }}>
              <div style={{ fontSize:9, color:'#d090f8', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4 }}>Cantrips</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                {c.cantrips.map(s => <span key={s} style={{ fontSize:10, fontFamily:'sans-serif', padding:'1px 7px', borderRadius:3, background:'rgba(208,144,248,.1)', border:'1px solid rgba(208,144,248,.25)', color:'#d090f8' }}>{s}</span>)}
              </div>
            </div>
          )}
          {c.spells?.length > 0 && (
            <div>
              <div style={{ fontSize:9, color:'#90b8f8', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4 }}>Known / Prepared</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                {c.spells.map(s => <span key={s} style={{ fontSize:10, fontFamily:'sans-serif', padding:'1px 7px', borderRadius:3, background:'rgba(144,184,248,.08)', border:'1px solid rgba(144,184,248,.25)', color:'#90b8f8' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Languages + Equipment */}
      {(c.languages?.length > 0 || c.equipment?.length > 0) && (
        <div style={divider}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {c.languages?.length > 0 && (
              <div>
                <div style={dmLabel}>Languages</div>
                <div style={{ fontSize:11, color:'var(--parch2)', lineHeight:1.7 }}>{c.languages.join(', ')}</div>
              </div>
            )}
            {c.equipment?.length > 0 && (
              <div>
                <div style={dmLabel}>Equipment</div>
                <div style={{ fontSize:11, color:'var(--parch2)', lineHeight:1.7 }}>{c.equipment.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personality */}
      {(c.personalityTrait || c.ideal || c.bond || c.flaw) && (
        <div style={divider}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['personalityTrait','Trait'],['ideal','Ideal'],['bond','Bond'],['flaw','Flaw']].map(([field, label]) => c[field] ? (
              <div key={field}>
                <div style={dmLabel}>{label}</div>
                <div style={{ fontSize:11, color:'var(--parch2)', fontStyle:'italic' }}>{c[field]}</div>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {/* Backstory */}
      {c.backstory && (
        <div style={divider}>
          <div style={dmLabel}>Backstory</div>
          <div style={{ fontSize:11, color:'var(--parch2)', lineHeight:1.6 }}>{c.backstory}</div>
        </div>
      )}

      {/* Character Journal */}
      <CharacterJournal c={c} module={module} divider={divider} dmLabel={dmLabel} />
    </div>
  )
}

// ── Character Journal ──────────────────────────────────────────────────────────
function CharacterJournal({ c, module, divider, dmLabel }) {
  const journal = Array.isArray(c.journal) ? [...c.journal].sort((a, b) => b.createdAt - a.createdAt) : []
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const blank = { title: '', body: '', date: new Date().toISOString().slice(0, 10) }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.body.trim()) return
    const existing = c.journal || []
    if (editing) {
      module.update(c.id, { journal: existing.map(e => e.id === editing ? { ...e, ...form } : e) })
      setEditing(null)
    } else {
      const entry = { ...form, id: Date.now().toString(36) + Math.random().toString(36).slice(2), createdAt: Date.now() }
      module.update(c.id, { journal: [...existing, entry] })
      setAdding(false)
    }
    setForm(blank)
  }

  function removeEntry(id) {
    module.update(c.id, { journal: (c.journal || []).filter(e => e.id !== id) })
  }

  function startEdit(entry) {
    setForm({ title: entry.title || '', body: entry.body, date: entry.date || new Date().toISOString().slice(0, 10) })
    setEditing(entry.id)
    setAdding(false)
  }

  return (
    <div style={divider}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={dmLabel}>Character Journal</div>
        {!adding && !editing && (
          <button
            onClick={() => { setAdding(true); setForm(blank) }}
            style={{ ...btnPrimary, fontSize: 10, padding: '2px 8px' }}
          >+ Entry</button>
        )}
      </div>

      {(adding || editing) && (
        <div style={{ background: 'rgba(201,168,76,.04)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 6, padding: '8px 10px', marginBottom: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, marginBottom: 6 }}>
            <input
              style={{ ...inputStyle, fontSize: 12 }}
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Entry title (optional)..."
            />
            <input
              type="date"
              style={{ ...inputStyle, fontSize: 12, width: 130 }}
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 80, fontSize: 12 }}
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Write from your character's perspective..."
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button style={{ ...btnPrimary, fontSize: 11, padding: '3px 10px' }} onClick={submit}>{editing ? 'Save' : 'Add entry'}</button>
            <button style={{ ...btnGhost, fontSize: 11, padding: '3px 10px' }} onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {journal.length === 0 && !adding && (
        <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>No journal entries yet. Record this character's story.</div>
      )}

      {journal.map(entry => (
        <div key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                {entry.title && <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--gold)' }}>{entry.title}</span>}
                {entry.date && <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'sans-serif' }}>{entry.date}</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--parch2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{entry.body}</div>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <button style={{ ...btnGhost, fontSize: 10, padding: '1px 6px' }} onClick={() => startEdit(entry)}>✏</button>
              <button style={{ ...btnDanger, fontSize: 12 }} onClick={() => removeEntry(entry.id)}>×</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── XP Bar (inline on character card) ──
function XPBar({ c, module }) {
  const level      = Math.min(parseInt(c.level) || 1, 20)
  const currentXP  = parseInt(c.xp) || 0
  const nextXP     = XP_LEVELS[level] // XP needed for next level (undefined at 20)
  const prevXP     = XP_LEVELS[level - 1] || 0
  const isMaxLevel = level >= 20
  const levelReady = !isMaxLevel && nextXP !== undefined && currentXP >= nextXP

  const [editing, setEditing] = useState(false)
  const [input, setInput]     = useState(String(currentXP))

  function saveXP() {
    const val = parseInt(input)
    if (!isNaN(val) && val >= 0) module.update(c.id, { xp: val })
    setEditing(false)
  }

  const xpInLevel  = currentXP - prevXP
  const xpForLevel = nextXP ? nextXP - prevXP : 1
  const pct        = isMaxLevel ? 100 : Math.min((xpInLevel / xpForLevel) * 100, 100)

  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
      <span style={{ fontSize:11, color:'var(--muted)' }}>XP</span>
      {editing ? (
        <input
          autoFocus
          type="number" min={0} value={input}
          onChange={e => setInput(e.target.value)}
          onBlur={saveXP}
          onKeyDown={e => { if (e.key === 'Enter') saveXP(); if (e.key === 'Escape') setEditing(false) }}
          style={{ width:80, background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'sans-serif', fontSize:11, padding:'1px 6px', outline:'none', textAlign:'center' }}
        />
      ) : (
        <span
          onClick={() => { setInput(String(currentXP)); setEditing(true) }}
          title="Click to edit XP"
          style={{ fontSize:11, color:'var(--parch2)', fontFamily:'sans-serif', cursor:'pointer', textDecoration:'underline dotted', textUnderlineOffset:2 }}
        >
          {currentXP.toLocaleString()}{!isMaxLevel && nextXP ? ` / ${nextXP.toLocaleString()}` : ''}
        </span>
      )}
      {!isMaxLevel && nextXP && (
        <div style={{ width:70, height:4, background:'rgba(255,255,255,.08)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ width:`${pct}%`, height:'100%', background: levelReady ? '#90c870' : '#90b8f8', borderRadius:2, transition:'width 0.3s' }} />
        </div>
      )}
      {levelReady && (
        <span style={{ fontSize:9, fontFamily:'sans-serif', fontWeight:'bold', padding:'1px 6px', borderRadius:3, background:'rgba(144,200,112,.2)', color:'#90c870', border:'1px solid rgba(144,200,112,.5)', animation:'pulse 1.5s infinite' }}>
          ⬆ LEVEL UP!
        </span>
      )}
      {isMaxLevel && (
        <span style={{ fontSize:9, fontFamily:'sans-serif', color:'var(--gold)', padding:'1px 6px', borderRadius:3, background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.3)' }}>Max Level</span>
      )}
    </div>
  )
}

// ── Characters ──
function Characters({ campaign, module, onOpenBuilder, loot, sessions }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [xpGranted, setXpGranted] = useState(false)

  const totalSessionXP = (sessions || []).reduce((sum, s) => sum + (parseInt(s.xpAwarded) || 0), 0)

  function grantSessionXPToAll() {
    if (!totalSessionXP) return
    campaign.characters
      .filter(c => c.str !== undefined && (c.status || 'Active') === 'Active')
      .forEach(c => {
        const newXP = (parseInt(c.xp) || 0) + totalSessionXP
        module.update(c.id, { xp: newXP })
      })
    setXpGranted(true)
    setTimeout(() => setXpGranted(false), 3000)
  }
  const blank = { name:'', race:'', class:'', level:1, hp:'', maxHp:'', ac:'', status:'Active', notes:'' }
  const [form, setForm] = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(c) {
    setForm({ name:c.name, race:c.race||'', class:c.class||'', level:c.level||1, hp:c.hp||'', maxHp:c.maxHp||'', ac:c.ac||'', status:c.status||'Active', notes:c.notes||'' })
    setEditing(c.id); setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null); setForm(blank) }

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function isBuilderChar(c) { return c.str !== undefined && c.dex !== undefined }

  return (
    <div>
      <SectionHeader
        title="Characters"
        onAdd={() => { setAdding(true); setEditing(null); setForm(blank) }}
        addLabel={onOpenBuilder ? '+ Quick add' : '+ Add'}
      />

      {/* Session XP banner */}
      {totalSessionXP > 0 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, background:'rgba(144,184,248,.06)', border:'1px solid rgba(144,184,248,.2)', borderRadius:6, padding:'6px 10px', marginBottom:'0.75rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:12, color:'var(--parch2)', fontFamily:'sans-serif' }}>
            Total XP from sessions: <strong style={{ color:'#90b8f8' }}>{totalSessionXP.toLocaleString()} XP</strong>
          </span>
          <button
            style={{ ...btnPrimary, fontSize:11, padding:'3px 10px', background:'rgba(144,184,248,.15)', border:'1px solid rgba(144,184,248,.4)', color:'#90b8f8' }}
            onClick={grantSessionXPToAll}
          >
            {xpGranted ? '✓ Granted!' : '+ Grant to all active PCs'}
          </button>
        </div>
      )}

      {onOpenBuilder && (
        <div style={{ marginBottom:'0.75rem' }}>
          <button
            style={{ ...btnPrimary, background:'rgba(201,168,76,.15)', border:'1px solid var(--gold)', color:'var(--gold)' }}
            onClick={() => onOpenBuilder(null)}
          >
            ⚔ Build Character (Wizard)
          </button>
        </div>
      )}

      {(adding || editing) && (
        <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
            <Field label="Name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Character name" /></Field>
            <Field label="Race"><input style={inputStyle} value={form.race} onChange={e => setForm(f => ({...f, race:e.target.value}))} placeholder="e.g. Human, Elf..." /></Field>
            <Field label="Class"><input style={inputStyle} value={form.class} onChange={e => setForm(f => ({...f, class:e.target.value}))} placeholder="e.g. Fighter, Wizard..." /></Field>
            <Field label="Level"><input style={{...inputStyle, width:80}} type="number" min="1" max="20" value={form.level} onChange={e => setForm(f => ({...f, level:parseInt(e.target.value)||1}))} /></Field>
            <Field label="Current HP"><input style={inputStyle} type="number" value={form.hp} onChange={e => setForm(f => ({...f, hp:e.target.value}))} /></Field>
            <Field label="Max HP"><input style={inputStyle} type="number" value={form.maxHp} onChange={e => setForm(f => ({...f, maxHp:e.target.value}))} /></Field>
            <Field label="AC"><input style={{...inputStyle, width:80}} type="number" value={form.ac} onChange={e => setForm(f => ({...f, ac:e.target.value}))} /></Field>
            <Field label="Status">
              <select style={selectStyle} value={form.status} onChange={e => setForm(f => ({...f, status:e.target.value}))}>
                {CHAR_STATUSES.map(s => <option key={s} value={s} style={{background:'#16213e',color:'#f5f0e1'}}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:60}} value={form.notes} onChange={e => setForm(f => ({...f, notes:e.target.value}))} /></Field>
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add character'}</button>
            <button style={btnGhost} onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      {campaign.characters.length === 0 && !adding
        ? <EmptyState message="No characters yet. Use the wizard to build a full character, or quick-add a simple one." />
        : campaign.characters.map(c => {
          const hpPct     = c.maxHp ? Math.round((parseInt(c.hp)||0) / parseInt(c.maxHp) * 100) : null
          const barColor  = hpPct >= 75 ? '#90c870' : hpPct >= 40 ? '#f5c842' : '#f09595'
          const full      = isBuilderChar(c)
          const expanded  = expandedIds.has(c.id)

          // Encumbrance — only for builder chars that have STR
          const str           = c.str || 0
          const carryMax      = str * 15
          const encThreshold  = str * 5
          const heavyThreshold= str * 10
          const carriedWeight = full && loot
            ? loot.filter(item => item.claimedBy && item.claimedBy.trim().toLowerCase() === c.name.trim().toLowerCase())
                  .reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0)
            : 0
          const encStatus = !full || !str ? null
            : carriedWeight >= carryMax      ? 'Over Capacity'
            : carriedWeight >= heavyThreshold ? 'Heavily Encumbered'
            : carriedWeight >= encThreshold   ? 'Encumbered'
            : 'Normal'
          const encColor = { Normal:'#90c870', Encumbered:'#f5c842', 'Heavily Encumbered':'#f09595', 'Over Capacity':'#d090f8' }
          const encPct   = carryMax > 0 ? Math.min((carriedWeight / carryMax) * 100, 100) : 0

          return (
            <div key={c.id} style={{ ...cardStyle, borderLeft:`3px solid ${charStatusColors[c.status]||'var(--border)'}` }}>

              {/* ── Header row ── */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontSize:15, fontWeight:'bold', color:'var(--gold2)' }}>{c.name}</span>
                    <StatusBadge status={c.status||'Active'} colorMap={charStatusColors} />
                    {(c.race || c.class) && (
                      <span style={{ fontSize:12, color:'var(--muted)' }}>
                        {[c.subrace||c.race, c.subclass||c.class].filter(Boolean).join(' ')}
                      </span>
                    )}
                    {c.level  && <span style={{ fontSize:12, color:'var(--gold)', fontFamily:'sans-serif' }}>Lvl {c.level}</span>}
                    {c.background && <span style={{ fontSize:11, color:'var(--muted)', fontStyle:'italic' }}>{c.background}</span>}
                    {c.alignment  && <span style={{ fontSize:11, color:'var(--muted)' }}>{c.alignment}</span>}
                  </div>

                  {/* Active condition badges */}
                  {Array.isArray(c.activeConditions) && c.activeConditions.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:3, marginBottom:4 }}>
                      {c.activeConditions.map(cond => (
                        <span key={cond} style={{ fontSize:9, fontFamily:'sans-serif', padding:'1px 6px', borderRadius:3, background:'rgba(240,149,149,.15)', color:'#f09595', border:'1px solid rgba(240,149,149,.4)', fontWeight:'bold' }}>{cond}</span>
                      ))}
                    </div>
                  )}

                  {/* HP / AC / Speed / Prof / Init */}
                  <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                    {c.maxHp && (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:12, color:'var(--muted)' }}>HP</span>
                        <span style={{ fontSize:13, fontWeight:'bold', color:barColor }}>{c.hp||0}/{c.maxHp}</span>
                        <div style={{ width:60, height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ width:`${Math.min(hpPct||0,100)}%`, height:'100%', background:barColor, borderRadius:3, transition:'width 0.3s' }} />
                        </div>
                      </div>
                    )}
                    {c.ac       && <span style={{ fontSize:12, color:'var(--muted)' }}>AC <strong style={{ color:'var(--parch2)' }}>{c.ac}</strong></span>}
                    {c.speed    && <span style={{ fontSize:12, color:'var(--muted)' }}>Speed <strong style={{ color:'var(--parch2)' }}>{c.speed}ft</strong></span>}
                    {c.profBonus && <span style={{ fontSize:12, color:'var(--muted)' }}>Prof <strong style={{ color:'var(--gold)' }}>+{c.profBonus}</strong></span>}
                    {full && <span style={{ fontSize:12, color:'var(--muted)' }}>PP <strong style={{ color:'var(--parch2)' }}>{c.passivePerception || (10+abilityMod(c.wis||10))}</strong></span>}
                  </div>

                  {/* XP + Level-up */}
                  {full && (c.xp !== undefined) && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4, flexWrap:'wrap' }}>
                      <XPBar c={c} module={module} />
                    </div>
                  )}

                  {/* Encumbrance bar */}
                  {((encStatus && encStatus !== 'Normal') || (encStatus === 'Normal' && carriedWeight > 0)) ? (
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:5, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, color:'var(--muted)' }}>
                        Carry <strong style={{ color: encColor[encStatus] }}>{carriedWeight.toFixed(1)} / {carryMax} lb</strong>
                      </span>
                      <div style={{ flex:1, minWidth:80, maxWidth:120, height:5, background:'rgba(255,255,255,.08)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ width:`${encPct}%`, height:'100%', background: encColor[encStatus], borderRadius:3, transition:'width 0.3s' }} />
                      </div>
                      {encStatus !== 'Normal' && (
                        <span style={{ fontSize:10, fontFamily:'sans-serif', padding:'1px 6px', borderRadius:3,
                          background:`${encColor[encStatus]}22`, color: encColor[encStatus],
                          border:`1px solid ${encColor[encStatus]}66`, fontWeight:'bold' }}>
                          {encStatus}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Action buttons */}
                <div style={{ display:'flex', gap:4, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                  {full && (
                    <button
                      style={{ ...btnGhost, fontSize:11, color: expanded ? 'var(--gold)' : 'var(--muted)', borderColor: expanded ? 'rgba(201,168,76,.4)' : 'var(--border)' }}
                      onClick={() => toggleExpand(c.id)}
                      title={expanded ? 'Collapse DM panel' : 'Expand DM panel'}
                    >
                      {expanded ? '▲ Less' : '▼ DM View'}
                    </button>
                  )}
                  {full && onOpenBuilder && (
                    <button
                      style={{ ...btnGhost, color:'var(--gold)', borderColor:'rgba(201,168,76,.4)', fontSize:11 }}
                      onClick={() => onOpenBuilder(c.id)}
                      title="Edit in Character Builder"
                    >
                      ✏ Edit
                    </button>
                  )}
                  {full && (
                    <button
                      style={{ ...btnGhost, color:'#90b8f8', borderColor:'rgba(144,184,248,.3)', fontSize:11 }}
                      onClick={() => printCharacter(c)}
                      title="Print / export as PDF"
                    >
                      🖨 Sheet
                    </button>
                  )}
                  {!full && <button style={btnGhost} onClick={() => startEdit(c)}>Edit</button>}
                  <button style={btnDanger} onClick={() => module.remove(c.id)}>×</button>
                </div>
              </div>

              {/* ── Ability scores (always visible for builder chars) ── */}
              {full && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:4, marginTop:10, padding:'8px 0', borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                  {ABILITIES.map(ab => {
                    const score = c[ab] || 10
                    return (
                      <div key={ab} style={{ textAlign:'center', padding:'4px 2px' }}>
                        <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', letterSpacing:'.05em', textTransform:'uppercase', marginBottom:2 }}>{ABILITY_SHORT[ab]}</div>
                        <div style={{ fontSize:16, fontWeight:'bold', color:'var(--gold2)', lineHeight:1 }}>{score}</div>
                        <div style={{ fontSize:12, color: abilityMod(score)>=0 ? '#90c870' : '#f09595', marginTop:1 }}>{modStr(score)}</div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ── Expandable DM panel ── */}
              {full && expanded && <DMPanel c={c} module={module} />}

              {/* Notes (simple chars) */}
              {!full && c.notes && <div style={{ fontSize:12, color:'var(--muted)', marginTop:6, fontStyle:'italic' }}>{c.notes}</div>}
            </div>
          )
        })
      }
    </div>
  )
}

// ── Sessions ──
function Sessions({ campaign, module }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const nextNum = (campaign.sessions.length > 0 ? Math.max(...campaign.sessions.map(s => s.number||0)) : 0) + 1
  const blank = { number: nextNum, date: new Date().toISOString().slice(0,10), title:'', summary:'', xpAwarded:'', goldAwarded:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.title.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm({ ...blank, number: nextNum + 1 })
  }

  function startEdit(s) {
    setForm({ number:s.number, date:s.date||'', title:s.title, summary:s.summary||'', xpAwarded:s.xpAwarded||'', goldAwarded:s.goldAwarded||'' })
    setEditing(s.id); setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null) }

  const sorted = [...campaign.sessions].sort((a,b) => (b.number||0) - (a.number||0))

  return (
    <div>
      <SectionHeader title="Sessions" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Log session" />

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <Field label="Session #"><input style={{...inputStyle,width:80}} type="number" value={form.number} onChange={e => setForm(f => ({...f, number: parseInt(e.target.value)||1}))} /></Field>
        <Field label="Date"><input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} /></Field>
        <Field label="Title *" ><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Session title or hook..." /></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Field label="XP awarded"><input style={inputStyle} type="number" value={form.xpAwarded} onChange={e => setForm(f => ({...f, xpAwarded: e.target.value}))} /></Field>
          <Field label="Gold awarded"><input style={inputStyle} type="number" value={form.goldAwarded} onChange={e => setForm(f => ({...f, goldAwarded: e.target.value}))} /></Field>
        </div>
      </div>
      <Field label="Summary / notes">
        <textarea style={{...inputStyle, resize:'vertical', minHeight:80}} value={form.summary} onChange={e => setForm(f => ({...f, summary: e.target.value}))} placeholder="What happened this session..." />
      </Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Log session'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

      {campaign.sessions.length === 0 && !adding
        ? <EmptyState message="No sessions logged yet. Record your first session above." />
        : sorted.map(s => (
          <div key={s.id} style={{ ...cardStyle, borderLeft:'3px solid #90b8f8' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, color:'#90b8f8', fontFamily:'sans-serif', fontWeight:'bold' }}>SESSION {s.number}</span>
                  {s.date && <span style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif' }}>{s.date}</span>}
                </div>
                <div style={{ fontSize:14, fontWeight:'bold', color:'var(--gold2)', marginBottom:4 }}>{s.title}</div>
                <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom: s.summary ? 6 : 0 }}>
                  {s.xpAwarded   && <span style={{ fontSize:12, color:'var(--muted)' }}>XP: <strong style={{color:'var(--gold)'}}>{parseInt(s.xpAwarded).toLocaleString()}</strong></span>}
                  {s.goldAwarded && <span style={{ fontSize:12, color:'var(--muted)' }}>Gold: <strong style={{color:'#f5c842'}}>{parseInt(s.goldAwarded).toLocaleString()} gp</strong></span>}
                </div>
                {s.summary && <div style={{ fontSize:12, color:'var(--parch2)', lineHeight:1.5 }}>{s.summary}</div>}
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button style={btnGhost} onClick={() => startEdit(s)}>Edit</button>
                <button style={btnDanger} onClick={() => module.remove(s.id)}>×</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// ── Encounters ──
function Encounters({ campaign, module }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const blank = { name:'', difficulty:'Medium', outcome:'Victory', xpAwarded:'', notes:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(e) {
    setForm({ name:e.name, difficulty:e.difficulty||'Medium', outcome:e.outcome||'Victory', xpAwarded:e.xpAwarded||'', notes:e.notes||'' })
    setEditing(e.id); setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null) }

  return (
    <div>
      <SectionHeader title="Encounters" onAdd={() => { setAdding(true); setEditing(null) }} />

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <Field label="Encounter name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Goblin ambush..." /></Field>
        <Field label="XP awarded"><input style={inputStyle} type="number" value={form.xpAwarded} onChange={e => setForm(f => ({...f, xpAwarded: e.target.value}))} /></Field>
        <Field label="Difficulty">
          <select style={selectStyle} value={form.difficulty} onChange={e => setForm(f => ({...f, difficulty: e.target.value}))}>
            {ENCOUNTER_DIFFICULTIES.map(d => <option key={d} value={d} style={{background:'#16213e',color:'#f5f0e1'}}>{d}</option>)}
          </select>
        </Field>
        <Field label="Outcome">
          <select style={selectStyle} value={form.outcome} onChange={e => setForm(f => ({...f, outcome: e.target.value}))}>
            {ENCOUNTER_OUTCOMES.map(o => <option key={o} value={o} style={{background:'#16213e',color:'#f5f0e1'}}>{o}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:60}} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add encounter'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

      {campaign.encounters.length === 0 && !adding
        ? <EmptyState message="No encounters logged yet." />
        : campaign.encounters.map(e => (
          <div key={e.id} style={{ ...cardStyle, borderLeft:`3px solid ${encDiffColors[e.difficulty]||'var(--border)'}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:14, fontWeight:'bold', color:'var(--gold2)' }}>{e.name}</span>
                  <StatusBadge status={e.difficulty} colorMap={encDiffColors} />
                  <StatusBadge status={e.outcome}    colorMap={encOutcomeColors} />
                  {e.xpAwarded && <span style={{ fontSize:12, color:'var(--muted)' }}>XP: <strong style={{color:'var(--gold)'}}>{parseInt(e.xpAwarded).toLocaleString()}</strong></span>}
                </div>
                {e.notes && <div style={{ fontSize:12, color:'var(--parch2)', lineHeight:1.5 }}>{e.notes}</div>}
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button style={btnGhost} onClick={() => startEdit(e)}>Edit</button>
                <button style={btnDanger} onClick={() => module.remove(e.id)}>×</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// ── Loot ──
function Loot({ campaign, module }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const blank = { name:'', type:'Other', rarity:'Common', weight:'', goldValue:'', claimedBy:'', notes:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(item) {
    setForm({ name:item.name, type:item.type||'Other', rarity:item.rarity||'Common', weight:item.weight||'', goldValue:item.goldValue||'', claimedBy:item.claimedBy||'', notes:item.notes||'' })
    setEditing(item.id); setAdding(false)
  }

  const totalWeight = campaign.loot.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0)
  const totalGold   = campaign.loot.reduce((sum, item) => sum + (parseFloat(item.goldValue) || 0), 0)

  function cancel() { setAdding(false); setEditing(null) }

  return (
    <div>
      <SectionHeader title="Loot" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Add item" />
      {campaign.loot.length > 0 && (
        <div style={{ display:'flex', gap:16, marginBottom:'0.75rem', fontSize:12, fontFamily:'sans-serif', color:'var(--muted)' }}>
          {totalWeight > 0 && <span>Total weight: <strong style={{ color:'var(--parch2)' }}>{totalWeight.toFixed(1)} lb</strong></span>}
          {totalGold   > 0 && <span>Total value: <strong style={{ color:'#f5c842' }}>{totalGold.toLocaleString()} gp</strong></span>}
        </div>
      )}

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <Field label="Item name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Item name..." /></Field>
        <Field label="Type">
          <select style={selectStyle} value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
            {LOOT_TYPES.map(t => <option key={t} value={t} style={{background:'#16213e',color:'#f5f0e1'}}>{t}</option>)}
          </select>
        </Field>
        <Field label="Rarity">
          <select style={selectStyle} value={form.rarity} onChange={e => setForm(f => ({...f, rarity: e.target.value}))}>
            {LOOT_RARITIES.map(r => <option key={r} value={r} style={{background:'#16213e',color:'#f5f0e1'}}>{r}</option>)}
          </select>
        </Field>
        <Field label="Weight (lb)"><input style={inputStyle} type="number" min="0" step="0.1" value={form.weight} onChange={e => setForm(f => ({...f, weight: e.target.value}))} placeholder="0.0" /></Field>
        <Field label="Value (gp)"><input style={inputStyle} type="number" min="0" value={form.goldValue} onChange={e => setForm(f => ({...f, goldValue: e.target.value}))} placeholder="0" /></Field>
        <Field label="Claimed by"><input style={inputStyle} value={form.claimedBy} onChange={e => setForm(f => ({...f, claimedBy: e.target.value}))} placeholder="Character name..." /></Field>
      </div>
      <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:50}} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add item'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

      {campaign.loot.length === 0 && !adding
        ? <EmptyState message="No loot tracked yet. Add items as your party finds them." />
        : campaign.loot.map(item => (
          <div key={item.id} style={{ ...cardStyle, borderLeft:`3px solid ${rarityColors[item.rarity]||'#888'}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:14, fontWeight:'bold', color:'var(--gold2)' }}>{item.name}</span>
                  <StatusBadge status={item.rarity} colorMap={rarityColors} />
                  <span style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif' }}>{item.type}</span>
                  {item.weight   && parseFloat(item.weight) > 0 && <span style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif' }}>⚖ {parseFloat(item.weight).toFixed(1)} lb</span>}
                  {item.goldValue && parseFloat(item.goldValue) > 0 && <span style={{ fontSize:12, color:'#f5c842' }}>⟐ {parseFloat(item.goldValue).toLocaleString()} gp</span>}
                  {item.claimedBy && <span style={{ fontSize:12, color:'var(--muted)' }}>→ {item.claimedBy}</span>}
                </div>
                {item.notes && <div style={{ fontSize:12, color:'var(--parch2)', lineHeight:1.5 }}>{item.notes}</div>}
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button style={btnGhost} onClick={() => startEdit(item)}>Edit</button>
                <button style={btnDanger} onClick={() => module.remove(item.id)}>×</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// ── NPCs ──
function NPCs({ campaign, module }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const blank = { name:'', race:'', role:'', disposition:'Neutral', alive:true, location:'', notes:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(n) {
    setForm({ name:n.name, race:n.race||'', role:n.role||'', disposition:n.disposition||'Neutral', alive:n.alive !== false, location:n.location||'', notes:n.notes||'' })
    setEditing(n.id); setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null) }

  return (
    <div>
      <SectionHeader title="NPCs" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Add NPC" />

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <Field label="NPC name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></Field>
        <Field label="Race / type"><input style={inputStyle} value={form.race} onChange={e => setForm(f => ({...f, race: e.target.value}))} placeholder="e.g. Human, Dragon..." /></Field>
        <Field label="Role"><input style={inputStyle} value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} placeholder="e.g. Innkeeper, Villain..." /></Field>
        <Field label="Location"><input style={inputStyle} value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Where they can be found..." /></Field>
        <Field label="Disposition">
          <select style={selectStyle} value={form.disposition} onChange={e => setForm(f => ({...f, disposition: e.target.value}))}>
            {DISPOSITIONS.map(d => <option key={d} value={d} style={{background:'#16213e',color:'#f5f0e1'}}>{d}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select style={selectStyle} value={form.alive ? 'Alive' : 'Dead'} onChange={e => setForm(f => ({...f, alive: e.target.value === 'Alive'}))}>
            <option value="Alive" style={{background:'#16213e',color:'#f5f0e1'}}>Alive</option>
            <option value="Dead"  style={{background:'#16213e',color:'#f5f0e1'}}>Dead</option>
          </select>
        </Field>
      </div>
      <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:60}} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add NPC'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

      {campaign.npcs.length === 0 && !adding
        ? <EmptyState message="No NPCs tracked yet. Add key characters your party has met." />
        : campaign.npcs.map(n => (
          <div key={n.id} style={{ ...cardStyle, borderLeft:`3px solid ${dispositionColors[n.disposition]||'#888'}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:14, fontWeight:'bold', color: n.alive === false ? 'var(--muted)' : 'var(--gold2)', textDecoration: n.alive === false ? 'line-through' : 'none' }}>{n.name}</span>
                  <StatusBadge status={n.disposition} colorMap={dispositionColors} />
                  {n.alive === false && <StatusBadge status="Dead" colorMap={{ Dead:'#f09595' }} />}
                  {n.race && <span style={{ fontSize:12, color:'var(--muted)' }}>{n.race}</span>}
                  {n.role && <span style={{ fontSize:12, color:'var(--parch2)' }}>{n.role}</span>}
                </div>
                {n.location && <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>📍 {n.location}</div>}
                {n.notes    && <div style={{ fontSize:12, color:'var(--parch2)', lineHeight:1.5 }}>{n.notes}</div>}
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button style={btnGhost} onClick={() => startEdit(n)}>Edit</button>
                <button style={btnDanger} onClick={() => module.remove(n.id)}>×</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// ── Quests ──
function Quests({ campaign, module }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const blank = { name:'', giver:'', status:'Active', priority:'Medium', reward:'', notes:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(q) {
    setForm({ name:q.name, giver:q.giver||'', status:q.status||'Active', priority:q.priority||'Medium', reward:q.reward||'', notes:q.notes||'' })
    setEditing(q.id); setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null) }

  const sorted = [...campaign.quests].sort((a,b) => {
    const order = { Critical:0, High:1, Medium:2, Low:3 }
    return (order[a.priority]||2) - (order[b.priority]||2)
  })

  return (
    <div>
      <SectionHeader title="Quests" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Add quest" />

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <Field label="Quest name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Quest name..." /></Field>
        <Field label="Given by"><input style={inputStyle} value={form.giver} onChange={e => setForm(f => ({...f, giver: e.target.value}))} placeholder="NPC or organization..." /></Field>
        <Field label="Status">
          <select style={selectStyle} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
            {QUEST_STATUSES.map(s => <option key={s} value={s} style={{background:'#16213e',color:'#f5f0e1'}}>{s}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select style={selectStyle} value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))}>
            {QUEST_PRIORITIES.map(p => <option key={p} value={p} style={{background:'#16213e',color:'#f5f0e1'}}>{p}</option>)}
          </select>
        </Field>
        <Field label="Reward"><input style={inputStyle} value={form.reward} onChange={e => setForm(f => ({...f, reward: e.target.value}))} placeholder="e.g. 500 gp, magic item..." /></Field>
      </div>
      <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:60}} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add quest'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

      {campaign.quests.length === 0 && !adding
        ? <EmptyState message="No quests tracked yet. Add your party's active quests above." />
        : sorted.map(q => (
          <div key={q.id} style={{ ...cardStyle, borderLeft:`3px solid ${questStatusColors[q.status]||'#888'}` }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:14, fontWeight:'bold', color:'var(--gold2)' }}>{q.name}</span>
                  <StatusBadge status={q.status}   colorMap={questStatusColors}   />
                  <StatusBadge status={q.priority} colorMap={questPriorityColors} />
                  {q.giver  && <span style={{ fontSize:12, color:'var(--muted)' }}>from {q.giver}</span>}
                  {q.reward && <span style={{ fontSize:12, color:'#f5c842' }}>⟐ {q.reward}</span>}
                </div>
                {q.notes && <div style={{ fontSize:12, color:'var(--parch2)', lineHeight:1.5 }}>{q.notes}</div>}
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                <button style={btnGhost} onClick={() => startEdit(q)}>Edit</button>
                <button style={btnDanger} onClick={() => module.remove(q.id)}>×</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

// ── Party Spells ──────────────────────────────────────────────────────────────
function PartySpells({ campaign }) {
  const casters = campaign.characters.filter(c =>
    c.str !== undefined && // builder char
    (c.cantrips?.length > 0 || c.spells?.length > 0)
  )

  const [filter, setFilter] = useState('all') // 'all' | character id

  const ABILITY_LABELS_LOCAL = { str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma' }

  const displayed = filter === 'all' ? casters : casters.filter(c => c.id === filter)

  if (casters.length === 0) {
    return (
      <div>
        <SectionHeader title="Party Spells" />
        <EmptyState message="No spellcasters found. Build characters with spells in the Character Builder to see them here." />
      </div>
    )
  }

  return (
    <div>
      <SectionHeader title="Party Spells" />

      {/* Filter by character */}
      {casters.length > 1 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:'0.75rem' }}>
          <button
            onClick={() => setFilter('all')}
            style={{ ...btnGhost, fontSize:11, padding:'3px 10px', ...(filter === 'all' ? { borderColor:'var(--gold)', color:'var(--gold)' } : {}) }}
          >All casters</button>
          {casters.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{ ...btnGhost, fontSize:11, padding:'3px 10px', ...(filter === c.id ? { borderColor:'var(--gold)', color:'var(--gold)' } : {}) }}
            >{c.name}</button>
          ))}
        </div>
      )}

      {displayed.map(c => {
        const prof    = c.profBonus || PROF_BONUS[c.level] || 2
        const ability = c.spellcastingAbility
        const saveDC  = ability ? 8 + prof + abilityMod(c[ability] || 10) : null
        const atk     = ability ? prof + abilityMod(c[ability] || 10) : null

        return (
          <div key={c.id} style={{ ...cardStyle, borderLeft:'3px solid #d090f8' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
              <span style={{ fontSize:14, fontWeight:'bold', color:'var(--gold2)' }}>{c.name}</span>
              <span style={{ fontSize:12, color:'var(--muted)' }}>{[c.subrace||c.race, c.subclass||c.class].filter(Boolean).join(' ')} · Lvl {c.level}</span>
              {saveDC && (
                <>
                  <span style={{ fontSize:11, fontFamily:'sans-serif', color:'var(--muted)' }}>
                    {ABILITY_LABELS_LOCAL[ability] || ability} · Save DC <strong style={{ color:'#d090f8' }}>{saveDC}</strong> · Attack <strong style={{ color:'#d090f8' }}>+{atk}</strong>
                  </span>
                </>
              )}
            </div>

            {/* Spell slots */}
            {Array.isArray(c.spellSlots) && c.spellSlots.some(n => n > 0) && (
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
                {c.spellSlots.map((count, i) => count > 0 ? (
                  <span key={i} style={{ fontSize:10, fontFamily:'sans-serif', padding:'1px 8px', borderRadius:3, background:'rgba(208,144,248,.1)', border:'1px solid rgba(208,144,248,.25)', color:'#d090f8' }}>
                    L{i+1} ×{count}
                  </span>
                ) : null)}
              </div>
            )}

            {/* Cantrips */}
            {c.cantrips?.length > 0 && (
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:9, color:'#d090f8', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:5 }}>
                  Cantrips ({c.cantrips.length})
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {c.cantrips.map(s => (
                    <span key={s} style={{ fontSize:11, fontFamily:'sans-serif', padding:'2px 9px', borderRadius:4, background:'rgba(208,144,248,.1)', border:'1px solid rgba(208,144,248,.3)', color:'#d090f8' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Spells */}
            {c.spells?.length > 0 && (
              <div>
                <div style={{ fontSize:9, color:'#90b8f8', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:5 }}>
                  Spells Known / Prepared ({c.spells.length})
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {c.spells.map(s => (
                    <span key={s} style={{ fontSize:11, fontFamily:'sans-serif', padding:'2px 9px', borderRadius:4, background:'rgba(144,184,248,.08)', border:'1px solid rgba(144,184,248,.3)', color:'#90b8f8' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Combat Module (Encounter Calc + Tracker embedded in Campaign Manager) ──────
function CombatModule({ campaign }) {
  const [encounter, setEncounter] = useState(() => {
    // Pre-seed with active party members so the tracker knows about PCs
    return []
  })
  const [partySize,  setPartySize]  = useState(() => campaign.characters.filter(c => c.status === 'Active' || !c.status).length || 4)
  const [partyLevel, setPartyLevel] = useState(() => {
    const active = campaign.characters.filter(c => c.str !== undefined && (c.status === 'Active' || !c.status))
    if (!active.length) return 5
    return Math.round(active.reduce((s, c) => s + (parseInt(c.level) || 1), 0) / active.length)
  })

  function addToEncounter(name, cr) {
    setEncounter(prev => {
      const existing = prev.find(e => e.name === name)
      if (existing) return prev.map(e => e.name === name ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { name, cr, qty: 1 }]
    })
  }

  function changeQty(name, cr, delta, forceAdd = false) {
    setEncounter(prev => {
      const existing = prev.find(e => e.name === name)
      if (forceAdd && !existing) return [...prev, { name, cr, qty: 1 }]
      if (!existing) return prev
      const newQty = existing.qty + delta
      if (newQty <= 0) return prev.filter(e => e.name !== name)
      return prev.map(e => e.name === name ? { ...e, qty: newQty } : e)
    })
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem', paddingBottom:6, borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--gold)' }} />
          <span style={{ fontSize:13, fontWeight:'bold', color:'var(--gold)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Combat</span>
        </div>
      </div>

      {/* Active party summary */}
      {campaign.characters.filter(c => c.str !== undefined && (c.status === 'Active' || !c.status)).length > 0 && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:'0.75rem' }}>
          {campaign.characters
            .filter(c => c.str !== undefined && (c.status === 'Active' || !c.status))
            .map(c => (
              <span key={c.id} style={{ fontSize:11, fontFamily:'sans-serif', padding:'2px 8px', borderRadius:4, background:'rgba(144,184,248,.1)', border:'1px solid rgba(144,184,248,.25)', color:'#90b8f8' }}>
                {c.name} (Lvl {c.level})
              </span>
            ))
          }
        </div>
      )}

      <EncounterCalc
        encounter={encounter}
        partySize={partySize}
        partyLevel={partyLevel}
        onPartySize={setPartySize}
        onPartyLevel={setPartyLevel}
        onChangeQty={changeQty}
        onRemove={name => setEncounter(prev => prev.filter(e => e.name !== name))}
        onClear={() => setEncounter([])}
        campaignCharacters={campaign.characters.filter(c => c.str !== undefined && (c.status === 'Active' || !c.status))}
      />
    </div>
  )
}

// ── Main component ──
export default function CampaignManager({ onOpenBuilder, initialModule }) {
  const [activeModule, setActiveModule] = useState(initialModule || 'overview')
  const {
    campaign, updateMeta, resetCampaign, exportCampaign, importCampaign,
    characters, sessions, encounters, loot, npcs, quests,
  } = useCampaign()

  const moduleCounts = {
    characters: campaign.characters.length,
    sessions:   campaign.sessions.length,
    encounters: campaign.encounters.length,
    loot:       campaign.loot.length,
    npcs:       campaign.npcs.length,
    quests:     campaign.quests.length,
  }

  return (
    <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>
          Campaign
        </div>
        {MODULES.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', background: activeModule === m.id ? 'rgba(201,168,76,0.12)' : 'none',
              border: 'none', borderRadius: 5,
              borderLeft: activeModule === m.id ? '2px solid var(--gold)' : '2px solid transparent',
              color: activeModule === m.id ? 'var(--gold)' : 'var(--parch2)',
              fontFamily: 'Georgia, serif', fontSize: 13,
              padding: '7px 10px', cursor: 'pointer',
              marginBottom: 2, textAlign: 'left',
            }}
          >
            <span>{m.label}</span>
            {moduleCounts[m.id] > 0 && (
              <span style={{ fontSize:10, fontFamily:'sans-serif', color:'var(--muted)', background:'rgba(255,255,255,0.08)', borderRadius:10, padding:'1px 6px' }}>
                {moduleCounts[m.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {activeModule === 'overview'   && <Overview    campaign={campaign} updateMeta={updateMeta} resetCampaign={resetCampaign} exportCampaign={exportCampaign} importCampaign={importCampaign} />}
        {activeModule === 'characters' && <Characters  campaign={campaign} module={characters} onOpenBuilder={onOpenBuilder} loot={campaign.loot} sessions={campaign.sessions} />}
        {activeModule === 'sessions'   && <Sessions    campaign={campaign} module={sessions}   />}
        {activeModule === 'encounters' && <Encounters  campaign={campaign} module={encounters} />}
        {activeModule === 'loot'       && <Loot        campaign={campaign} module={loot}       />}
        {activeModule === 'npcs'       && <NPCs        campaign={campaign} module={npcs}       />}
        {activeModule === 'quests'     && <Quests      campaign={campaign} module={quests}     />}
        {activeModule === 'spells'     && <PartySpells campaign={campaign} />}
        {activeModule === 'combat'     && <CombatModule campaign={campaign} />}
      </div>
    </div>
  )
}