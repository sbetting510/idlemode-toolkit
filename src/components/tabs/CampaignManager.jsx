import { useState } from 'react'
import { useCampaign } from '../../hooks/useCampaign'

const MODULES = [
  { id: 'overview',   label: 'Overview',    icon: '⚔' },
  { id: 'characters', label: 'Characters',  icon: '🧙' },
  { id: 'sessions',   label: 'Sessions',    icon: '📖' },
  { id: 'encounters', label: 'Encounters',  icon: '⚔' },
  { id: 'loot',       label: 'Loot',        icon: '💰' },
  { id: 'npcs',       label: 'NPCs',        icon: '👥' },
  { id: 'quests',     label: 'Quests',      icon: '📜' },
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
function Overview({ campaign, updateMeta, resetCampaign }) {
  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(campaign.name)
  const [setting, setSetting] = useState(campaign.setting || '')

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
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
          Campaign data is saved automatically in your browser. Clearing browser data will erase it.
        </div>
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

// ── Characters ──
function Characters({ campaign, module }) {
  const [adding, setAdding]   = useState(false)
  const [editing, setEditing] = useState(null)
  const blank = { name:'', race:'', class:'', level:1, hp:'', maxHp:'', ac:'', status:'Active', notes:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(c) {
    setForm({ name:c.name, race:c.race||'', class:c.class||'', level:c.level||1, hp:c.hp||'', maxHp:c.maxHp||'', ac:c.ac||'', status:c.status||'Active', notes:c.notes||'' })
    setEditing(c.id)
    setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null); setForm(blank) }

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft: '3px solid var(--gold)', marginBottom: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <Field label="Name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Character name" /></Field>
        <Field label="Race"><input style={inputStyle} value={form.race} onChange={e => setForm(f => ({...f, race: e.target.value}))} placeholder="e.g. Human, Elf..." /></Field>
        <Field label="Class"><input style={inputStyle} value={form.class} onChange={e => setForm(f => ({...f, class: e.target.value}))} placeholder="e.g. Fighter, Wizard..." /></Field>
        <Field label="Level"><input style={{...inputStyle, width:80}} type="number" min="1" max="20" value={form.level} onChange={e => setForm(f => ({...f, level: parseInt(e.target.value)||1}))} /></Field>
        <Field label="Current HP"><input style={{...inputStyle}} type="number" value={form.hp} onChange={e => setForm(f => ({...f, hp: e.target.value}))} /></Field>
        <Field label="Max HP"><input style={{...inputStyle}} type="number" value={form.maxHp} onChange={e => setForm(f => ({...f, maxHp: e.target.value}))} /></Field>
        <Field label="AC"><input style={{...inputStyle, width:80}} type="number" value={form.ac} onChange={e => setForm(f => ({...f, ac: e.target.value}))} /></Field>
        <Field label="Status">
          <select style={selectStyle} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
            {CHAR_STATUSES.map(s => <option key={s} value={s} style={{background:'#16213e',color:'#f5f0e1'}}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:60}} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add character'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

  return (
    <div>
      <SectionHeader title="Characters" onAdd={() => { setAdding(true); setEditing(null); setForm(blank) }} />
      {campaign.characters.length === 0 && !adding
        ? <EmptyState message="No characters yet. Add your party members above." />
        : campaign.characters.map(c => {
          const hpPct = c.maxHp ? Math.round((parseInt(c.hp)||0) / parseInt(c.maxHp) * 100) : null
          const barColor = hpPct >= 75 ? '#90c870' : hpPct >= 40 ? '#f5c842' : '#f09595'
          return (
            <div key={c.id} style={{ ...cardStyle, borderLeft: `3px solid ${charStatusColors[c.status]||'var(--border)'}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontSize:15, fontWeight:'bold', color:'var(--gold2)' }}>{c.name}</span>
                    <StatusBadge status={c.status} colorMap={charStatusColors} />
                    {c.class && <span style={{ fontSize:12, color:'var(--muted)' }}>{c.race} {c.class}</span>}
                    {c.level && <span style={{ fontSize:12, color:'var(--gold)', fontFamily:'sans-serif' }}>Lvl {c.level}</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                    {c.maxHp && (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:12, color:'var(--muted)' }}>HP</span>
                        <span style={{ fontSize:13, fontWeight:'bold', color: barColor }}>{c.hp || 0}/{c.maxHp}</span>
                        <div style={{ width:60, height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ width:`${Math.min(hpPct,100)}%`, height:'100%', background:barColor, borderRadius:3, transition:'width 0.3s' }} />
                        </div>
                      </div>
                    )}
                    {c.ac && <span style={{ fontSize:12, color:'var(--muted)' }}>AC <strong style={{ color:'var(--parch2)' }}>{c.ac}</strong></span>}
                  </div>
                  {c.notes && <div style={{ fontSize:12, color:'var(--muted)', marginTop:6, fontStyle:'italic' }}>{c.notes}</div>}
                </div>
                <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                  <button style={btnGhost} onClick={() => startEdit(c)}>Edit</button>
                  <button style={btnDanger} onClick={() => module.remove(c.id)}>×</button>
                </div>
              </div>
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

  const sorted = [...campaign.sessions].sort((a,b) => (b.number||0) - (a.number||0))

  return (
    <div>
      <SectionHeader title="Sessions" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Log session" />
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

  return (
    <div>
      <SectionHeader title="Encounters" onAdd={() => { setAdding(true); setEditing(null) }} />
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
  const blank = { name:'', type:'Other', rarity:'Common', value:'', claimedBy:'', notes:'' }
  const [form, setForm]       = useState(blank)

  function submit() {
    if (!form.name.trim()) return
    if (editing) { module.update(editing, form); setEditing(null) }
    else { module.add(form); setAdding(false) }
    setForm(blank)
  }

  function startEdit(item) {
    setForm({ name:item.name, type:item.type||'Other', rarity:item.rarity||'Common', value:item.value||'', claimedBy:item.claimedBy||'', notes:item.notes||'' })
    setEditing(item.id); setAdding(false)
  }

  function cancel() { setAdding(false); setEditing(null) }

  {(adding || editing) && (
    <div style={{ ...cardStyle, borderLeft:'3px solid var(--gold)', marginBottom:'1rem' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <Field label="Item name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Item name..." /></Field>
        <Field label="Value / qty"><input style={inputStyle} value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))} placeholder="e.g. 250 gp" /></Field>
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
        <Field label="Claimed by"><input style={inputStyle} value={form.claimedBy} onChange={e => setForm(f => ({...f, claimedBy: e.target.value}))} placeholder="Character name..." /></Field>
      </div>
      <Field label="Notes"><textarea style={{...inputStyle, resize:'vertical', minHeight:50}} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></Field>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button style={btnPrimary} onClick={submit}>{editing ? 'Save changes' : 'Add item'}</button>
        <button style={btnGhost} onClick={cancel}>Cancel</button>
      </div>
    </div>
  )}

  return (
    <div>
      <SectionHeader title="Loot" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Add item" />
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
                  {item.value     && <span style={{ fontSize:12, color:'#f5c842' }}>{item.value}</span>}
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

  return (
    <div>
      <SectionHeader title="NPCs" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Add NPC" />
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

  const sorted = [...campaign.quests].sort((a,b) => {
    const order = { Critical:0, High:1, Medium:2, Low:3 }
    return (order[a.priority]||2) - (order[b.priority]||2)
  })

  return (
    <div>
      <SectionHeader title="Quests" onAdd={() => { setAdding(true); setEditing(null) }} addLabel="+ Add quest" />
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

// ── Main component ──
export default function CampaignManager() {
  const [activeModule, setActiveModule] = useState('overview')
  const {
    campaign, updateMeta, resetCampaign,
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
        {activeModule === 'overview'   && <Overview    campaign={campaign} updateMeta={updateMeta} resetCampaign={resetCampaign} />}
        {activeModule === 'characters' && <Characters  campaign={campaign} module={characters} />}
        {activeModule === 'sessions'   && <Sessions    campaign={campaign} module={sessions}   />}
        {activeModule === 'encounters' && <Encounters  campaign={campaign} module={encounters} />}
        {activeModule === 'loot'       && <Loot        campaign={campaign} module={loot}       />}
        {activeModule === 'npcs'       && <NPCs        campaign={campaign} module={npcs}       />}
        {activeModule === 'quests'     && <Quests      campaign={campaign} module={quests}     />}
      </div>
    </div>
  )
}