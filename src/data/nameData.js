// ── Name Generation Data ─────────────────────────────────────────────────────
// Phonetic syllable pools per race + gender.
// generateName(race, gender) returns a single random name string.
// generateNames(race, gender, count) returns an array of unique names.

const POOLS = {

  // ── Human — 5 regional flavours ──────────────────────────────────────────
  'Human (Nordic)': {
    m: { p: ['Arn','Bjorn','Dag','Eirik','Finn','Gunnar','Hald','Ivar','Knut','Leif','Magnus','Njord','Orm','Ragnar','Sigurd','Thor','Ulf','Vidar'],
         s: ['ar','on','in','mund','gar','mar','ald','rik','stein','vald'] },
    f: { p: ['Astri','Bodil','Dagny','Edda','Freya','Gudrun','Helga','Ingrid','Jorun','Kari','Liv','Maja','Nora','Ragna','Sigrid','Thora','Unn','Vigdis'],
         s: ['a','ild','rid','run','ny','dis'] },
  },
  'Human (Mediterranean)': {
    m: { p: ['Aldo','Bruno','Carlo','Dante','Emilio','Fabio','Giorgio','Luca','Marco','Niccolo','Pietro','Renato','Sandro','Tito','Ugo','Valentino'],
         s: ['o','i','io','ino','ello','etto'] },
    f: { p: ['Adriana','Beatrice','Chiara','Elena','Fiora','Ginevra','Isabella','Lucia','Maria','Natalia','Oriana','Petra','Rosa','Serena','Valentina'],
         s: ['a','ina','ella','etta','ia'] },
  },
  'Human (Slavic)': {
    m: { p: ['Bogdan','Casimir','Dmitri','Fyodor','Goran','Igor','Kazimir','Lev','Mirko','Nikolai','Oleg','Pavel','Rodion','Stanko','Vaclav','Vladik','Yuri','Zoran'],
         s: ['mir','slav','ko','ik','an','ev'] },
    f: { p: ['Agata','Bojana','Darija','Ekaterina','Galina','Irena','Katja','Ljubov','Mila','Natasha','Olga','Petra','Rada','Sonia','Tatiana','Valerija','Zora'],
         s: ['a','ka','ina','ova','ya'] },
  },
  'Human (Celtic)': {
    m: { p: ['Aidan','Brennan','Cormac','Declan','Eamon','Fergus','Gawain','Hamish','Iain','Kieran','Lachlan','Malachy','Niall','Owain','Padraig','Ruairi','Seamus','Tadhg'],
         s: ['an','in','ach','oc','us'] },
    f: { p: ['Aoife','Brigid','Caoimhe','Deirdre','Eilis','Fionnuala','Grainne','Isibeal','Keela','Liadan','Maeve','Niamh','Orla','Roisin','Saoirse','Siobhan','Una'],
         s: ['e','a','ach','in'] },
  },
  'Human (Eastern)': {
    m: { p: ['Arjun','Bao','Chen','Daisuke','Ekrem','Farhan','Genki','Haruto','Isamu','Jin','Kenji','Lei','Minato','Naoki','Omar','Priya','Riku','Shen','Takashi','Wei'],
         s: ['ro','ki','to','shi','n','ng'] },
    f: { p: ['Aiko','Bao','Chenxi','Hana','Ito','Jia','Keiko','Lian','Mei','Naoko','Priya','Rin','Sakura','Tomoko','Umeko','Wei','Xiao','Yuki','Zhen'],
         s: ['ko','ki','mi','na','ra','ka'] },
  },

  // ── Elf ──────────────────────────────────────────────────────────────────
  Elf: {
    m: { p: ['Aer','Cala','Elar','Fael','Iol','Lyr','Myr','Naer','Ryn','Syl','Thal','Vaer','Xael','Zyl'],
         mid: ['an','ar','ath','el','en','er','ial','iel','ith','oth','uel','wyn'],
         s: ['ian','iel','orn','ias','adan','adar','orn','or','an'] },
    f: { p: ['Aeli','Cala','Eoli','Fali','Iera','Lyri','Myri','Naeli','Ryna','Syla','Thali','Vaeli','Xaeli','Zylia'],
         mid: ['an','ara','ath','en','ia','iel','ira','ora','uel','wyn'],
         s: ['ara','iel','ina','wen','iel','ana','ira','ora'] },
  },

  // ── Dwarf ────────────────────────────────────────────────────────────────
  Dwarf: {
    m: { p: ['Bald','Brun','Dain','Durn','Grim','Gund','Hald','Keld','Mord','Norn','Rud','Thor','Thord','Trag','Ulf','Urg'],
         s: ['ak','ar','din','dor','dur','in','ok','rek','rim','rin','rock','thor','ul','un'] },
    f: { p: ['Amid','Ari','Bryn','Dis','Gerd','Grim','Heid','Hild','Mist','Nori','Sigr','Thur','Ulfr','Vigg'],
         s: ['a','da','dis','held','ild','ra','rid','run','thra'] },
  },

  // ── Halfling ─────────────────────────────────────────────────────────────
  Halfling: {
    m: { p: ['Alton','Beau','Cade','Corrin','Eldon','Garret','Lyle','Merry','Osborn','Perrin','Reed','Rolo','Sherrin','Tuck','Wade','Welby'],
         s: ['','s','y','ie'] },
    f: { p: ['Andry','Bree','Callie','Cora','Euphemia','Jillian','Kithri','Lavinia','Lidda','Merla','Nedda','Paela','Portia','Seraphina','Shaena','Tryn','Vani','Verna'],
         s: ['','a','ie','y'] },
  },

  // ── Gnome ────────────────────────────────────────────────────────────────
  Gnome: {
    m: { p: ['Alston','Bimpnottin','Bredbeddle','Cogsworth','Dabbledob','Ellywick','Fabblestich','Gimble','Glim','Namfoodle','Orryn','Roondar','Seebo','Sindri','Warryn','Wrenn','Zook'],
         s: ['','s','le','x'] },
    f: { p: ['Bimpnottin','Caramip','Duvamil','Ella','Ellyjobell','Loopmottin','Lorilla','Mardnab','Nissa','Nyx','Oda','Orla','Roywyn','Shamil','Tana','Waywocket','Zanna'],
         s: ['','a','ie'] },
  },

  // ── Half-Orc ─────────────────────────────────────────────────────────────
  'Half-Orc': {
    m: { p: ['Arg','Bor','Drak','Gath','Gor','Grish','Krag','Morg','Nag','Rag','Shar','Thok','Torg','Ulg','Vorg','Zag'],
         s: ['ak','ath','dak','druk','gath','nak','ok','rak','ruk','uk','ush'] },
    f: { p: ['Arha','Baggi','Dara','Engong','Kansif','Ownka','Poro','Shautha','Sutha','Vola','Volen','Yevelda','Zashja'],
         s: ['a','ah','ka','sha','tha'] },
  },

  // ── Tiefling ─────────────────────────────────────────────────────────────
  Tiefling: {
    // Virtue names (gender-neutral) or Infernal names
    virtue: ['Art','Carrion','Chant','Creed','Despair','Excellence','Fear','Glory','Hope','Ideal','Music','Nowhere','Open','Poetry','Quest','Random','Reverence','Sorrow','Temerity','Torment','Trauma','Vengeance','Void','Weary','Zeal'],
    m: { p: ['Akmenos','Amnon','Barakas','Damakos','Ekemon','Iados','Kairon','Leucis','Melech','Mordai','Morthos','Pelaios','Skamos','Therai','Xandros','Zarios'],
         s: ['os','us','as','ius','eos'] },
    f: { p: ['Akta','Anakis','Bryseis','Criella','Damaia','Ea','Kallista','Lerissa','Makaria','Nemeia','Orianna','Phelaia','Rieta','Tanis','Vauntea','Zelaia'],
         s: ['a','ia','aia','eia','ina'] },
  },

  // ── Dragonborn ───────────────────────────────────────────────────────────
  Dragonborn: {
    m: { p: ['Arj','Bal','Bha','Don','Ess','Ghe','Hav','Ill','Meh','Mirt','Nae','Pat','Rash','She','Skan','Tor','Vrag','Zeh'],
         s: ['an','ar','aar','asar','azan','dar','hor','ias','iath','kan','lok','sar','thor','zan','zar'] },
    f: { p: ['Akra','Biri','Daar','Farideh','Harann','Havilar','Jheri','Kava','Korinn','Mishann','Nala','Perra','Raiann','Sora','Surina','Thava','Uadjit'],
         s: ['a','ia','an','iah','ara'] },
  },

  // ── Half-Elf ─────────────────────────────────────────────────────────────
  'Half-Elf': {
    // Blend of human and elven phonetics
    m: { p: ['Adan','Aeron','Bran','Cael','Daern','Elan','Fael','Gael','Ilan','Lorn','Mael','Naer','Rael','Sael','Tael','Varl'],
         s: ['an','ath','iel','orn','yn','in','on','ar'] },
    f: { p: ['Aela','Brynn','Caela','Daela','Elaena','Faela','Gaela','Ileana','Laela','Maela','Naela','Raela','Saela','Taela','Vaela','Ylaena'],
         s: ['a','ael','ara','iel','yn','ina','wen'] },
  },
}

// ── Generator ────────────────────────────────────────────────────────────────

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildName(pool, gender) {
  const g = gender === 'feminine' ? 'f' : 'm'
  const gPool = pool[g] || pool['m']
  if (!gPool) return ''

  const prefix = rand(gPool.p)
  const mid    = gPool.mid ? rand(gPool.mid) : ''
  const suffix = rand(gPool.s)

  // Avoid double-vowel artifacts at joins
  let name = prefix
  if (mid && !(prefix.slice(-1).match(/[aeiou]/i) && mid[0].match(/[aeiou]/i))) {
    name += mid
  }
  if (suffix && !(name.slice(-1).match(/[aeiou]/i) && suffix[0].match(/[aeiou]/i))) {
    name += suffix
  }
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export const RACE_NAME_KEYS = [
  'Human (Nordic)',
  'Human (Mediterranean)',
  'Human (Slavic)',
  'Human (Celtic)',
  'Human (Eastern)',
  'Elf',
  'Dwarf',
  'Halfling',
  'Gnome',
  'Half-Orc',
  'Tiefling',
  'Dragonborn',
  'Half-Elf',
]

// Map toolkit race names → name pool keys
export const RACE_TO_NAME_KEY = {
  'Human':      'Human (Nordic)',
  'Elf':        'Elf',
  'High Elf':   'Elf',
  'Wood Elf':   'Elf',
  'Dark Elf':   'Elf',
  'Dwarf':      'Dwarf',
  'Hill Dwarf': 'Dwarf',
  'Mountain Dwarf': 'Dwarf',
  'Halfling':   'Halfling',
  'Lightfoot Halfling': 'Halfling',
  'Stout Halfling': 'Halfling',
  'Gnome':      'Gnome',
  'Forest Gnome': 'Gnome',
  'Rock Gnome': 'Gnome',
  'Half-Elf':   'Half-Elf',
  'Half-Orc':   'Half-Orc',
  'Tiefling':   'Tiefling',
  'Dragonborn': 'Dragonborn',
}

/**
 * Generate a single name.
 * @param {string} raceKey  - One of RACE_NAME_KEYS or a toolkit race name
 * @param {string} gender   - 'masculine' | 'feminine' | 'any'
 */
export function generateName(raceKey, gender = 'any') {
  const key = RACE_TO_NAME_KEY[raceKey] || raceKey
  const pool = POOLS[key]
  if (!pool) return 'Adventurer'

  const g = gender === 'any'
    ? (Math.random() < 0.5 ? 'masculine' : 'feminine')
    : gender

  // Tiefling: 30% chance of virtue name
  if (key === 'Tiefling' && Math.random() < 0.3) {
    return rand(pool.virtue)
  }

  // Some pools store full-name prefix arrays — detect by checking if any prefix has a space or is long
  const gPool = pool[g === 'feminine' ? 'f' : 'm']
  if (!gPool && pool.virtue) return rand(pool.virtue)

  // If suffix pool is just ['','s','y','ie'] style suffixes, just return prefix+suffix
  return buildName(pool, g)
}

/**
 * Generate an array of unique names.
 */
export function generateNames(raceKey, gender = 'any', count = 8) {
  const results = new Set()
  let attempts = 0
  while (results.size < count && attempts < count * 10) {
    results.add(generateName(raceKey, gender))
    attempts++
  }
  return [...results]
}
