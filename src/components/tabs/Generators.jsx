import { useState } from 'react'
import { useCampaign } from '../../hooks/useCampaign'
import { generateNames, RACE_TO_NAME_KEY } from '../../data/nameData'
import {
  SURNAMES, TAVERN_ADJ, TAVERN_NOUN, TAVERN_CREATURE, TAVERN_NAME_SUFFIX,
  NPC_RACES, QUEST_THEMES, GENERATOR_STATS,
  generateTavernName, generateTownName, generateNPC, generateQuest, generateLoot, pick,
} from '../../data/generatorData'

const S = {
  card:  { background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:8, padding:'1rem', marginBottom:'1rem' },
  title: { fontSize:13, fontWeight:'bold', color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 },
  sub:   { fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:'0.75rem' },
  btn:   { background:'var(--crimson)', border:'1px solid rgba(201,168,76,.5)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 14px', cursor:'pointer', fontWeight:'bold' },
  btnGold: { background:'rgba(201,168,76,.12)', border:'1px solid var(--gold)', borderRadius:5, color:'var(--gold)', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 14px', cursor:'pointer' },
  btnGhost:{ background:'none', border:'1px solid var(--border)', borderRadius:5, color:'var(--muted)', fontFamily:'Georgia,serif', fontSize:11, padding:'4px 10px', cursor:'pointer' },
  result:{ background:'rgba(255,255,255,.06)', border:'1px solid var(--border2)', borderRadius:6, padding:'8px 12px', marginTop:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 },
  resultText: { fontSize:15, color:'var(--parch)', fontFamily:'Georgia,serif', fontWeight:'bold', flex:1 },
  chip: { fontSize:10, fontFamily:'sans-serif', padding:'1px 7px', borderRadius:10, background:'rgba(201,168,76,.12)', border:'1px solid rgba(201,168,76,.3)', color:'var(--gold)' },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    })
  }
  return (
    <button onClick={copy} style={{ ...S.btnGhost, fontSize:10, padding:'2px 8px', color: copied ? '#90c870' : 'var(--muted)', borderColor: copied ? 'rgba(144,200,112,.4)' : 'var(--border)' }}>
      {copied ? '✓ Copied' : '📋'}
    </button>
  )
}

function StatBadge({ label, value }) {
  return (
    <div style={{ textAlign:'center', padding:'6px 12px', background:'rgba(201,168,76,.06)', border:'1px solid rgba(201,168,76,.2)', borderRadius:6 }}>
      <div style={{ fontSize:14, fontWeight:'bold', color:'var(--gold)' }}>{value}</div>
      <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginTop:1 }}>{label}</div>
    </div>
  )
}

// ── Name Generator ─────────────────────────────────────────────────────────────
function NameGen() {
  const ALL_RACES = ['Human (Nordic)','Human (Mediterranean)','Human (Slavic)','Human (Celtic)','Human (Eastern)','Elf','Dwarf','Halfling','Gnome','Half-Orc','Tiefling','Dragonborn','Half-Elf']
  const RACE_MAP = { 'Human (Nordic)':'Human','Human (Mediterranean)':'Human','Human (Slavic)':'Human','Human (Celtic)':'Human','Human (Eastern)':'Human', Elf:'Elf',Dwarf:'Dwarf',Halfling:'Halfling',Gnome:'Gnome','Half-Orc':'Half-Orc',Tiefling:'Tiefling',Dragonborn:'Dragonborn','Half-Elf':'Half-Elf' }
  const [race, setRace]     = useState('Human (Nordic)')
  const [gender, setGender] = useState('any')
  const [results, setResults] = useState([])

  function generate() {
    const firstNames = generateNames(race, gender, 8)
    const surnamePool = SURNAMES[RACE_MAP[race]] || SURNAMES.Human
    const full = firstNames.map(fn => `${fn} ${pick(surnamePool)}`)
    setResults(full)
  }

  return (
    <div style={S.card}>
      <div style={S.title}>⚔ Character Names</div>
      <div style={S.sub}>Race-specific first names combined with cultural surnames. {GENERATOR_STATS.names} unique combinations.</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, alignItems:'flex-end', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>Race / Culture</div>
          <select value={race} onChange={e=>setRace(e.target.value)} style={{ background:'#16213e', border:'1px solid var(--border2)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 8px', outline:'none', cursor:'pointer', width:'100%' }}>
            <optgroup label="Human" style={{background:'#16213e'}}>
              {['Human (Nordic)','Human (Mediterranean)','Human (Slavic)','Human (Celtic)','Human (Eastern)'].map(r=><option key={r} value={r} style={{background:'#16213e'}}>{r}</option>)}
            </optgroup>
            <optgroup label="Other Races" style={{background:'#16213e'}}>
              {['Elf','Dwarf','Halfling','Gnome','Half-Orc','Tiefling','Dragonborn','Half-Elf'].map(r=><option key={r} value={r} style={{background:'#16213e'}}>{r}</option>)}
            </optgroup>
          </select>
        </div>
        <div>
          <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>Gender</div>
          <select value={gender} onChange={e=>setGender(e.target.value)} style={{ background:'#16213e', border:'1px solid var(--border2)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 8px', outline:'none', cursor:'pointer', width:'100%' }}>
            <option value="any" style={{background:'#16213e'}}>Any</option>
            <option value="masculine" style={{background:'#16213e'}}>Masculine</option>
            <option value="feminine" style={{background:'#16213e'}}>Feminine</option>
          </select>
        </div>
        <button style={S.btn} onClick={generate}>🎲 Generate</button>
      </div>
      {results.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {results.map(n=>(
            <div key={n} style={{ ...S.result, padding:'4px 12px', flex:'none' }}>
              <span style={{ fontSize:13, color:'var(--parch)', fontFamily:'Georgia,serif' }}>{n}</span>
              <CopyButton text={n} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tavern Generator ───────────────────────────────────────────────────────────
function TavernGen() {
  const [results, setResults] = useState([])
  function generate() {
    setResults(Array.from({length:8}, generateTavernName))
  }
  return (
    <div style={S.card}>
      <div style={S.title}>🍺 Tavern Names</div>
      <div style={S.sub}>{GENERATOR_STATS.taverns} unique combinations across 5 name formats.</div>
      <button style={S.btn} onClick={generate}>🎲 Generate</button>
      {results.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginTop:8 }}>
          {results.map((n,i)=>(
            <div key={i} style={S.result}>
              <span style={S.resultText}>{n}</span>
              <CopyButton text={n} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Town Generator ─────────────────────────────────────────────────────────────
function TownGen() {
  const [results, setResults] = useState([])
  function generate() {
    setResults(Array.from({length:8}, generateTownName))
  }
  return (
    <div style={S.card}>
      <div style={S.title}>🏰 Town Names</div>
      <div style={S.sub}>{GENERATOR_STATS.towns} unique combinations from {/* TOWN_PREFIX.length */}250+ prefixes and 150+ suffixes.</div>
      <button style={S.btn} onClick={generate}>🎲 Generate</button>
      {results.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
          {results.map((n,i)=>(
            <div key={i} style={{ ...S.result, flex:'none', padding:'4px 12px' }}>
              <span style={{ fontSize:13, color:'var(--parch)', fontFamily:'Georgia,serif' }}>{n}</span>
              <CopyButton text={n} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── NPC Generator ──────────────────────────────────────────────────────────────
function NPCGen() {
  const { npcs } = useCampaign()
  const [result, setResult] = useState(null)
  const [saved, setSaved]   = useState(false)

  function generate() { setResult(generateNPC()); setSaved(false) }

  function saveToManager() {
    if (!result) return
    npcs.add(result)
    setSaved(true)
  }

  const inputStyle = { background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'5px 8px', outline:'none', width:'100%' }

  return (
    <div style={S.card}>
      <div style={S.title}>👥 NPC Generator</div>
      <div style={S.sub}>Race, occupation, appearance, personality, motivation, secret, and quirk — all combined. {GENERATOR_STATS.npcs} of unique NPCs.</div>
      <button style={S.btn} onClick={generate}>🎲 Generate NPC</button>

      {result && (
        <div style={{ marginTop:10, background:'rgba(255,255,255,.03)', border:'1px solid rgba(201,168,76,.2)', borderRadius:8, padding:'1rem' }}>
          <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8 }}>Edit before saving</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
            <div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>NAME</div>
              <input style={inputStyle} value={result.name} onChange={e => setResult(r => ({...r, name: e.target.value}))} />
            </div>
            <div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>RACE · ROLE</div>
              <div style={{ display:'flex', gap:6 }}>
                <input style={{...inputStyle, flex:1}} value={result.race} onChange={e => setResult(r => ({...r, race: e.target.value}))} />
                <input style={{...inputStyle, flex:1}} value={result.role} onChange={e => setResult(r => ({...r, role: e.target.value}))} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>NOTES</div>
            <textarea
              style={{ ...inputStyle, resize:'vertical', minHeight:80, lineHeight:1.6 }}
              value={result.notes}
              onChange={e => setResult(r => ({...r, notes: e.target.value}))}
            />
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <span style={{ ...S.chip }}>{result.disposition}</span>
            <div style={{ display:'flex', gap:6 }}>
              <CopyButton text={`${result.name}\n${result.race} ${result.role}\n${result.notes}`} />
              <button style={{ ...S.btnGold, fontSize:11, padding:'4px 10px' }} onClick={saveToManager} disabled={saved}>
                {saved ? '✓ Saved' : '+ Add to Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Quest Generator ────────────────────────────────────────────────────────────
function QuestGen() {
  const { quests } = useCampaign()
  const THEMES = Object.keys(QUEST_THEMES)
  const [theme, setTheme] = useState('any')
  const [result, setResult] = useState(null)
  const [saved, setSaved]   = useState(false)

  function generate() {
    const t = theme === 'any' ? pick(THEMES) : theme
    setResult(generateQuest(t)); setSaved(false)
  }

  function saveToManager() {
    if (!result) return
    quests.add(result)
    setSaved(true)
  }

  return (
    <div style={S.card}>
      <div style={S.title}>📜 Quest Hooks</div>
      <div style={S.sub}>10 themed categories. {GENERATOR_STATS.quests} unique hook combinations with randomised locations, clients, objectives, and twists.</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8, alignItems:'flex-end', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>Theme</div>
          <select value={theme} onChange={e=>setTheme(e.target.value)} style={{ background:'#16213e', border:'1px solid var(--border2)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 8px', outline:'none', cursor:'pointer', width:'100%' }}>
            <option value="any" style={{background:'#16213e'}}>Any Theme</option>
            {THEMES.map(t=><option key={t} value={t} style={{background:'#16213e'}}>{QUEST_THEMES[t].label}</option>)}
          </select>
        </div>
        <button style={S.btn} onClick={generate}>🎲 Generate</button>
      </div>

      {result && (
        <div style={{ marginTop:8, background:'rgba(255,255,255,.03)', border:'1px solid rgba(201,168,76,.2)', borderRadius:8, padding:'1rem' }}>
          <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:8 }}>Edit before saving</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
            <div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>TITLE</div>
              <input style={{ background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'5px 8px', outline:'none', width:'100%' }}
                value={result.name} onChange={e => setResult(r => ({...r, name: e.target.value}))} />
            </div>
            <div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>GIVEN BY</div>
              <input style={{ background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'5px 8px', outline:'none', width:'100%' }}
                value={result.giver} onChange={e => setResult(r => ({...r, giver: e.target.value}))} />
            </div>
            <div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>REWARD</div>
              <input style={{ background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'5px 8px', outline:'none', width:'100%' }}
                value={result.reward} onChange={e => setResult(r => ({...r, reward: e.target.value}))} />
            </div>
            <div>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>PRIORITY</div>
              <select style={{ background:'#16213e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'5px 8px', outline:'none', cursor:'pointer', width:'100%' }}
                value={result.priority} onChange={e => setResult(r => ({...r, priority: e.target.value}))}>
                {['Critical','High','Medium','Low'].map(p => <option key={p} value={p} style={{background:'#16213e'}}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:3 }}>HOOK / DESCRIPTION</div>
            <textarea
              style={{ background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'5px 8px', outline:'none', width:'100%', resize:'vertical', minHeight:90, lineHeight:1.6 }}
              value={result.notes}
              onChange={e => setResult(r => ({...r, notes: e.target.value}))}
            />
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <span style={S.chip}>{result.priority} Priority</span>
            <div style={{ display:'flex', gap:6 }}>
              <CopyButton text={`${result.name}\nFrom: ${result.giver}\nReward: ${result.reward}\n\n${result.notes}`} />
              <button style={{ ...S.btnGold, fontSize:11, padding:'4px 10px' }} onClick={saveToManager} disabled={saved}>
                {saved ? '✓ Saved' : '+ Add to Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Loot Generator ────────────────────────────────────────────────────────────
const RARITIES = ['any','Common','Uncommon','Rare','Very Rare','Legendary','Artifact']
const rarityColors = { Common:'#888', Uncommon:'#90c870', Rare:'#90b8f8', 'Very Rare':'#d090f8', Legendary:'#f5c842', Artifact:'#ff9999' }

function LootGen() {
  const { loot } = useCampaign()
  const [rarity, setRarity]  = useState('any')
  const [results, setResults] = useState([])
  const [saved, setSaved]     = useState({})

  function generate() {
    setResults(Array.from({ length: 6 }, () => generateLoot(rarity)))
    setSaved({})
  }

  function saveItem(item, idx) {
    loot.add(item)
    setSaved(s => ({ ...s, [idx]: true }))
  }

  const inputStyle = { background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:4, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'4px 8px', outline:'none', width:'100%' }

  return (
    <div style={S.card}>
      <div style={S.title}>💰 Loot Generator</div>
      <div style={S.sub}>Weapons, armor, magic items, and potions — with rarity, weight, gold value, and flavour descriptions.</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8, alignItems:'flex-end', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:3 }}>Rarity Filter</div>
          <select value={rarity} onChange={e => setRarity(e.target.value)} style={{ background:'#16213e', border:'1px solid var(--border2)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 8px', outline:'none', cursor:'pointer', width:'100%' }}>
            {RARITIES.map(r => <option key={r} value={r} style={{background:'#16213e'}}>{r === 'any' ? 'Any Rarity' : r}</option>)}
          </select>
        </div>
        <button style={S.btn} onClick={generate}>🎲 Generate</button>
      </div>

      {results.map((item, idx) => {
        const color = rarityColors[item.rarity] || '#888'
        return (
          <div key={idx} style={{ background:'rgba(255,255,255,.03)', border:`1px solid ${color}44`, borderLeft:`3px solid ${color}`, borderRadius:6, padding:'8px 10px', marginTop:6 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:6 }}>
              <div>
                <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:2 }}>NAME</div>
                <input style={inputStyle} value={item.name} onChange={e => setResults(rs => rs.map((r,i) => i===idx ? {...r, name:e.target.value} : r))} />
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:2 }}>WEIGHT (lb)</div>
                  <input style={inputStyle} type="number" min="0" step="0.1" value={item.weight} onChange={e => setResults(rs => rs.map((r,i) => i===idx ? {...r, weight:e.target.value} : r))} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:2 }}>VALUE (gp)</div>
                  <input style={inputStyle} type="number" min="0" value={item.goldValue} onChange={e => setResults(rs => rs.map((r,i) => i===idx ? {...r, goldValue:e.target.value} : r))} />
                </div>
              </div>
            </div>
            <div style={{ marginBottom:6 }}>
              <div style={{ fontSize:9, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:2 }}>DESCRIPTION</div>
              <input style={inputStyle} value={item.notes} onChange={e => setResults(rs => rs.map((r,i) => i===idx ? {...r, notes:e.target.value} : r))} />
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
              <div style={{ display:'flex', gap:4 }}>
                <span style={{ fontSize:10, fontFamily:'sans-serif', padding:'1px 7px', borderRadius:10, background:`${color}22`, border:`1px solid ${color}55`, color }}>{item.rarity}</span>
                <span style={{ fontSize:10, fontFamily:'sans-serif', padding:'1px 7px', borderRadius:10, background:'rgba(255,255,255,.06)', border:'1px solid var(--border)', color:'var(--muted)' }}>{item.type}</span>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <CopyButton text={`${item.name} (${item.rarity} ${item.type})\nWeight: ${item.weight} lb | Value: ${item.goldValue} gp\n${item.notes}`} />
                <button style={{ ...S.btnGold, fontSize:10, padding:'2px 8px' }} onClick={() => saveItem(item, idx)} disabled={saved[idx]}>
                  {saved[idx] ? '✓ Saved' : '+ Add to Loot'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Generators() {
  return (
    <div>
      {/* Stats header */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8, marginBottom:'1.5rem' }}>
        <StatBadge label="Character Names" value={GENERATOR_STATS.names} />
        <StatBadge label="Tavern Names" value={GENERATOR_STATS.taverns} />
        <StatBadge label="Town Names" value={GENERATOR_STATS.towns} />
        <StatBadge label="NPC Combinations" value={GENERATOR_STATS.npcs} />
        <StatBadge label="Quest Hooks" value={GENERATOR_STATS.quests} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div>
          <NameGen />
          <TavernGen />
          <TownGen />
          <LootGen />
        </div>
        <div>
          <NPCGen />
          <QuestGen />
        </div>
      </div>
    </div>
  )
}
