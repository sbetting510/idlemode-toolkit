import { useState, useCallback, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useVersion } from '../../context/VersionContext'
import { useCampaign } from '../../hooks/useCampaign'
import {
  RACES, CLASSES, BACKGROUNDS, SKILLS, ABILITIES, ABILITY_LABELS, ABILITY_SHORT,
  ALIGNMENTS, STANDARD_ARRAY, POINT_BUY_COSTS, POINT_BUY_BUDGET,
  POINT_BUY_MIN, POINT_BUY_MAX, PROF_BONUS, LANGUAGES, TOOLS,
  abilityMod, modStr, getSpellSlots, XP_LEVELS,
} from '../../data/characterData'
import {
  getClassSpellList, getCantripsKnown, getSpellsKnownCount,
} from '../../data/spellLists'
import { SPELLS } from '../../data/spells'
import { SPELLS_2024 } from '../../data/spells2024'
import { generateNames, RACE_TO_NAME_KEY } from '../../data/nameData'

// ── Shared styles ─────────────────────────────────────────────────────────────
const S = {
  card:  { background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:8, padding:'1rem' },
  input: { width:'100%', background:'#1a1a2e', border:'1px solid var(--border2)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:13, padding:'7px 10px', outline:'none' },
  select:{ background:'#16213e', border:'1px solid var(--border2)', borderRadius:5, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:13, padding:'7px 8px', outline:'none', cursor:'pointer', width:'100%' },
  label: { fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', letterSpacing:'.05em', textTransform:'uppercase', display:'block', marginBottom:4 },
  btnPrimary:{ background:'var(--crimson)', border:'1px solid rgba(201,168,76,.5)', borderRadius:6, color:'#f5f0e1', fontFamily:'Georgia,serif', fontSize:13, padding:'8px 18px', cursor:'pointer', fontWeight:'bold' },
  btnGold:   { background:'rgba(201,168,76,.15)', border:'1px solid var(--gold)', borderRadius:6, color:'var(--gold)', fontFamily:'Georgia,serif', fontSize:13, padding:'8px 18px', cursor:'pointer' },
  btnGhost:  { background:'none', border:'1px solid var(--border)', borderRadius:5, color:'var(--muted)', fontFamily:'Georgia,serif', fontSize:12, padding:'6px 14px', cursor:'pointer' },
  sectionTitle: { fontSize:11, color:'var(--gold)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:10, paddingBottom:5, borderBottom:'1px solid rgba(201,168,76,.2)' },
}

// ── Blank character template ──────────────────────────────────────────────────
const BLANK_CHAR = {
  name:'', playerName:'', level:1, xp:0, alignment:'True Neutral',
  race:'', subrace:'', dragonAncestry:'',
  class:'', subclass:'',
  background:'',
  str:10, dex:10, con:10, int:10, wis:10, cha:10,
  scoreMethod:'standard', scoresConfirmed:false,
  hp:'', maxHp:'', ac:10, initiative:0, speed:30, profBonus:2,
  passivePerception:10, inspiration:false,
  savingThrows:[], skillProfs:[], toolProfs:[], languages:['Common'],
  features:[], racialTraits:[],
  spellcastingAbility:'', spellSlots:[], cantrips:[], spells:[],
  equipment:[], cp:0, sp:0, ep:0, gp:0, pp:0,
  age:'', height:'', weight:'', eyes:'', hair:'', skin:'', appearance:'',
  personalityTrait:'', ideal:'', bond:'', flaw:'', backstory:'',
  status:'Active', notes:'',
}

const STEPS = [
  { id:'name',       label:'Name & Basics',    icon:'✏️' },
  { id:'race',       label:'Race',             icon:'🧬' },
  { id:'class',      label:'Class',            icon:'⚔️' },
  { id:'background', label:'Background',       icon:'📜' },
  { id:'scores',     label:'Ability Scores',   icon:'🎲' },
  { id:'skills',     label:'Skills',           icon:'🎯' },
  { id:'equipment',  label:'Equipment',        icon:'🎒' },
  { id:'spells',     label:'Spells',           icon:'✨' },
  { id:'appearance', label:'Appearance',       icon:'🪞' },
  { id:'review',     label:'Review & Save',    icon:'📋' },
]

// ── Sub-component: NameGenerator ─────────────────────────────────────────────
const HUMAN_VARIANTS = ['Human (Nordic)','Human (Mediterranean)','Human (Slavic)','Human (Celtic)','Human (Eastern)']
const NON_HUMAN_KEYS = ['Elf','Dwarf','Halfling','Gnome','Half-Orc','Tiefling','Dragonborn','Half-Elf']

// Reverse map: generator key → toolkit race name used in RACES data
const NAME_KEY_TO_RACE = {
  'Human (Nordic)': 'Human', 'Human (Mediterranean)': 'Human',
  'Human (Slavic)': 'Human', 'Human (Celtic)': 'Human', 'Human (Eastern)': 'Human',
  'Elf': 'Elf', 'Dwarf': 'Dwarf', 'Halfling': 'Halfling', 'Gnome': 'Gnome',
  'Half-Orc': 'Half-Orc', 'Tiefling': 'Tiefling', 'Dragonborn': 'Dragonborn', 'Half-Elf': 'Half-Elf',
}

function NameGenerator({ race, onSelect, onRaceSelect }) {
  const [gender, setGender] = useState('any')
  const [selectedRace, setSelectedRace] = useState(() => {
    if (!race) return 'Human (Nordic)'
    const mapped = RACE_TO_NAME_KEY[race]
    return mapped || 'Human (Nordic)'
  })
  const [names, setNames] = useState([])

  // Fire on mount so the default selection updates char.race immediately,
  // even if the user never touches the dropdown.
  useEffect(() => {
    if (onRaceSelect) onRaceSelect(NAME_KEY_TO_RACE[selectedRace] || 'Human')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only on mount

  function handleRaceChange(key) {
    setSelectedRace(key)
    setNames([])
    if (onRaceSelect) onRaceSelect(NAME_KEY_TO_RACE[key] || 'Human')
  }

  function generate() {
    setNames(generateNames(selectedRace, gender, 8))
  }

  return (
    <div style={{ ...S.card, borderColor:'rgba(201,168,76,.3)', background:'rgba(201,168,76,.04)', marginTop:8 }}>
      <div style={S.sectionTitle}>✨ Name Generator</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:8, alignItems:'flex-end' }}>
        <div>
          <label style={S.label}>Race / Culture</label>
          <select style={S.select} value={selectedRace} onChange={e => handleRaceChange(e.target.value)}>
            <optgroup label="Human" style={{background:'#16213e'}}>
              {HUMAN_VARIANTS.map(v => <option key={v} value={v} style={{background:'#16213e'}}>{v}</option>)}
            </optgroup>
            <optgroup label="Other Races" style={{background:'#16213e'}}>
              {NON_HUMAN_KEYS.map(v => <option key={v} value={v} style={{background:'#16213e'}}>{v}</option>)}
            </optgroup>
          </select>
        </div>
        <div>
          <label style={S.label}>Gender</label>
          <select style={S.select} value={gender} onChange={e => setGender(e.target.value)}>
            <option value="any">Any</option>
            <option value="masculine">Masculine</option>
            <option value="feminine">Feminine</option>
          </select>
        </div>
        <button style={{ ...S.btnGold, whiteSpace:'nowrap' }} onClick={generate}>Roll Names</button>
      </div>
      {names.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {names.map(n => (
            <button key={n} onClick={() => onSelect(n)} style={{
              background:'rgba(255,255,255,.06)', border:'1px solid var(--border2)',
              borderRadius:4, color:'var(--parch2)', fontFamily:'Georgia,serif',
              fontSize:13, padding:'4px 12px', cursor:'pointer',
            }}
            onMouseEnter={e => { e.target.style.borderColor='var(--gold)'; e.target.style.color='var(--gold)' }}
            onMouseLeave={e => { e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--parch2)' }}
            >{n}</button>
          ))}
        </div>
      )}
      {names.length === 0 && (
        <div style={{ fontSize:12, color:'var(--muted)', fontStyle:'italic' }}>Select a race/culture and click "Roll Names" to generate suggestions.</div>
      )}
    </div>
  )
}

// ── Sub-component: AbilityBlock ───────────────────────────────────────────────
function AbilityBlock({ scores, compact = false }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns: compact ? 'repeat(3,1fr)' : 'repeat(6,1fr)', gap: compact ? 4 : 6 }}>
      {ABILITIES.map(ab => (
        <div key={ab} style={{ textAlign:'center', background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:6, padding: compact ? '5px 2px' : '8px 4px' }}>
          <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'sans-serif', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:2 }}>{ABILITY_SHORT[ab]}</div>
          <div style={{ fontSize: compact ? 14 : 18, fontWeight:'bold', color:'var(--parch)' }}>{scores[ab] || 10}</div>
          <div style={{ fontSize:11, color: abilityMod(scores[ab]||10) >= 0 ? '#90c870' : '#f09595' }}>{modStr(scores[ab]||10)}</div>
        </div>
      ))}
    </div>
  )
}

// ── Step 1: Name & Basics ─────────────────────────────────────────────────────
function StepName({ char, setChar }) {
  const [showGen, setShowGen] = useState(false)
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={S.label}>Character Name *</label>
          <div style={{ display:'flex', gap:8 }}>
            <input style={S.input} value={char.name} onChange={e => setChar(c=>({...c,name:e.target.value}))} placeholder="Enter character name..." />
            <button style={S.btnGhost} onClick={() => setShowGen(v=>!v)} title="Open name generator">✨</button>
          </div>
          {showGen && (
            <NameGenerator
              race={char.race}
              onSelect={n => { setChar(c=>({...c,name:n})); setShowGen(false) }}
              onRaceSelect={r => setChar(c => ({ ...c, race: r, subrace: '' }))}
            />
          )}
        </div>
        <div>
          <label style={S.label}>Player Name</label>
          <input style={S.input} value={char.playerName} onChange={e => setChar(c=>({...c,playerName:e.target.value}))} placeholder="Your name (optional)" />
        </div>
        <div>
          <label style={S.label}>Alignment</label>
          <select style={S.select} value={char.alignment} onChange={e => setChar(c=>({...c,alignment:e.target.value}))}>
            {ALIGNMENTS.map(a => <option key={a} value={a} style={{background:'#16213e'}}>{a}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}>Level</label>
          <input style={S.input} type="number" min={1} max={20} value={char.level} onChange={e => setChar(c=>({...c, level:parseInt(e.target.value)||1, profBonus:PROF_BONUS[parseInt(e.target.value)||1]||2 }))} />
        </div>
        <div>
          <label style={S.label}>Experience Points</label>
          <input style={S.input} type="number" min={0} value={char.xp} onChange={e => setChar(c=>({...c,xp:parseInt(e.target.value)||0}))} />
          <div style={{ fontSize:10, color:'var(--muted)', marginTop:3, fontFamily:'sans-serif' }}>Next level at: {XP_LEVELS[char.level] ? XP_LEVELS[char.level].toLocaleString() : 'Max'} XP</div>
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Race ──────────────────────────────────────────────────────────────
function StepRace({ char, setChar }) {
  const raceObj = RACES.find(r => r.name === char.race)
  const subraceObj = raceObj?.subraces.find(s => s.name === char.subrace)

  function selectRace(raceName) {
    const r = RACES.find(x => x.name === raceName)
    setChar(c => ({
      ...c, race: raceName, subrace: r?.subraces[0]?.name || '',
      speed: r?.speed || 30,
      dragonAncestry: raceName === 'Dragonborn' ? (r?.dragonAncestry?.[0] || '') : '',
    }))
  }

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:8, marginBottom:16 }}>
        {RACES.map(r => (
          <button key={r.name} onClick={() => selectRace(r.name)} style={{
            background: char.race === r.name ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
            border: char.race === r.name ? '2px solid var(--gold)' : '1px solid var(--border)',
            borderRadius:8, padding:'10px 8px', cursor:'pointer', textAlign:'center',
            color: char.race === r.name ? 'var(--gold)' : 'var(--parch2)',
            fontFamily:'Georgia,serif', fontSize:13,
          }}>
            <div style={{ fontSize:22, marginBottom:4 }}>
              {r.name==='Human'?'🧑':r.name==='Elf'?'🧝':r.name==='Dwarf'?'⛏️':r.name==='Halfling'?'🌻':r.name==='Gnome'?'🔮':r.name==='Half-Elf'?'🌙':r.name==='Half-Orc'?'💪':r.name==='Tiefling'?'😈':'🐉'}
            </div>
            {r.name}
          </button>
        ))}
      </div>

      {raceObj && (
        <div style={{ ...S.card, marginBottom:12 }}>
          <div style={S.sectionTitle}>{raceObj.name} Traits</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:10, fontSize:12, fontFamily:'sans-serif' }}>
            <div><span style={{ color:'var(--muted)' }}>Size:</span> <strong>{raceObj.size}</strong></div>
            <div><span style={{ color:'var(--muted)' }}>Speed:</span> <strong>{char.subrace && subraceObj?.speed ? subraceObj.speed : raceObj.speed}ft</strong></div>
            <div><span style={{ color:'var(--muted)' }}>ASI:</span> <strong style={{ color:'#90c870' }}>{Object.entries(raceObj.asi).filter(([k])=>k!=='_choice2').map(([k,v])=>`${ABILITY_SHORT[k]} +${v}`).join(', ') || 'Choice'}</strong></div>
          </div>
          <div style={{ fontSize:12, color:'var(--parch2)', marginBottom:8 }}>
            <strong style={{ color:'var(--gold)' }}>Traits:</strong> {raceObj.traits.join(' · ')}
          </div>
          <div style={{ fontSize:12, color:'var(--parch2)' }}>
            <strong style={{ color:'var(--gold)' }}>Languages:</strong> {raceObj.languages?.join(', ')}
          </div>
        </div>
      )}

      {raceObj?.subraces.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <label style={S.label}>Subrace</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {raceObj.subraces.map(sr => (
              <button key={sr.name} onClick={() => setChar(c=>({...c, subrace:sr.name, speed: sr.speed || raceObj.speed }))} style={{
                background: char.subrace===sr.name ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
                border: char.subrace===sr.name ? '1px solid var(--gold)' : '1px solid var(--border)',
                borderRadius:6, padding:'6px 14px', cursor:'pointer',
                color: char.subrace===sr.name ? 'var(--gold)' : 'var(--parch2)',
                fontFamily:'Georgia,serif', fontSize:13,
              }}>
                {sr.name}
              </button>
            ))}
          </div>
          {subraceObj && (
            <div style={{ fontSize:12, color:'var(--parch2)', marginTop:8, padding:8, background:'rgba(255,255,255,.03)', borderRadius:6 }}>
              <strong style={{ color:'var(--gold)' }}>Additional ASI:</strong> {Object.entries(subraceObj.asi||{}).map(([k,v])=>`${ABILITY_SHORT[k]} +${v}`).join(', ')}
              {' · '}<strong style={{ color:'var(--gold)' }}>Bonus Traits:</strong> {subraceObj.traits?.join(' · ')}
            </div>
          )}
        </div>
      )}

      {char.race === 'Dragonborn' && (
        <div>
          <label style={S.label}>Draconic Ancestry</label>
          <select style={S.select} value={char.dragonAncestry} onChange={e => setChar(c=>({...c,dragonAncestry:e.target.value}))}>
            {RACES.find(r=>r.name==='Dragonborn')?.dragonAncestry.map(a=><option key={a} value={a} style={{background:'#16213e'}}>{a}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

// ── Step 3: Class ─────────────────────────────────────────────────────────────
function StepClass({ char, setChar }) {
  const classObj = CLASSES.find(c => c.name === char.class)
  const showSubclass = classObj && char.level >= classObj.subclassLevel

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))', gap:8, marginBottom:16 }}>
        {CLASSES.map(cl => (
          <button key={cl.name} onClick={() => setChar(c=>({...c, class:cl.name, subclass:'', spellcastingAbility: cl.spellcastingAbility||'' }))} style={{
            background: char.class===cl.name ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
            border: char.class===cl.name ? '2px solid var(--gold)' : '1px solid var(--border)',
            borderRadius:8, padding:'8px 6px', cursor:'pointer', textAlign:'center',
            color: char.class===cl.name ? 'var(--gold)' : 'var(--parch2)',
            fontFamily:'Georgia,serif', fontSize:12,
          }}>
            {cl.name}
          </button>
        ))}
      </div>

      {classObj && (
        <div style={{ ...S.card, marginBottom:12 }}>
          <div style={S.sectionTitle}>{classObj.name}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6, fontSize:12, fontFamily:'sans-serif', marginBottom:10 }}>
            <div><span style={{ color:'var(--muted)' }}>Hit Die:</span> <strong>d{classObj.hitDie}</strong></div>
            <div><span style={{ color:'var(--muted)' }}>Primary:</span> <strong>{ABILITY_LABELS[classObj.primaryAbility]}</strong></div>
            <div><span style={{ color:'var(--muted)' }}>Saves:</span> <strong>{classObj.savingThrows.map(s=>ABILITY_SHORT[s]).join(', ')}</strong></div>
            <div><span style={{ color:'var(--muted)' }}>Spellcasting:</span> <strong style={{ color: classObj.spellcasting ? '#90b8f8' : 'var(--muted)' }}>{classObj.spellcasting ? `${classObj.spellcastingAbility?.toUpperCase()} (${classObj.spellcasting})` : 'None'}</strong></div>
            <div style={{ gridColumn:'1/-1' }}><span style={{ color:'var(--muted)' }}>Armor:</span> <strong>{classObj.armorProfs.join(', ') || 'None'}</strong></div>
            <div style={{ gridColumn:'1/-1' }}><span style={{ color:'var(--muted)' }}>Weapons:</span> <strong>{classObj.weaponProfs.join(', ')}</strong></div>
          </div>
          <div style={{ fontSize:12, color:'var(--parch2)' }}>
            <strong style={{ color:'var(--gold)' }}>Skills:</strong> Choose {classObj.skillCount} from {classObj.skillChoices === 'any' ? 'any skills' : classObj.skillChoices.join(', ')}
          </div>
          {classObj.features[1] && (
            <div style={{ fontSize:12, color:'var(--parch2)', marginTop:6 }}>
              <strong style={{ color:'var(--gold)' }}>Level 1 Features:</strong> {classObj.features[1].join(', ')}
            </div>
          )}
        </div>
      )}

      {showSubclass && (
        <div>
          <label style={S.label}>{classObj.subclassLabel}</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {classObj.subclasses.map(sc => (
              <button key={sc} onClick={() => setChar(c=>({...c,subclass:sc}))} style={{
                background: char.subclass===sc ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
                border: char.subclass===sc ? '1px solid var(--gold)' : '1px solid var(--border)',
                borderRadius:6, padding:'6px 12px', cursor:'pointer',
                color: char.subclass===sc ? 'var(--gold)' : 'var(--parch2)',
                fontFamily:'Georgia,serif', fontSize:12,
              }}>{sc}</button>
            ))}
          </div>
          {!char.subclass && <div style={{ fontSize:11, color:'var(--muted)', marginTop:6, fontStyle:'italic' }}>Select your {classObj.subclassLabel} (available at level {classObj.subclassLevel})</div>}
        </div>
      )}
      {classObj && !showSubclass && (
        <div style={{ fontSize:12, color:'var(--muted)', fontStyle:'italic', marginTop:8 }}>
          {classObj.subclassLabel} unlocks at level {classObj.subclassLevel}.
        </div>
      )}
    </div>
  )
}

// ── Step 4: Background ────────────────────────────────────────────────────────
function StepBackground({ char, setChar }) {
  const bg = BACKGROUNDS.find(b => b.name === char.background)
  const [traitMode, setTraitMode] = useState('pick') // 'pick' | 'custom'

  function selectBg(name) {
    setChar(c => ({ ...c, background: name, personalityTrait:'', ideal:'', bond:'', flaw:'' }))
  }

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:8, marginBottom:16 }}>
        {BACKGROUNDS.map(b => (
          <button key={b.name} onClick={() => selectBg(b.name)} style={{
            background: char.background===b.name ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.03)',
            border: char.background===b.name ? '2px solid var(--gold)' : '1px solid var(--border)',
            borderRadius:8, padding:'8px', cursor:'pointer', textAlign:'center',
            color: char.background===b.name ? 'var(--gold)' : 'var(--parch2)',
            fontFamily:'Georgia,serif', fontSize:12,
          }}>{b.name}</button>
        ))}
      </div>

      {bg && (
        <>
          <div style={{ ...S.card, marginBottom:12 }}>
            <div style={S.sectionTitle}>{bg.name}</div>
            <div style={{ fontSize:12, fontFamily:'sans-serif', display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              <div><span style={{ color:'var(--muted)' }}>Skill Profs:</span> <strong style={{ color:'#90c870' }}>{bg.skills.join(', ')}</strong></div>
              {bg.tools.length>0 && <div><span style={{ color:'var(--muted)' }}>Tools:</span> <strong>{bg.tools.join(', ')}</strong></div>}
              {bg.languages>0 && <div><span style={{ color:'var(--muted)' }}>Languages:</span> <strong>+{bg.languages}</strong></div>}
              <div><span style={{ color:'var(--muted)' }}>Feature:</span> <strong>{bg.feature}</strong></div>
              <div style={{ gridColumn:'1/-1' }}><span style={{ color:'var(--muted)' }}>Equipment:</span> <span style={{ color:'var(--parch2)' }}>{bg.equipment}</span></div>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, marginBottom:10 }}>
            <button style={{ ...S.btnGhost, ...(traitMode==='pick' ? { borderColor:'var(--gold)', color:'var(--gold)' } : {}) }} onClick={() => setTraitMode('pick')}>Choose from list</button>
            <button style={{ ...S.btnGhost, ...(traitMode==='custom' ? { borderColor:'var(--gold)', color:'var(--gold)' } : {}) }} onClick={() => setTraitMode('custom')}>Write my own</button>
          </div>

          {traitMode === 'pick' ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['personalityTrait','Personality Trait','traits'],['ideal','Ideal','ideals'],['bond','Bond','bonds'],['flaw','Flaw','flaws']].map(([field, label, pool]) => (
                <div key={field}>
                  <label style={S.label}>{label}</label>
                  <select style={S.select} value={char[field]} onChange={e => setChar(c=>({...c,[field]:e.target.value}))}>
                    <option value="" style={{background:'#16213e'}}>— Select —</option>
                    {(bg[pool]||[]).map((t,i) => <option key={i} value={t} style={{background:'#16213e'}}>{t}</option>)}
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['personalityTrait','Personality Trait'],['ideal','Ideal'],['bond','Bond'],['flaw','Flaw']].map(([field,label]) => (
                <div key={field}>
                  <label style={S.label}>{label}</label>
                  <textarea style={{ ...S.input, resize:'vertical', minHeight:60 }} value={char[field]} onChange={e => setChar(c=>({...c,[field]:e.target.value}))} placeholder={`Describe your character's ${label.toLowerCase()}...`} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Step 5: Ability Scores ────────────────────────────────────────────────────
function StepScores({ char, setChar }) {
  // Persist method in char so navigating away and back restores it
  const [method, setMethod] = useState(char.scoreMethod || 'standard')

  // Racial bonus helpers (needed for init state)
  const raceObj    = RACES.find(r => r.name === char.race)
  const subraceObj = raceObj?.subraces?.find(s => s.name === char.subrace)
  function getRacialBonus(ab) {
    return (raceObj?.asi?.[ab] || 0) + (subraceObj?.asi?.[ab] || 0)
  }

  // Restore standard-array assignments from char on remount
  const [assigned, setAssigned] = useState(() => {
    if (!char.scoresConfirmed || char.scoreMethod !== 'standard') return {}
    const result = {}
    ABILITIES.forEach(ab => {
      const base = (char[ab] || 10) - ((raceObj?.asi?.[ab] || 0) + (subraceObj?.asi?.[ab] || 0))
      if (STANDARD_ARRAY.includes(base)) result[ab] = base
    })
    return Object.keys(result).length === 6 ? result : {}
  })

  // Restore point-buy values from char on remount
  const [pointBuy, setPointBuy] = useState(() => {
    if (char.scoreMethod === 'pointbuy' && char.scoresConfirmed) {
      const result = {}
      ABILITIES.forEach(ab => {
        const base = (char[ab] || 10) - ((raceObj?.asi?.[ab] || 0) + (subraceObj?.asi?.[ab] || 0))
        result[ab] = Math.max(POINT_BUY_MIN, Math.min(POINT_BUY_MAX, base))
      })
      return result
    }
    return { str:8, dex:8, con:8, int:8, wis:8, cha:8 }
  })

  function calcHp(con) {
    const classObj = CLASSES.find(cl => cl.name === char.class)
    if (!classObj) return ''
    const conMod = abilityMod(con || 10)
    const hd = classObj.hitDie
    return hd + conMod + (char.level - 1) * (Math.floor(hd / 2) + 1 + conMod)
  }

  function applyScores(base, confirmed = false) {
    const final = {}
    ABILITIES.forEach(ab => { final[ab] = (base[ab] || 10) + getRacialBonus(ab) })
    const hp = calcHp(final.con)
    setChar(c => ({
      ...c, ...final, maxHp: hp, hp: hp,
      initiative: abilityMod(final.dex),
      passivePerception: 10 + abilityMod(final.wis) + (c.skillProfs.includes('Perception') ? PROF_BONUS[c.level] || 2 : 0),
      scoreMethod: method,
      scoresConfirmed: confirmed,
    }))
  }

  function switchMethod(m) {
    setMethod(m)
    setChar(c => ({ ...c, scoreMethod: m, scoresConfirmed: false }))
    // When switching to point buy, seed it from current char scores so values aren't lost
    if (m === 'pointbuy') {
      const seeded = {}
      ABILITIES.forEach(ab => {
        const base = (char[ab] || 10) - getRacialBonus(ab)
        seeded[ab] = Math.max(POINT_BUY_MIN, Math.min(POINT_BUY_MAX, base))
      })
      setPointBuy(seeded)
    }
    if (m === 'standard') setAssigned({})
  }

  // ── Standard Array ──
  const allAssigned = ABILITIES.every(ab => assigned[ab] !== undefined)

  function assignStandard(ab, val) {
    const next = { ...assigned }
    if (next[ab] !== undefined) delete next[ab]
    if (val !== '') next[ab] = parseInt(val)
    setAssigned(next)
    const complete = Object.keys(next).length === 6
    const base = {}
    ABILITIES.forEach(a => { base[a] = next[a] !== undefined ? next[a] : 10 })
    applyScores(base, complete)
  }

  // ── Point Buy ──
  const pbSpent     = Object.values(pointBuy).reduce((acc, v) => acc + (POINT_BUY_COSTS[v] || 0), 0)
  const pbRemaining = POINT_BUY_BUDGET - pbSpent

  function setPB(ab, val) {
    const next = { ...pointBuy, [ab]: val }
    setPointBuy(next)
    applyScores(next, true) // any explicit change confirms point buy
  }

  // ── Status banner ──
  const confirmed = char.scoresConfirmed
  const assignedCount = Object.keys(assigned).length

  return (
    <div>
      {/* Status banner */}
      {!confirmed ? (
        <div style={{
          background:'rgba(245,200,66,.08)', border:'1px solid rgba(245,200,66,.35)',
          borderRadius:6, padding:'8px 12px', marginBottom:14,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{ fontSize:16 }}>⚠️</span>
          <span style={{ fontSize:12, color:'#f5c842', fontFamily:'sans-serif' }}>
            {method === 'standard'
              ? `Assign all 6 values to complete this step. (${assignedCount}/6 assigned)`
              : method === 'pointbuy'
              ? 'Adjust any score with + / − to confirm your choices, then continue.'
              : 'Enter your scores and click Confirm below to complete this step.'}
          </span>
        </div>
      ) : (
        <div style={{
          background:'rgba(144,200,112,.08)', border:'1px solid rgba(144,200,112,.3)',
          borderRadius:6, padding:'8px 12px', marginBottom:14,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{ fontSize:14 }}>✓</span>
          <span style={{ fontSize:12, color:'#90c870', fontFamily:'sans-serif' }}>
            Ability scores confirmed — racial bonuses applied.
          </span>
        </div>
      )}

      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[['standard','Standard Array'],['pointbuy','Point Buy'],['manual','Manual Entry']].map(([m,l]) => (
          <button key={m} style={{ ...S.btnGhost, ...(method===m ? {borderColor:'var(--gold)',color:'var(--gold)'} : {}) }} onClick={() => switchMethod(m)}>{l}</button>
        ))}
      </div>

      {method === 'standard' && (
        <div>
          <div style={{ fontSize:12, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:10 }}>
            Assign each value to one ability. Values: <strong style={{ color:'var(--gold)' }}>{STANDARD_ARRAY.join(', ')}</strong>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
            {ABILITIES.map(ab => {
              const racialBonus = getRacialBonus(ab)
              const base = assigned[ab]
              const final = (base || 10) + racialBonus
              return (
                <div key={ab} style={{ ...S.card }}>
                  <label style={S.label}>{ABILITY_LABELS[ab]}</label>
                  <select style={S.select} value={assigned[ab] ?? ''} onChange={e => assignStandard(ab, e.target.value)}>
                    <option value="" style={{background:'#16213e'}}>—</option>
                    {STANDARD_ARRAY.map(v => {
                      const alreadyUsed = Object.entries(assigned).some(([k, val]) => k !== ab && val === v)
                      return !alreadyUsed ? <option key={v} value={v} style={{background:'#16213e'}}>{v}</option> : null
                    })}
                  </select>
                  {base !== undefined && (
                    <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', marginTop:4 }}>
                      {base}{racialBonus !== 0 && <span style={{ color:'#90c870' }}> +{racialBonus}</span>} = <strong style={{ color:'var(--gold)' }}>{final}</strong> (<span style={{ color: abilityMod(final) >= 0 ? '#90c870' : '#f09595' }}>{modStr(final)}</span>)
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {method === 'pointbuy' && (
        <div>
          <div style={{ fontSize:12, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:10 }}>
            Points remaining: <strong style={{ color: pbRemaining >= 0 ? '#90c870' : '#f09595' }}>{pbRemaining}</strong> / {POINT_BUY_BUDGET}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
            {ABILITIES.map(ab => {
              const racialBonus = getRacialBonus(ab)
              const base = pointBuy[ab]
              const final = base + racialBonus
              return (
                <div key={ab} style={S.card}>
                  <label style={S.label}>{ABILITY_LABELS[ab]}</label>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button style={{ ...S.btnGhost, padding:'2px 8px', fontSize:16 }} disabled={base <= POINT_BUY_MIN} onClick={() => setPB(ab, base - 1)}>−</button>
                    <span style={{ fontSize:18, fontWeight:'bold', color:'var(--gold)', minWidth:28, textAlign:'center' }}>{base}</span>
                    <button style={{ ...S.btnGhost, padding:'2px 8px', fontSize:16 }} disabled={base >= POINT_BUY_MAX || pbRemaining < (POINT_BUY_COSTS[base + 1] || 0) - (POINT_BUY_COSTS[base] || 0)} onClick={() => setPB(ab, base + 1)}>+</button>
                  </div>
                  <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', marginTop:4 }}>
                    {base}{racialBonus !== 0 && <span style={{ color:'#90c870' }}> +{racialBonus}</span>} = <strong style={{ color:'var(--gold)' }}>{final}</strong> ({modStr(final)}) · Cost: {POINT_BUY_COSTS[base] || 0}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {method === 'manual' && (
        <div>
          <div style={{ fontSize:12, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:10 }}>Enter your rolled scores (before racial bonuses). Click Confirm when done.</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
            {ABILITIES.map(ab => {
              const racialBonus = getRacialBonus(ab)
              const base = (char[ab] || 10) - racialBonus
              const final = char[ab] || 10
              return (
                <div key={ab} style={S.card}>
                  <label style={S.label}>{ABILITY_LABELS[ab]}</label>
                  <input style={S.input} type="number" min={1} max={30} value={base}
                    onChange={e => {
                      const v = parseInt(e.target.value) || 10
                      const updated = { ...char, [ab]: v + racialBonus }
                      const hp = calcHp(updated.con)
                      setChar(c => ({ ...c, [ab]: v + racialBonus, maxHp: hp, hp: hp,
                        initiative: abilityMod(updated.dex || 10),
                        passivePerception: 10 + abilityMod(updated.wis || 10),
                        scoreMethod: 'manual', scoresConfirmed: false,
                      }))
                    }}
                  />
                  <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', marginTop:4 }}>
                    {base||10} {racialBonus!==0 && <span style={{ color:'#90c870' }}>+{racialBonus}</span>} = <strong style={{ color:'var(--gold)' }}>{final}</strong> ({modStr(final)})
                  </div>
                </div>
              )
            })}
          </div>
          {/* Manual requires an explicit confirm since any values could be intentional */}
          <button
            style={{ ...S.btnPrimary, marginTop:12 }}
            onClick={() => {
              const base = {}
              ABILITIES.forEach(ab => { base[ab] = (char[ab] || 10) - getRacialBonus(ab) })
              applyScores(base, true)
            }}
          >
            ✓ Confirm Scores
          </button>
        </div>
      )}

      {char.class && (
        <div style={{ marginTop:12, ...S.card }}>
          <div style={{ fontSize:12, fontFamily:'sans-serif', color:'var(--parch2)' }}>
            <strong style={{ color:'var(--gold)' }}>HP:</strong> {char.maxHp || '—'} &nbsp;|&nbsp;
            <strong style={{ color:'var(--gold)' }}>Initiative:</strong> {modStr(char.initiative || 0)} &nbsp;|&nbsp;
            <strong style={{ color:'var(--gold)' }}>Passive Perception:</strong> {char.passivePerception || 10}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Step 6: Skills & Proficiencies ────────────────────────────────────────────
function StepSkills({ char, setChar }) {
  const classObj = CLASSES.find(c => c.name === char.class)
  const bgObj    = BACKGROUNDS.find(b => b.name === char.background)

  const bgSkills  = bgObj?.skills || []
  const classSkills = classObj?.skillChoices === 'any' ? SKILLS.map(s=>s.name) : (classObj?.skillChoices || [])
  const maxChoices  = classObj?.skillCount || 0

  // Skills granted by background (cannot be deselected)
  const lockedProfs = bgSkills

  // Skills chosen by the player (from class list)
  const chosen = char.skillProfs.filter(s => !lockedProfs.includes(s))

  function toggleSkill(skill) {
    if (lockedProfs.includes(skill)) return // background skill, locked
    const next = char.skillProfs.includes(skill)
      ? char.skillProfs.filter(s => s !== skill)
      : [...char.skillProfs, skill]
    // Enforce max choices from class
    const classChosen = next.filter(s => !lockedProfs.includes(s))
    if (classChosen.length > maxChoices && !char.skillProfs.includes(skill)) return
    setChar(c => ({ ...c, skillProfs: next,
      passivePerception: 10 + abilityMod(c.wis) + (next.includes('Perception') ? PROF_BONUS[c.level]||2 : 0),
    }))
  }

  const classChosenCount = char.skillProfs.filter(s => !lockedProfs.includes(s)).length

  return (
    <div>
      {classObj && (
        <div style={{ fontSize:12, color:'var(--muted)', fontFamily:'sans-serif', marginBottom:12 }}>
          <strong style={{ color:'var(--gold)' }}>{char.background}</strong> grants: <span style={{ color:'#90c870' }}>{bgSkills.join(', ')}</span>
          {' · '}<strong style={{ color:'var(--gold)' }}>{char.class}</strong> choose: <span style={{ color: classChosenCount >= maxChoices ? '#90c870' : '#f5c842' }}>{classChosenCount}/{maxChoices}</span> from the list below
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:4 }}>
        {SKILLS.map(skill => {
          const locked   = lockedProfs.includes(skill.name)
          const profed   = char.skillProfs.includes(skill.name)
          const classAllowed = classSkills.includes(skill.name)
          const bonus = profed
            ? abilityMod(char[skill.ability]||10) + (PROF_BONUS[char.level]||2)
            : abilityMod(char[skill.ability]||10)
          return (
            <div key={skill.name} onClick={() => toggleSkill(skill.name)} style={{
              display:'flex', alignItems:'center', gap:8, padding:'5px 8px',
              borderRadius:5, cursor: locked ? 'default' : 'pointer',
              background: profed ? 'rgba(144,200,112,.08)' : 'rgba(255,255,255,.02)',
              border: `1px solid ${profed ? 'rgba(144,200,112,.3)' : 'var(--border)'}`,
              opacity: !locked && !classAllowed && !profed ? 0.45 : 1,
            }}>
              <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${profed ? '#90c870' : 'var(--muted)'}`, background: profed ? '#90c870' : 'transparent', flexShrink:0 }} />
              <span style={{ fontSize:12, color: profed ? 'var(--parch)' : 'var(--parch2)', flex:1 }}>{skill.name}</span>
              <span style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif' }}>{ABILITY_SHORT[skill.ability]}</span>
              <span style={{ fontSize:12, fontFamily:'sans-serif', color: bonus>=0?'#90c870':'#f09595', fontWeight:'bold', minWidth:24, textAlign:'right' }}>{bonus>=0?'+':''}{bonus}</span>
              {locked && <span style={{ fontSize:9, color:'var(--gold)', fontFamily:'sans-serif' }}>BG</span>}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop:16 }}>
        <div style={S.sectionTitle}>Saving Throws</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4 }}>
          {ABILITIES.map(ab => {
            const profed = char.savingThrows.includes(ab) || (classObj?.savingThrows.includes(ab))
            const bonus  = abilityMod(char[ab]||10) + (profed ? PROF_BONUS[char.level]||2 : 0)
            return (
              <div key={ab} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 8px', borderRadius:5, background:'rgba(255,255,255,.02)', border:`1px solid ${profed?'rgba(144,184,248,.3)':'var(--border)'}` }}>
                <div style={{ width:10,height:10,borderRadius:'50%', background: profed ? '#90b8f8' : 'transparent', border:`1.5px solid ${profed?'#90b8f8':'var(--muted)'}`, flexShrink:0 }} />
                <span style={{ fontSize:12, color:'var(--parch2)', flex:1 }}>{ABILITY_SHORT[ab]}</span>
                <span style={{ fontSize:12, fontFamily:'sans-serif', color: bonus>=0?'#90b8f8':'#f09595', fontWeight:'bold' }}>{bonus>=0?'+':''}{bonus}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <div style={S.sectionTitle}>Languages</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
            {char.languages.map(l => <span key={l} style={{ fontSize:11, fontFamily:'sans-serif', background:'rgba(201,168,76,.1)', border:'1px solid rgba(201,168,76,.3)', borderRadius:3, padding:'2px 8px', color:'var(--gold)' }}>{l}</span>)}
          </div>
        </div>
        <div>
          <div style={S.sectionTitle}>AC & Combat</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div>
              <label style={S.label}>Armor Class</label>
              <input style={S.input} type="number" min={1} value={char.ac} onChange={e => setChar(c=>({...c,ac:parseInt(e.target.value)||10}))} />
            </div>
            <div>
              <label style={S.label}>Speed (ft)</label>
              <input style={S.input} type="number" min={0} value={char.speed} onChange={e => setChar(c=>({...c,speed:parseInt(e.target.value)||30}))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 7: Equipment ─────────────────────────────────────────────────────────
function StepEquipment({ char, setChar }) {
  const classObj = CLASSES.find(c=>c.name===char.class)
  const bgObj    = BACKGROUNDS.find(b=>b.name===char.background)
  const [custom, setCustom] = useState('')

  function addItem(item) {
    if (!item.trim()) return
    setChar(c => ({ ...c, equipment: [...c.equipment, item.trim()] }))
    setCustom('')
  }

  function removeItem(i) {
    setChar(c => ({ ...c, equipment: c.equipment.filter((_,idx)=>idx!==i) }))
  }

  return (
    <div>
      {classObj?.equipment && (
        <div style={{ ...S.card, marginBottom:12 }}>
          <div style={S.sectionTitle}>Starting Equipment — {char.class}</div>
          {classObj.equipment.map((item,i) => (
            <div key={i} style={{ fontSize:12, color:'var(--parch2)', padding:'3px 0', borderBottom:'1px solid rgba(255,255,255,.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{item}</span>
              <button style={{ ...S.btnGhost, padding:'2px 8px', fontSize:11 }} onClick={() => addItem(item)}>+ Add</button>
            </div>
          ))}
        </div>
      )}
      {bgObj?.equipment && (
        <div style={{ fontSize:12, color:'var(--parch2)', marginBottom:12, padding:8, background:'rgba(255,255,255,.03)', borderRadius:6 }}>
          <strong style={{ color:'var(--gold)' }}>Background equipment:</strong> {bgObj.equipment}
          <button style={{ ...S.btnGhost, padding:'2px 8px', fontSize:11, marginLeft:8 }} onClick={() => addItem(bgObj.equipment)}>+ Add all</button>
        </div>
      )}

      <div style={{ marginBottom:12 }}>
        <div style={S.sectionTitle}>Your Inventory</div>
        {char.equipment.length === 0
          ? <div style={{ fontSize:12, color:'var(--muted)', fontStyle:'italic', padding:'8px 0' }}>No items added yet.</div>
          : char.equipment.map((item,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,.04)', fontSize:12, color:'var(--parch2)' }}>
              <span style={{ flex:1 }}>{item}</span>
              <button style={{ background:'none', border:'none', color:'rgba(240,100,100,.6)', cursor:'pointer', fontSize:14 }} onClick={() => removeItem(i)}>×</button>
            </div>
          ))
        }
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input style={{ ...S.input, flex:1 }} value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Add custom item..." onKeyDown={e => e.key==='Enter' && addItem(custom)} />
        <button style={S.btnPrimary} onClick={() => addItem(custom)}>Add</button>
      </div>

      <div style={S.sectionTitle}>Currency</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
        {[['cp','Copper'],['sp','Silver'],['ep','Electrum'],['gp','Gold'],['pp','Platinum']].map(([key,label]) => (
          <div key={key}>
            <label style={S.label}>{label}</label>
            <input style={S.input} type="number" min={0} value={char[key]||0} onChange={e=>setChar(c=>({...c,[key]:parseInt(e.target.value)||0}))} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 8: Spells ────────────────────────────────────────────────────────────
function StepSpells({ char, setChar, version }) {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')

  const classObj  = CLASSES.find(c=>c.name===char.class)
  const isSpellcaster = !!classObj?.spellcasting

  if (!isSpellcaster) {
    return (
      <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--muted)' }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⚔️</div>
        <div style={{ fontSize:14, fontStyle:'italic' }}>{char.class || 'This class'} is not a spellcaster. Skip to the next step.</div>
      </div>
    )
  }

  const ALL_SPELLS  = version === '2024' ? SPELLS_2024 : SPELLS
  const classSpells = getClassSpellList(char.class)
  const cantripsNeeded = getCantripsKnown(char.class, char.level)
  const spellsNeeded   = getSpellsKnownCount(char.class, char.level, char[classObj?.spellcastingAbility] || 10)
  const slots = getSpellSlots(char.class, char.level)

  const filteredSpells = ALL_SPELLS.filter(s => {
    const [name, lvl] = s
    if (!classSpells.includes(name)) return false
    if (levelFilter !== 'All' && lvl !== parseInt(levelFilter)) return false
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function toggleSpell(spellName, level) {
    if (level === 0) {
      const next = char.cantrips.includes(spellName)
        ? char.cantrips.filter(s=>s!==spellName)
        : [...char.cantrips, spellName]
      setChar(c=>({...c, cantrips:next}))
    } else {
      const next = char.spells.includes(spellName)
        ? char.spells.filter(s=>s!==spellName)
        : [...char.spells, spellName]
      setChar(c=>({...c, spells:next}))
    }
  }

  return (
    <div>
      <div style={{ ...S.card, marginBottom:12, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8, fontSize:12, fontFamily:'sans-serif' }}>
        <div><span style={{ color:'var(--muted)' }}>Spellcasting:</span> <strong style={{ color:'#90b8f8' }}>{ABILITY_LABELS[classObj.spellcastingAbility]}</strong></div>
        <div><span style={{ color:'var(--muted)' }}>Spell Save DC:</span> <strong>8 + {PROF_BONUS[char.level]||2} + {abilityMod(char[classObj.spellcastingAbility]||10)} = {8 + (PROF_BONUS[char.level]||2) + abilityMod(char[classObj.spellcastingAbility]||10)}</strong></div>
        <div><span style={{ color:'var(--muted)' }}>Spell Attack:</span> <strong>+{(PROF_BONUS[char.level]||2) + abilityMod(char[classObj.spellcastingAbility]||10)}</strong></div>
        <div><span style={{ color:'var(--muted)' }}>Cantrips:</span> <strong style={{ color: char.cantrips.length>=cantripsNeeded?'#90c870':'#f5c842' }}>{char.cantrips.length}/{cantripsNeeded}</strong></div>
        {spellsNeeded && <div><span style={{ color:'var(--muted)' }}>Spells:</span> <strong style={{ color: char.spells.length>=spellsNeeded?'#90c870':'#f5c842' }}>{char.spells.length}/{spellsNeeded}</strong></div>}
        {slots && !slots.slots && <div style={{ gridColumn:'1/-1' }}><span style={{ color:'var(--muted)' }}>Slots: </span>{slots.map((n,i)=>n>0?<span key={i} style={{ color:'var(--gold)', marginRight:6 }}>{`L${i+1}×${n}`}</span>:null)}</div>}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input style={{ ...S.input, flex:1, minWidth:160 }} placeholder="Search spells..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select style={{ ...S.select, width:'auto' }} value={levelFilter} onChange={e=>setLevelFilter(e.target.value)}>
          <option value="All" style={{background:'#16213e'}}>All Levels</option>
          <option value="0" style={{background:'#16213e'}}>Cantrips</option>
          {[1,2,3,4,5,6,7,8,9].map(l=><option key={l} value={l} style={{background:'#16213e'}}>Level {l}</option>)}
        </select>
      </div>

      <div style={{ maxHeight:360, overflowY:'auto', display:'flex', flexDirection:'column', gap:4 }}>
        {filteredSpells.length === 0 && <div style={{ color:'var(--muted)', fontStyle:'italic', fontSize:12, textAlign:'center', padding:'2rem' }}>No spells match your search.</div>}
        {filteredSpells.map(s => {
          const [name, lvl, school, castTime, range, duration, conc, components, ritual, desc] = s
          const selected = lvl === 0 ? char.cantrips.includes(name) : char.spells.includes(name)
          return (
            <div key={name} onClick={() => toggleSpell(name, lvl)} style={{
              display:'flex', alignItems:'flex-start', gap:10, padding:'8px 10px',
              borderRadius:6, cursor:'pointer',
              background: selected ? 'rgba(144,184,248,.1)' : 'rgba(255,255,255,.02)',
              border: `1px solid ${selected ? 'rgba(144,184,248,.4)' : 'var(--border)'}`,
            }}>
              <div style={{ width:16,height:16,borderRadius:3,border:`2px solid ${selected?'#90b8f8':'var(--muted)'}`, background:selected?'#90b8f8':'transparent', flexShrink:0, marginTop:1 }} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                  <span style={{ fontSize:13, color: selected?'var(--parch)':'var(--parch2)', fontWeight: selected?'bold':'normal' }}>{name}</span>
                  <span style={{ fontSize:10, fontFamily:'sans-serif', color:'var(--muted)' }}>{lvl===0?'Cantrip':`Lvl ${lvl}`}</span>
                  <span style={{ fontSize:10, fontFamily:'sans-serif', color:'#888', background:'rgba(255,255,255,.06)', borderRadius:3, padding:'1px 5px' }}>{school}</span>
                  {conc==='Yes' && <span style={{ fontSize:9, fontFamily:'sans-serif', color:'#f5c842', border:'1px solid rgba(245,200,66,.3)', borderRadius:3, padding:'1px 4px' }}>CONC</span>}
                  {ritual==='Yes' && <span style={{ fontSize:9, fontFamily:'sans-serif', color:'#90c870', border:'1px solid rgba(144,200,112,.3)', borderRadius:3, padding:'1px 4px' }}>RITUAL</span>}
                </div>
                <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', marginTop:2 }}>{castTime} · {range} · {duration}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 9: Appearance & Backstory ────────────────────────────────────────────
function StepAppearance({ char, setChar }) {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
        {[['age','Age'],['height','Height'],['weight','Weight'],['eyes','Eyes'],['hair','Hair'],['skin','Skin / Complexion']].map(([field,label]) => (
          <div key={field}>
            <label style={S.label}>{label}</label>
            <input style={S.input} value={char[field]||''} onChange={e=>setChar(c=>({...c,[field]:e.target.value}))} placeholder={label} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom:12 }}>
        <label style={S.label}>Physical Appearance (distinctive features, scars, etc.)</label>
        <textarea style={{ ...S.input, resize:'vertical', minHeight:70 }} value={char.appearance||''} onChange={e=>setChar(c=>({...c,appearance:e.target.value}))} placeholder="Describe your character's appearance in your own words..." />
      </div>

      <div>
        <label style={S.label}>Backstory</label>
        <textarea style={{ ...S.input, resize:'vertical', minHeight:120 }} value={char.backstory||''} onChange={e=>setChar(c=>({...c,backstory:e.target.value}))} placeholder="Where did your character come from? What drives them? What do they fear?..." />
      </div>
    </div>
  )
}

// ── Step 10: Review & Save ────────────────────────────────────────────────────
function StepReview({ char }) {
  const classObj = CLASSES.find(c=>c.name===char.class)
  return (
    <div>
      <div style={{ ...S.card, borderLeft:'3px solid var(--gold)', marginBottom:12 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:'bold', color:'var(--gold)' }}>{char.name || 'Unnamed Hero'}</div>
          <div style={{ fontSize:13, color:'var(--parch2)', marginTop:2 }}>
            {[char.alignment, char.subrace||char.race, char.subclass||char.class, `Level ${char.level}`].filter(Boolean).join(' · ')}
          </div>
          {char.background && <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Background: {char.background}</div>}
        </div>
      </div>

      <AbilityBlock scores={char} />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, margin:'12px 0' }}>
        {[['HP',`${char.hp||'—'}/${char.maxHp||'—'}`],['AC',char.ac||'—'],['Initiative',modStr(char.initiative||0)],['Speed',`${char.speed}ft`],
          ['Prof. Bonus',`+${char.profBonus||2}`],['Pass. Perc.',char.passivePerception||10],
          ['Cantrips', char.cantrips.length||0],['Spells',char.spells.length||0]
        ].map(([l,v]) => (
          <div key={l} style={{ ...S.card, textAlign:'center', padding:'8px 4px' }}>
            <div style={{ fontSize:18, fontWeight:'bold', color:'var(--gold)' }}>{v}</div>
            <div style={{ fontSize:10, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.04em' }}>{l}</div>
          </div>
        ))}
      </div>

      {char.skillProfs.length > 0 && (
        <div style={{ ...S.card, marginBottom:8 }}>
          <strong style={{ fontSize:12, color:'var(--gold)' }}>Skill Proficiencies: </strong>
          <span style={{ fontSize:12, color:'var(--parch2)' }}>{char.skillProfs.join(', ')}</span>
        </div>
      )}
      {char.equipment.length > 0 && (
        <div style={{ ...S.card, marginBottom:8 }}>
          <strong style={{ fontSize:12, color:'var(--gold)' }}>Equipment: </strong>
          <span style={{ fontSize:12, color:'var(--parch2)' }}>{char.equipment.join(', ')}</span>
        </div>
      )}
      {(char.personalityTrait||char.ideal||char.bond||char.flaw) && (
        <div style={{ ...S.card, marginBottom:8 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:12 }}>
            {char.personalityTrait && <div><strong style={{ color:'var(--gold)' }}>Trait: </strong><span style={{ color:'var(--parch2)' }}>{char.personalityTrait}</span></div>}
            {char.ideal  && <div><strong style={{ color:'var(--gold)' }}>Ideal: </strong><span style={{ color:'var(--parch2)' }}>{char.ideal}</span></div>}
            {char.bond   && <div><strong style={{ color:'var(--gold)' }}>Bond: </strong><span style={{ color:'var(--parch2)' }}>{char.bond}</span></div>}
            {char.flaw   && <div><strong style={{ color:'var(--gold)' }}>Flaw: </strong><span style={{ color:'var(--parch2)' }}>{char.flaw}</span></div>}
          </div>
        </div>
      )}
      {char.backstory && (
        <div style={{ ...S.card }}>
          <strong style={{ fontSize:12, color:'var(--gold)' }}>Backstory: </strong>
          <span style={{ fontSize:12, color:'var(--parch2)' }}>{char.backstory}</span>
        </div>
      )}
    </div>
  )
}

// ── Print Sheet ───────────────────────────────────────────────────────────────
export function printCharacter(char) {
  const classObj = CLASSES.find(c=>c.name===char.class)
  const prof = char.profBonus || PROF_BONUS[char.level] || 2
  const spellDC = char.spellcastingAbility
    ? 8 + prof + abilityMod(char[char.spellcastingAbility]||10)
    : null

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${char.name || 'Character'} — D&D Character Sheet</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; color: #1a1a1a; background: white; padding: 20px; font-size: 13px; }
  h1 { font-size: 26px; border-bottom: 3px double #8b0000; padding-bottom: 6px; margin-bottom: 4px; }
  .subtitle { color: #555; font-size: 13px; margin-bottom: 16px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .grid6 { display: grid; grid-template-columns: repeat(6,1fr); gap: 6px; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #8b0000; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 8px; }
  .box { border: 1px solid #ccc; border-radius: 5px; padding: 8px; }
  .ability-box { border: 2px solid #8b0000; border-radius: 6px; padding: 8px 4px; text-align: center; }
  .ability-name { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #8b0000; }
  .ability-score { font-size: 22px; font-weight: bold; }
  .ability-mod { font-size: 14px; font-weight: bold; color: #333; }
  .stat-row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 3px 0; font-size: 12px; }
  .prof-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #333; background: transparent; margin-right: 4px; vertical-align: middle; }
  .prof-dot.filled { background: #333; }
  .combat-box { border: 1.5px solid #8b0000; border-radius: 6px; text-align: center; padding: 6px 4px; }
  .combat-val { font-size: 20px; font-weight: bold; }
  .combat-label { font-size: 9px; text-transform: uppercase; letter-spacing: .04em; color: #8b0000; }
  .spell-slot { display: inline-block; border: 1px solid #8b0000; border-radius: 3px; padding: 1px 6px; margin: 2px; font-size: 11px; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
<h1>${char.name || 'Unnamed Hero'}</h1>
<div class="subtitle">
  ${[char.alignment, (char.subrace||char.race), (char.subclass||char.class), 'Level ' + char.level, char.background].filter(Boolean).join(' · ')}
  ${char.playerName ? ' &nbsp;|&nbsp; Player: ' + char.playerName : ''}
</div>

<div class="section grid6">
  ${ABILITIES.map(ab=>`
  <div class="ability-box">
    <div class="ability-name">${ABILITY_SHORT[ab]}</div>
    <div class="ability-score">${char[ab]||10}</div>
    <div class="ability-mod">${modStr(char[ab]||10)}</div>
  </div>`).join('')}
</div>

<div class="section grid3" style="margin-top:12px">
  <div class="combat-box"><div class="combat-val">${char.maxHp||'—'}</div><div class="combat-label">Max HP</div></div>
  <div class="combat-box"><div class="combat-val">${char.ac||10}</div><div class="combat-label">Armor Class</div></div>
  <div class="combat-box"><div class="combat-val">${modStr(char.initiative||0)}</div><div class="combat-label">Initiative</div></div>
  <div class="combat-box"><div class="combat-val">${char.speed||30}ft</div><div class="combat-label">Speed</div></div>
  <div class="combat-box"><div class="combat-val">+${char.profBonus||2}</div><div class="combat-label">Prof. Bonus</div></div>
  <div class="combat-box"><div class="combat-val">${char.passivePerception||10}</div><div class="combat-label">Pass. Perception</div></div>
</div>

<div class="section grid2" style="margin-top:12px">
  <div>
    <div class="section-title">Saving Throws</div>
    ${ABILITIES.map(ab=>{
      const profed = char.savingThrows.includes(ab)||(classObj?.savingThrows.includes(ab))
      const bonus  = abilityMod(char[ab]||10)+(profed?prof:0)
      return `<div class="stat-row"><span><span class="prof-dot${profed?' filled':''}"></span>${ABILITY_LABELS[ab]}</span><strong>${bonus>=0?'+':''}${bonus}</strong></div>`
    }).join('')}
  </div>
  <div>
    <div class="section-title">Skills</div>
    ${SKILLS.map(skill=>{
      const profed = char.skillProfs.includes(skill.name)
      const bonus  = abilityMod(char[skill.ability]||10)+(profed?prof:0)
      return `<div class="stat-row"><span><span class="prof-dot${profed?' filled':''}"></span>${skill.name} <small style="color:#888">(${ABILITY_SHORT[skill.ability]})</small></span><strong>${bonus>=0?'+':''}${bonus}</strong></div>`
    }).join('')}
  </div>
</div>

${char.equipment.length > 0 ? `
<div class="section">
  <div class="section-title">Equipment</div>
  <div class="box" style="font-size:12px">${char.equipment.join(' · ')}</div>
  <div style="font-size:12px;margin-top:4px">Currency: ${char.cp||0}cp · ${char.sp||0}sp · ${char.ep||0}ep · ${char.gp||0}gp · ${char.pp||0}pp</div>
</div>` : ''}

${(char.cantrips.length > 0 || char.spells.length > 0) ? `
<div class="section">
  <div class="section-title">Spells — ${char.class} (${ABILITY_LABELS[char.spellcastingAbility]}) · Save DC ${spellDC} · Attack +${prof + abilityMod(char[char.spellcastingAbility]||10)}</div>
  ${char.cantrips.length > 0 ? `<div style="margin-bottom:4px"><strong>Cantrips:</strong> ${char.cantrips.join(', ')}</div>` : ''}
  ${char.spells.length > 0 ? `<div><strong>Spells Known/Prepared:</strong> ${char.spells.join(', ')}</div>` : ''}
</div>` : ''}

${(char.personalityTrait||char.ideal||char.bond||char.flaw||char.backstory) ? `
<div class="section">
  <div class="section-title">Personality & Backstory</div>
  <div class="grid2">
    <div>
      ${char.personalityTrait?`<div class="stat-row"><strong>Trait:</strong>&nbsp;${char.personalityTrait}</div>`:''}
      ${char.ideal?`<div class="stat-row"><strong>Ideal:</strong>&nbsp;${char.ideal}</div>`:''}
      ${char.bond?`<div class="stat-row"><strong>Bond:</strong>&nbsp;${char.bond}</div>`:''}
      ${char.flaw?`<div class="stat-row"><strong>Flaw:</strong>&nbsp;${char.flaw}</div>`:''}
      ${[char.age&&('Age: '+char.age), char.height&&('Height: '+char.height), char.weight&&('Weight: '+char.weight)].filter(Boolean).map(x=>`<div class="stat-row">${x}</div>`).join('')}
      ${[char.eyes&&('Eyes: '+char.eyes), char.hair&&('Hair: '+char.hair), char.skin&&('Skin: '+char.skin)].filter(Boolean).map(x=>`<div class="stat-row">${x}</div>`).join('')}
    </div>
    ${char.backstory?`<div><strong>Backstory:</strong> ${char.backstory}</div>`:''}
  </div>
</div>` : ''}

<div style="font-size:10px;color:#aaa;margin-top:20px;border-top:1px solid #eee;padding-top:8px">
  Generated by IdleMode D&D Toolkit · idlemode-toolkit.vercel.app · SRD 5.1/5.2 CC BY 4.0
</div>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
    // Let the browser finish rendering before opening the print dialog
    setTimeout(() => win.print(), 350)
  }
}

// ── Character Preview Card ─────────────────────────────────────────────────────
function CharacterPreview({ char, currentStep }) {
  const progress = STEPS.findIndex(s=>s.id===currentStep)
  const classFill = progress >= 2
  const raceFill  = progress >= 1
  const scoreFill = progress >= 4
  return (
    <div style={{ ...S.card, borderColor:'rgba(201,168,76,.3)', background:'rgba(201,168,76,.04)', marginBottom:12 }}>
      <div style={{ textAlign:'center', marginBottom:8 }}>
        <div style={{ fontSize:28, marginBottom:4 }}>
          {char.class==='Barbarian'?'🪓':char.class==='Bard'?'🎵':char.class==='Cleric'?'✝️':char.class==='Druid'?'🌿':char.class==='Fighter'?'⚔️':char.class==='Monk'?'👊':char.class==='Paladin'?'🛡️':char.class==='Ranger'?'🏹':char.class==='Rogue'?'🗡️':char.class==='Sorcerer'?'🔮':char.class==='Warlock'?'😈':char.class==='Wizard'?'📚':'🧙'}
        </div>
        <div style={{ fontSize:15, fontWeight:'bold', color:'var(--gold)' }}>{char.name || 'Your Character'}</div>
        {(char.race||char.class) && (
          <div style={{ fontSize:11, color:'var(--parch2)', fontStyle:'italic' }}>
            {[char.subrace||char.race, char.subclass||char.class].filter(Boolean).join(' ')} {char.level > 0 && `· Lv ${char.level}`}
          </div>
        )}
      </div>
      {scoreFill && <AbilityBlock scores={char} compact />}
      {(char.maxHp||char.ac) && (
        <div style={{ display:'flex', justifyContent:'space-around', marginTop:8, fontSize:11, fontFamily:'sans-serif' }}>
          {char.maxHp && <div style={{ textAlign:'center' }}><div style={{ color:'#f09595', fontWeight:'bold' }}>♥ {char.maxHp}</div><div style={{ color:'var(--muted)' }}>HP</div></div>}
          {char.ac && <div style={{ textAlign:'center' }}><div style={{ color:'#90b8f8', fontWeight:'bold' }}>🛡 {char.ac}</div><div style={{ color:'var(--muted)' }}>AC</div></div>}
          <div style={{ textAlign:'center' }}><div style={{ color:'var(--gold)', fontWeight:'bold' }}>+{char.profBonus||2}</div><div style={{ color:'var(--muted)' }}>Prof</div></div>
        </div>
      )}
    </div>
  )
}

// ── Main CharacterBuilder Component ──────────────────────────────────────────
export default function CharacterBuilder({ editCharId, onGoToCampaign }) {
  const { getTabVersion }  = useVersion()
  const version = getTabVersion('builder')
  const { campaign, characters } = useCampaign()

  const [char, setChar] = useState(() => {
    if (editCharId) {
      const existing = campaign.characters.find(c => c.id === editCharId)
      if (existing) return { ...BLANK_CHAR, ...existing }
    }
    return { ...BLANK_CHAR }
  })
  const [currentStep, setCurrentStep] = useState('name')
  const [saved, setSaved]             = useState(false)

  const setCharSafe = useCallback((updater) => {
    setSaved(false)
    setChar(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater })
  }, [])

  const stepIndex  = STEPS.findIndex(s => s.id === currentStep)
  const isFirst    = stepIndex === 0
  const isLast     = stepIndex === STEPS.length - 1

  // Which steps are "complete enough" to show green
  function stepDone(stepId) {
    switch(stepId) {
      case 'name':       return !!char.name
      case 'race':       return !!char.race
      case 'class':      return !!char.class
      case 'background': return !!char.background
      case 'scores':     return !!char.scoresConfirmed
      case 'skills':     return true
      case 'equipment':  return true
      case 'spells':     return true
      case 'appearance': return true
      case 'review':     return saved
      default: return false
    }
  }

  function goNext() {
    const next = STEPS[stepIndex + 1]
    if (next) setCurrentStep(next.id)
  }
  function goPrev() {
    const prev = STEPS[stepIndex - 1]
    if (prev) setCurrentStep(prev.id)
  }

  function handleSave() {
    const classObj = CLASSES.find(c=>c.name===char.class)
    const finalChar = {
      ...char,
      profBonus: PROF_BONUS[char.level] || 2,
      savingThrows: classObj?.savingThrows || [],
      spellcastingAbility: classObj?.spellcastingAbility || '',
      updatedAt: Date.now(),
      createdAt: char.createdAt || Date.now(),
    }
    // flushSync forces the localStorage write to complete before we navigate,
    // preventing a race where CampaignManager mounts and reads stale data.
    flushSync(() => {
      if (char.id) {
        characters.update(char.id, finalChar) // editing existing
      } else {
        characters.add(finalChar)             // new character
      }
    })
    setSaved(true)
    if (onGoToCampaign) onGoToCampaign()
  }

  function handleNew() {
    setChar({ ...BLANK_CHAR })
    setCurrentStep('name')
    setSaved(false)
  }

  // Skip spells step for non-casters
  const classObj = CLASSES.find(c=>c.name===char.class)
  const isSpellcaster = !!classObj?.spellcasting

  const visibleSteps = STEPS.filter(s => s.id !== 'spells' || isSpellcaster)

  return (
    <div style={{ display:'flex', gap:'1.5rem', alignItems:'flex-start', flexWrap:'wrap' }}>

      {/* ── Left sidebar: step nav + preview ── */}
      <div style={{ width:180, minWidth:160, flexShrink:0 }}>
        <CharacterPreview char={char} currentStep={currentStep} />

        <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>Steps</div>
        {STEPS.map((step, i) => {
          const done    = stepDone(step.id)
          const active  = currentStep === step.id
          const skipped = step.id === 'spells' && !isSpellcaster
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              disabled={skipped}
              style={{
                display:'flex', alignItems:'center', gap:7,
                width:'100%', background: active ? 'rgba(201,168,76,.12)' : 'none',
                border:'none', borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                borderRadius:'0 5px 5px 0', padding:'6px 8px', cursor: skipped ? 'default' : 'pointer',
                marginBottom:2, opacity: skipped ? 0.35 : 1,
              }}
            >
              <div style={{ width:16, height:16, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10,
                background: done ? '#90c870' : active ? 'rgba(201,168,76,.2)' : 'rgba(255,255,255,.06)',
                border: `1.5px solid ${done ? '#90c870' : active ? 'var(--gold)' : 'var(--border)'}`,
                color: done ? '#1a1a2e' : active ? 'var(--gold)' : 'var(--muted)',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize:12, color: active ? 'var(--gold)' : done ? 'var(--parch2)' : 'var(--muted)', fontFamily:'Georgia,serif', textAlign:'left' }}>{step.label}</span>
            </button>
          )
        })}

        <button style={{ ...S.btnGhost, width:'100%', marginTop:12, fontSize:11 }} onClick={handleNew}>↺ Start Over</button>
      </div>

      {/* ── Main content area ── */}
      <div style={{ flex:1, minWidth:280 }}>

        {/* Step header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:20 }}>{STEPS[stepIndex]?.icon}</span>
              <span style={{ fontSize:18, fontWeight:'bold', color:'var(--gold)' }}>{STEPS[stepIndex]?.label}</span>
            </div>
            <div style={{ fontSize:11, color:'var(--muted)', fontFamily:'sans-serif', marginTop:2 }}>Step {stepIndex+1} of {STEPS.length}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {!isFirst && <button style={S.btnGhost} onClick={goPrev}>← Back</button>}
            {!isLast  && <button style={S.btnPrimary} onClick={goNext}>Next →</button>}
          </div>
        </div>

        {/* Step content */}
        <div style={{ minHeight:400 }}>
          {currentStep === 'name'       && <StepName       char={char} setChar={setCharSafe} />}
          {currentStep === 'race'       && <StepRace       char={char} setChar={setCharSafe} />}
          {currentStep === 'class'      && <StepClass      char={char} setChar={setCharSafe} />}
          {currentStep === 'background' && <StepBackground char={char} setChar={setCharSafe} />}
          {currentStep === 'scores'     && <StepScores     char={char} setChar={setCharSafe} />}
          {currentStep === 'skills'     && <StepSkills     char={char} setChar={setCharSafe} />}
          {currentStep === 'equipment'  && <StepEquipment  char={char} setChar={setCharSafe} />}
          {currentStep === 'spells'     && <StepSpells     char={char} setChar={setCharSafe} version={version} />}
          {currentStep === 'appearance' && <StepAppearance char={char} setChar={setCharSafe} />}
          {currentStep === 'review'     && <StepReview     char={char} />}
        </div>

        {/* Bottom nav */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:20, paddingTop:12, borderTop:'1px solid var(--border)' }}>
          <div>{!isFirst && <button style={S.btnGhost} onClick={goPrev}>← Back</button>}</div>
          <div style={{ display:'flex', gap:8 }}>
            {currentStep === 'review' && (
              <>
                <button style={S.btnGold} onClick={() => printCharacter(char)}>🖨️ Print Sheet</button>
                <button style={{ ...S.btnPrimary, fontSize:14 }} onClick={handleSave}>{saved ? '✓ Saved!' : char.id ? 'Update Character' : 'Save to Campaign Manager'}</button>
              </>
            )}
            {!isLast && <button style={S.btnPrimary} onClick={goNext}>Next →</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
