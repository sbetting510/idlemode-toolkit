// ── Class Spell Lists (SRD 2014) ──────────────────────────────────────────────
// Maps each spellcasting class to the spell names that appear on their list.
// Spell details (level, school, etc.) come from src/data/spells.js & spells2024.js.
// Warlock spell list is shared across all patron subclasses.

export const CLASS_SPELL_LISTS = {

  Bard: [
    // Cantrips (0)
    'Dancing Lights','Light','Mage Hand','Mending','Message','Minor Illusion',
    'Prestidigitation','True Strike','Vicious Mockery',
    // 1st
    'Animal Friendship','Bane','Charm Person','Comprehend Languages',
    'Cure Wounds','Detect Magic','Disguise Self','Dissonant Whispers',
    'Faerie Fire','Feather Fall','Healing Word','Heroism','Identify',
    'Illusory Script','Longstrider','Silent Image','Sleep','Speak with Animals',
    'Tasha\'s Hideous Laughter','Thunderwave','Unseen Servant',
    // 2nd
    'Animal Messenger','Blindness/Deafness','Calm Emotions','Cloud of Daggers',
    'Crown of Madness','Darkness','Detect Thoughts','Enhance Ability',
    'Enthrall','Heat Metal','Hold Person','Invisibility','Knock',
    'Lesser Restoration','Locate Animals or Plants','Locate Object','Magic Mouth',
    'Mirror Image','Phantasmal Force','See Invisibility','Shatter','Silence',
    'Suggestion','Zone of Truth',
    // 3rd
    'Bestow Curse','Clairvoyance','Dispel Magic','Fear','Feign Death',
    'Glyph of Warding','Hypnotic Pattern','Leomund\'s Tiny Hut','Major Image',
    'Nondetection','Plant Growth','Sending','Speak with Dead','Speak with Plants',
    'Stinking Cloud','Tongues',
    // 4th
    'Compulsion','Confusion','Dimension Door','Freedom of Movement',
    'Greater Invisibility','Hallucinatory Terrain','Locate Creature','Polymorph',
    // 5th
    'Animate Objects','Awaken','Dominate Person','Dream','Geas',
    'Greater Restoration','Hold Monster','Legend Lore','Mass Cure Wounds',
    'Mislead','Modify Memory','Planar Binding','Raise Dead','Scrying',
    'Seeming','Telepathic Bond',
    // 6th
    'Eyebite','Find the Path','Guards and Wards','Mass Suggestion',
    'Otto\'s Irresistible Dance','Programmed Illusion','True Seeing',
    // 7th
    'Etherealness','Forcecage','Mirage Arcane','Mordenkainen\'s Magnificent Mansion',
    'Project Image','Regenerate','Resurrection','Symbol','Teleport',
    // 8th
    'Dominate Monster','Feeblemind','Glibness','Mind Blank','Power Word Stun',
    // 9th
    'Foresight','Power Word Heal','Power Word Kill','True Polymorph',
  ],

  Cleric: [
    // Cantrips
    'Guidance','Light','Mending','Resistance','Sacred Flame','Spare the Dying','Thaumaturgy',
    // 1st
    'Bane','Bless','Command','Create or Destroy Water','Cure Wounds',
    'Detect Evil and Good','Detect Magic','Detect Poison and Disease',
    'Guiding Bolt','Healing Word','Inflict Wounds','Protection from Evil and Good',
    'Purify Food and Drink','Sanctuary','Shield of Faith',
    // 2nd
    'Aid','Augury','Blindness/Deafness','Calm Emotions','Continual Flame',
    'Enhance Ability','Find Traps','Gentle Repose','Hold Person','Lesser Restoration',
    'Locate Object','Prayer of Healing','Protection from Poison','Silence',
    'Spiritual Weapon','Warding Bond','Zone of Truth',
    // 3rd
    'Animate Dead','Beacon of Hope','Bestow Curse','Clairvoyance','Create Food and Water',
    'Daylight','Dispel Magic','Feign Death','Glyph of Warding','Magic Circle',
    'Mass Healing Word','Meld into Stone','Protection from Energy','Remove Curse',
    'Revivify','Sending','Speak with Dead','Spirit Guardians','Tongues','Water Walk',
    // 4th
    'Banishment','Control Water','Death Ward','Divination',
    'Freedom of Movement','Guardian of Faith','Locate Creature','Stone Shape',
    // 5th
    'Commune','Contagion','Dispel Evil and Good','Flame Strike','Geas',
    'Greater Restoration','Hallow','Insect Plague','Legend Lore',
    'Mass Cure Wounds','Planar Binding','Raise Dead','Scrying',
    // 6th
    'Blade Barrier','Create Undead','Find the Path','Forbiddance',
    'Harm','Heal','Heroes\' Feast','Planar Ally','True Seeing','Word of Recall',
    // 7th
    'Conjure Celestial','Divine Word','Etherealness','Fire Storm',
    'Plane Shift','Regenerate','Resurrection','Symbol',
    // 8th
    'Antimagic Field','Control Weather','Earthquake','Holy Aura',
    // 9th
    'Astral Projection','Gate','Mass Heal','True Resurrection',
  ],

  Druid: [
    // Cantrips
    'Druidcraft','Guidance','Mending','Poison Spray','Produce Flame',
    'Resistance','Shillelagh','Thorn Whip',
    // 1st
    'Animal Friendship','Charm Person','Create or Destroy Water','Cure Wounds',
    'Detect Magic','Detect Poison and Disease','Entangle','Faerie Fire',
    'Fog Cloud','Goodberry','Healing Word','Jump','Longstrider',
    'Purify Food and Drink','Speak with Animals','Thunderwave',
    // 2nd
    'Animal Messenger','Barkskin','Darkvision','Enhance Ability','Find Traps',
    'Flame Blade','Flaming Sphere','Gust of Wind','Heat Metal','Hold Person',
    'Lesser Restoration','Locate Animals or Plants','Locate Object','Moonbeam',
    'Pass without Trace','Protection from Poison','Spike Growth',
    // 3rd
    'Call Lightning','Conjure Animals','Daylight','Dispel Magic',
    'Feign Death','Meld into Stone','Plant Growth','Protection from Energy',
    'Sleet Storm','Speak with Plants','Water Breathing','Water Walk','Wind Wall',
    // 4th
    'Blight','Confusion','Conjure Minor Elementals','Conjure Woodland Beings',
    'Control Water','Dominate Beast','Freedom of Movement','Giant Insect',
    'Hallucinatory Terrain','Ice Storm','Locate Creature','Polymorph',
    'Stone Shape','Stoneskin','Wall of Fire',
    // 5th
    'Antilife Shell','Awaken','Commune with Nature','Conjure Elemental',
    'Contagion','Geas','Greater Restoration','Insect Plague','Mass Cure Wounds',
    'Planar Binding','Reincarnate','Scrying','Tree Stride','Wall of Stone',
    // 6th
    'Conjure Fey','Find the Path','Heal','Heroes\' Feast','Move Earth',
    'Sunbeam','Transport via Plants','True Seeing','Wall of Thorns','Wind Walk',
    // 7th
    'Fire Storm','Mirage Arcane','Plane Shift','Regenerate','Reverse Gravity',
    // 8th
    'Animal Shapes','Antipathy/Sympathy','Control Weather','Earthquake',
    'Feeblemind','Sunburst','Tsunami',
    // 9th
    'Foresight','Shapechange','Storm of Vengeance','True Resurrection',
  ],

  Paladin: [
    // 1st
    'Bless','Command','Compelled Duel','Cure Wounds','Detect Evil and Good',
    'Detect Magic','Detect Poison and Disease','Divine Favor','Heroism',
    'Protection from Evil and Good','Purify Food and Drink','Shield of Faith',
    'Thunderous Smite','Wrathful Smite',
    // 2nd
    'Aid','Branding Smite','Find Steed','Lesser Restoration','Locate Object',
    'Magic Weapon','Protection from Poison','Zone of Truth',
    // 3rd
    'Aura of Vitality','Create Food and Water','Daylight','Dispel Magic',
    'Elemental Weapon','Magic Circle','Remove Curse','Revivify',
    // 4th
    'Aura of Life','Aura of Purity','Banishment','Death Ward',
    'Locate Creature','Staggering Smite',
    // 5th
    'Banishing Smite','Circle of Power','Destructive Wave','Dispel Evil and Good',
    'Geas','Holy Weapon','Raise Dead','Summon Celestial',
  ],

  Ranger: [
    // 1st
    'Alarm','Animal Friendship','Cure Wounds','Detect Magic',
    'Detect Poison and Disease','Ensnaring Strike','Fog Cloud','Goodberry',
    'Hunter\'s Mark','Jump','Longstrider','Speak with Animals',
    // 2nd
    'Animal Messenger','Barkskin','Darkvision','Find Traps',
    'Lesser Restoration','Locate Animals or Plants','Locate Object',
    'Pass without Trace','Protection from Poison','Silence','Spike Growth',
    // 3rd
    'Conjure Animals','Conjure Barrage','Daylight','Lightning Arrow',
    'Nondetection','Plant Growth','Protection from Energy',
    'Speak with Plants','Water Breathing','Water Walk','Wind Wall',
    // 4th
    'Conjure Woodland Beings','Freedom of Movement','Grasping Vine',
    'Locate Creature','Stoneskin',
    // 5th
    'Commune with Nature','Conjure Volley','Swift Quiver','Tree Stride',
  ],

  Sorcerer: [
    // Cantrips
    'Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Fire Bolt',
    'Friends','Light','Mage Hand','Mending','Message','Minor Illusion',
    'Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike',
    // 1st
    'Burning Hands','Charm Person','Chromatic Orb','Color Spray',
    'Comprehend Languages','Detect Magic','Disguise Self','Expeditious Retreat',
    'False Life','Feather Fall','Fog Cloud','Jump','Mage Armor',
    'Magic Missile','Ray of Sickness','Shield','Silent Image','Sleep',
    'Thunderwave','Witch Bolt',
    // 2nd
    'Alter Self','Blindness/Deafness','Blur','Cloud of Daggers',
    'Crown of Madness','Darkness','Darkvision','Detect Thoughts',
    'Enhance Ability','Enlarge/Reduce','Gust of Wind','Hold Person',
    'Invisibility','Knock','Levitate','Mirror Image','Misty Step',
    'Phantasmal Force','Scorching Ray','See Invisibility','Shatter',
    'Spider Climb','Suggestion','Web',
    // 3rd
    'Blink','Clairvoyance','Counterspell','Daylight','Dispel Magic',
    'Fear','Fireball','Fly','Gaseous Form','Haste','Hypnotic Pattern',
    'Lightning Bolt','Major Image','Protection from Energy','Sleet Storm',
    'Slow','Stinking Cloud','Tongues','Water Breathing','Water Walk',
    // 4th
    'Banishment','Blight','Confusion','Dimension Door',
    'Dominate Beast','Greater Invisibility','Ice Storm','Polymorph',
    'Stoneskin','Wall of Fire',
    // 5th
    'Animate Objects','Cloudkill','Cone of Cold','Creation',
    'Dominate Person','Hold Monster','Insect Plague','Seeming',
    'Telekinesis','Teleportation Circle','Wall of Stone',
    // 6th
    'Arcane Gate','Chain Lightning','Circle of Death','Disintegrate',
    'Eyebite','Globe of Invulnerability','Mass Suggestion','Move Earth',
    'Sunbeam','True Seeing',
    // 7th
    'Delayed Blast Fireball','Etherealness','Finger of Death',
    'Fire Storm','Plane Shift','Prismatic Spray','Reverse Gravity','Teleport',
    // 8th
    'Dominate Monster','Earthquake','Incendiary Cloud','Power Word Stun',
    'Sunburst',
    // 9th
    'Gate','Meteor Swarm','Power Word Kill','Time Stop','Wish',
  ],

  Warlock: [
    // Cantrips
    'Blade Ward','Chill Touch','Eldritch Blast','Friends','Mage Hand',
    'Minor Illusion','Poison Spray','Prestidigitation','True Strike',
    // 1st
    'Armor of Agathys','Arms of Hadar','Charm Person','Comprehend Languages',
    'Expeditious Retreat','Hellish Rebuke','Hex','Illusory Script',
    'Protection from Evil and Good','Unseen Servant','Witch Bolt',
    // 2nd
    'Cloud of Daggers','Crown of Madness','Darkness','Enthrall',
    'Hold Person','Invisibility','Mirror Image','Misty Step',
    'Ray of Enfeeblement','Shatter','Spider Climb','Suggestion',
    // 3rd
    'Counterspell','Dispel Magic','Fear','Fly','Gaseous Form',
    'Hunger of Hadar','Hypnotic Pattern','Magic Circle','Major Image',
    'Remove Curse','Tongues','Vampiric Touch',
    // 4th
    'Banishment','Blight','Dimension Door','Hallucinatory Terrain',
    // 5th
    'Contact Other Plane','Dream','Hold Monster','Scrying',
    // 6th
    'Arcane Gate','Circle of Death','Conjure Fey','Create Undead',
    'Eyebite','Flesh to Stone','Mass Suggestion','True Seeing',
    // 7th
    'Etherealness','Finger of Death','Forcecage','Plane Shift',
    // 8th
    'Demiplane','Dominate Monster','Feeblemind','Glibness','Power Word Stun',
    // 9th
    'Astral Projection','Foresight','Imprisonment','Power Word Kill','True Polymorph',
  ],

  Wizard: [
    // Cantrips
    'Acid Splash','Blade Ward','Chill Touch','Dancing Lights','Fire Bolt',
    'Friends','Light','Mage Hand','Mending','Message','Minor Illusion',
    'Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike',
    // 1st
    'Alarm','Burning Hands','Charm Person','Chromatic Orb','Color Spray',
    'Comprehend Languages','Detect Magic','Disguise Self','Expeditious Retreat',
    'False Life','Feather Fall','Find Familiar','Fog Cloud','Grease','Identify',
    'Illusory Script','Jump','Longstrider','Mage Armor','Magic Missile',
    'Protection from Evil and Good','Ray of Sickness','Shield','Silent Image',
    'Sleep','Tasha\'s Hideous Laughter','Thunderwave','Unseen Servant',
    'Witch Bolt',
    // 2nd
    'Alter Self','Arcane Lock','Blindness/Deafness','Blur','Cloud of Daggers',
    'Continual Flame','Crown of Madness','Darkness','Darkvision','Detect Thoughts',
    'Enlarge/Reduce','Flaming Sphere','Gentle Repose','Gust of Wind','Hold Person',
    'Invisibility','Knock','Levitate','Locate Object','Magic Mouth',
    'Magic Weapon','Mirror Image','Misty Step','Nystul\'s Magic Aura',
    'Phantasmal Force','Ray of Enfeeblement','Rope Trick','Scorching Ray',
    'See Invisibility','Shatter','Spider Climb','Suggestion','Web',
    // 3rd
    'Animate Dead','Bestow Curse','Blink','Clairvoyance','Counterspell',
    'Dispel Magic','Fear','Feign Death','Fireball','Fly','Gaseous Form',
    'Glyph of Warding','Haste','Hypnotic Pattern','Leomund\'s Tiny Hut',
    'Lightning Bolt','Magic Circle','Major Image','Nondetection',
    'Phantasmal Killer','Protection from Energy','Remove Curse','Sending',
    'Sleet Storm','Slow','Stinking Cloud','Tiny Servant','Tongues',
    'Vampiric Touch','Water Breathing',
    // 4th
    'Arcane Eye','Banishment','Blight','Confusion','Conjure Minor Elementals',
    'Control Water','Dimension Door','Evard\'s Black Tentacles','Fabricate',
    'Fire Shield','Greater Invisibility','Hallucinatory Terrain','Ice Storm',
    'Leomund\'s Secret Chest','Locate Creature','Mordenkainen\'s Faithful Hound',
    'Mordenkainen\'s Private Sanctum','Otiluke\'s Resilient Sphere','Phantasmal Killer',
    'Polymorph','Stone Shape','Stoneskin','Wall of Fire',
    // 5th
    'Animate Objects','Bigby\'s Hand','Cloudkill','Cone of Cold','Conjure Elemental',
    'Contact Other Plane','Creation','Dominate Person','Dream','Geas',
    'Hold Monster','Legend Lore','Mislead','Modify Memory',
    'Passwall','Planar Binding','Rary\'s Telepathic Bond','Scrying',
    'Seeming','Telekinesis','Teleportation Circle','Wall of Force','Wall of Stone',
    // 6th
    'Arcane Gate','Chain Lightning','Circle of Death','Contingency','Create Undead',
    'Disintegrate','Drawmij\'s Instant Summons','Eyebite','Flesh to Stone',
    'Globe of Invulnerability','Guards and Wards','Magic Jar','Mass Suggestion',
    'Move Earth','Otiluke\'s Freezing Sphere','Otto\'s Irresistible Dance',
    'Programmed Illusion','Sunbeam','True Seeing','Wall of Ice',
    // 7th
    'Delayed Blast Fireball','Etherealness','Finger of Death','Forcecage',
    'Mirage Arcane','Mordenkainen\'s Magnificent Mansion','Mordenkainen\'s Sword',
    'Plane Shift','Prismatic Spray','Project Image','Reverse Gravity',
    'Sequester','Simulacrum','Symbol','Teleport',
    // 8th
    'Antimagic Field','Antipathy/Sympathy','Clone','Control Weather','Demiplane',
    'Dominate Monster','Feeblemind','Incendiary Cloud','Maze','Mind Blank',
    'Power Word Stun','Sunburst','Telepathy',
    // 9th
    'Astral Projection','Foresight','Gate','Imprisonment','Meteor Swarm',
    'Power Word Kill','Prismatic Wall','Shapechange','Time Stop',
    'True Polymorph','Weird','Wish',
  ],

  // Fighter (Eldritch Knight) — subclass only, added dynamically
  'Eldritch Knight': [
    'Blade Ward','Booming Blade','Fire Bolt','Frostbite','Green-Flame Blade',
    'Light','Mage Hand','Shocking Grasp','True Strike',
    'Alarm','Burning Hands','Chromatic Orb','Color Spray','Detect Magic',
    'Disguise Self','Expeditious Retreat','False Life','Feather Fall',
    'Find Familiar','Fog Cloud','Grease','Identify','Mage Armor',
    'Magic Missile','Protection from Evil and Good','Ray of Sickness',
    'Shield','Silent Image','Sleep','Thunderwave','Witch Bolt',
    'Arcane Lock','Blur','Darkness','Darkvision','Enlarge/Reduce',
    'Hold Person','Invisibility','Knock','Levitate','Magic Weapon',
    'Mirror Image','Misty Step','Ray of Enfeeblement','Scorching Ray',
    'See Invisibility','Shatter','Spider Climb','Suggestion', 'Web',
  ],

  // Rogue (Arcane Trickster) — subclass only, added dynamically
  'Arcane Trickster': [
    'Blade Ward','Fire Bolt','Friends','Light','Mage Hand','Minor Illusion',
    'Poison Spray','Prestidigitation','True Strike',
    'Charm Person','Color Spray','Disguise Self','Illusory Script',
    'Mage Armor','Magic Missile','Silent Image','Sleep','Tasha\'s Hideous Laughter',
    'Blindness/Deafness','Blur','Crown of Madness','Darkness','Detect Thoughts',
    'Invisibility','Knock','Mirror Image','Misty Step',
    'Phantasmal Force','See Invisibility','Suggestion',
    'Blink','Counterspell','Dispel Magic','Fear','Fly','Hypnotic Pattern',
    'Major Image','Nondetection','Phantom Steed','Stinking Cloud','Tongues',
    'Arcane Eye','Confusion','Greater Invisibility','Hallucinatory Terrain',
    'Phantasmal Killer','Polymorph',
  ],
}

// ── Cantrips per class at level 1 ─────────────────────────────────────────────
export const CANTRIPS_KNOWN = {
  Bard:     { 1:2, 4:3, 10:4 },
  Cleric:   { 1:3, 4:4, 10:5 },
  Druid:    { 1:2, 4:3, 10:4 },
  Sorcerer: { 1:4, 4:5, 10:6 },
  Warlock:  { 1:2, 4:3, 10:4 },
  Wizard:   { 1:3, 4:4, 10:5 },
}

// ── Spells known / prepared per class ────────────────────────────────────────
export function getSpellsKnownCount(className, level, abilityScore = 10) {
  const mod = Math.floor((abilityScore - 10) / 2)
  // Prepared casters
  if (['Cleric','Druid','Paladin'].includes(className)) {
    if (className === 'Paladin') return Math.max(1, Math.floor(level / 2) + mod)
    return Math.max(1, level + mod)
  }
  // Known casters
  const known = {
    Bard:     [4,5,6,7,8,9,10,11,12,13,14,15,15,16,16,16,17,17,18,22],
    Ranger:   [0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11],
    Sorcerer: [2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
    Warlock:  [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,15,15,15],
  }
  return known[className]?.[level - 1] ?? null
}

// ── Helper: get class spell list keys ────────────────────────────────────────
export function getClassSpellList(className) {
  return CLASS_SPELL_LISTS[className] || []
}

// ── Cantrips known count helper ───────────────────────────────────────────────
export function getCantripsKnown(className, level) {
  const table = CANTRIPS_KNOWN[className]
  if (!table) return 0
  let known = 0
  for (const [lvl, count] of Object.entries(table)) {
    if (level >= parseInt(lvl)) known = count
  }
  return known
}
