import { CLASSES, SPELL_SLOT_TABLE } from './classes'

// Spell slot progression is unchanged between 2014 and 2024
export { SPELL_SLOT_TABLE as SPELL_SLOT_TABLE_2024 }

// Per-class patches: only fields that differ from 2014 are listed
const CLASS_PATCHES = {
  barbarian: {
    subclasses: [
      { name: 'Path of the Berserker',  desc: 'Frenzy, Mindless Rage, Intimidating Presence, and Retaliation' },
      { name: 'Path of the Wild Heart', desc: 'Spirit-animal powers: Bear (resistance), Eagle (mobility), Elk (speed aura), Wolf (pack attacks)' },
      { name: 'Path of the World Tree', desc: 'Vitality of the Tree, Branches of the Tree, Travel along the Tree, and Roots of the Tree' },
      { name: 'Path of the Zealot',     desc: 'Divine Fury, Warrior of the Gods, Fanatical Focus, Zealous Presence, and Rage beyond Death' },
    ],
  },
  bard: {
    subclasses: [
      { name: 'College of Dance',   desc: 'Dazzling Footwork, Inspiring Movement, Tandem Footwork, and Leading Evasion' },
      { name: 'College of Glamour', desc: 'Mantle of Inspiration, Enthralling Performance, Mantle of Majesty, and Unbreakable Majesty' },
      { name: 'College of Lore',    desc: 'Cutting Words, Magical Discoveries, and Peerless Skill' },
      { name: 'College of Valor',   desc: 'Combat Inspiration, Extra Attack, and Battle Magic' },
    ],
  },
  cleric: {
    subclassLevel: 3,
    subclassName: 'Divine Order',
    subclasses: [
      { name: 'Life Domain',     desc: 'Disciple of Life, Preserve Life, Blessed Healer, and Supreme Healing' },
      { name: 'Light Domain',    desc: 'Warding Flare, Radiance of the Dawn, Improved Flare, and Corona of Light' },
      { name: 'Trickery Domain', desc: 'Blessing of the Trickster, Invoke Duplicity, Trickster\'s Transference, and Improved Duplicity' },
      { name: 'War Domain',      desc: 'War Priest, Guided Strike, War God\'s Blessing, and Avatar of Battle' },
    ],
  },
  druid: {
    subclassLevel: 3,
    subclassName: 'Druid Circle',
    subclasses: [
      { name: 'Circle of the Land', desc: 'Land\'s Aid, Natural Recovery, Land\'s Stride, Nature\'s Ward, and Nature\'s Sanctuary' },
      { name: 'Circle of the Moon', desc: 'Combat Wild Shape, Circle Forms, Elemental Wild Shape, Thousand Forms, and Beast Spells' },
      { name: 'Circle of the Sea',  desc: 'Wrath of the Sea, Aquatic Affinity, Stormborn, and Oceanic Gift' },
      { name: 'Circle of Stars',    desc: 'Star Map, Starry Form, Cosmic Omen, and Full of Stars' },
    ],
  },
  fighter: {
    subclasses: [
      { name: 'Battle Master',   desc: 'Superiority dice (d8s), Combat Maneuvers, Know Your Enemy, and Relentless' },
      { name: 'Champion',        desc: 'Improved Critical (19–20), Remarkable Athlete, Additional Fighting Style, and Survivor' },
      { name: 'Eldritch Knight', desc: 'Abjuration and Evocation spellcasting, War Magic, Eldritch Strike, and Arcane Charge' },
      { name: 'Psi Warrior',     desc: 'Psionic Power, Protective Field, Psionic Strike, Telekinetic Movement, and Guarded Mind' },
    ],
  },
  monk: {
    subclassName: 'Warrior Order',
    resources: [
      { name: 'Focus Points',      formula: (lvl) => lvl,                                                                    recharge: 'Short or long rest' },
      { name: 'Martial Arts die',  formula: (lvl) => lvl >= 17 ? 'd12' : lvl >= 11 ? 'd10' : lvl >= 5 ? 'd8' : 'd6',        recharge: 'Passive' },
      { name: 'Unarmored Movement',formula: (lvl) => `+${lvl >= 18 ? 30 : lvl >= 14 ? 25 : lvl >= 10 ? 20 : lvl >= 6 ? 15 : 10} ft`, recharge: 'Passive' },
      { name: 'Unarmored AC',      formula: () => '10 + Dex mod + Wis mod',                                                  recharge: 'Passive' },
    ],
    subclasses: [
      { name: 'Warrior of the Elements', desc: 'Manipulate earth, air, fire, and water through elemental disciplines' },
      { name: 'Warrior of the Hand',     desc: 'Open Hand Technique, Wholeness of Body, Tranquility, and Quivering Palm' },
      { name: 'Warrior of Mercy',        desc: 'Implements of Mercy, Hand of Harm, Hand of Healing, and Physician\'s Touch' },
      { name: 'Warrior of the Shadow',   desc: 'Shadow Arts, Shadow Step, Cloak of Shadows, and Opportunist' },
    ],
  },
  paladin: {
    subclasses: [
      { name: 'Oath of Devotion',     desc: 'Sacred Weapon, Turn the Unholy, Aura of Devotion, and Holy Nimbus' },
      { name: 'Oath of Glory',        desc: 'Inspiring Smite, Peerless Athlete, Aura of Alacrity, and Glorious Defense' },
      { name: 'Oath of the Ancients', desc: 'Nature\'s Wrath, Turn the Faithless, Aura of Warding, and Elder Champion' },
      { name: 'Oath of Vengeance',    desc: 'Vow of Enmity, Abjure Enemy, Relentless Avenger, and Soul of Vengeance' },
    ],
  },
  ranger: {
    subclassName: 'Ranger Subclass',
    subclasses: [
      { name: 'Beast Master',  desc: 'Primal Companion, Exceptional Training, Bestial Fury, and Share Spells' },
      { name: 'Fey Wanderer',  desc: 'Dreadful Strikes, Fey Reinforcements, Beguiling Twist, and Misty Wanderer' },
      { name: 'Gloom Stalker', desc: 'Dread Ambusher, Umbral Sight, Iron Mind, Stalker\'s Flurry, and Shadowy Dodge' },
      { name: 'Hunter',        desc: 'Hunter\'s Prey, Defensive Tactics, Multiattack, and Superior Hunter\'s Defense' },
    ],
  },
  rogue: {
    subclassName: 'Rogue Subclass',
    subclasses: [
      { name: 'Arcane Trickster', desc: 'Mage Hand Legerdemain, Magical Ambush, Versatile Trickster, and Spell Thief' },
      { name: 'Assassin',         desc: 'Assassinate, Infiltration Expertise, Impostor, and Death Strike' },
      { name: 'Soulknife',        desc: 'Psionic Whispers, Psychic Blades, Soul Blades, and Rend Mind' },
      { name: 'Thief',            desc: 'Fast Hands, Second-Story Work, Supreme Sneak, and Thief\'s Reflexes' },
    ],
  },
  sorcerer: {
    subclassLevel: 3,
    subclassName: 'Sorcerer Subclass',
    subclasses: [
      { name: 'Aberrant Sorcery',   desc: 'Telepathic Speech, Arms of the Overlord, Warping Implosion, and Create Thrall' },
      { name: 'Clockwork Sorcery',  desc: 'Restore Balance, Bastion of Law, Trance of Order, and Clockwork Cavalcade' },
      { name: 'Draconic Sorcery',   desc: 'Draconic Resilience, Elemental Affinity, Dragon Wings, and Draconic Presence' },
      { name: 'Wild Magic Sorcery', desc: 'Wild Magic Surge, Tides of Chaos, Bend Luck, Controlled Chaos, and Spell Bombardment' },
    ],
  },
  warlock: {
    subclassLevel: 3,
    subclassName: 'Patron',
    subclasses: [
      { name: 'Archfey Patron',      desc: 'Fey Presence, Misty Escape, Beguiling Defenses, and Dark Delirium' },
      { name: 'Celestial Patron',    desc: 'Healing Light, Radiant Soul, Celestial Resilience, and Searing Vengeance' },
      { name: 'Fiend Patron',        desc: 'Dark One\'s Blessing, Dark One\'s Own Luck, Fiendish Resilience, and Hurl through Hell' },
      { name: 'Great Old One Patron',desc: 'Awakened Mind, Entropic Ward, Thought Shield, and Create Thrall' },
    ],
  },
  wizard: {
    subclassLevel: 3,
    subclassName: 'Arcane School',
    subclasses: [
      { name: 'Abjurer',     desc: 'Abjuration Savant, Arcane Ward, Projected Ward, and Spell Resistance' },
      { name: 'Diviner',     desc: 'Divination Savant, Portent (2 dice), Expert Divination, and Greater Portent (3 dice)' },
      { name: 'Evoker',      desc: 'Evocation Savant, Sculpt Spells, Potent Cantrip, and Overchannel' },
      { name: 'Illusionist', desc: 'Illusion Savant, Improved Minor Illusion, Malleable Illusions, and Illusory Reality' },
    ],
  },
  artificer: {
    subclasses: [
      { name: 'Alchemist',    desc: 'Experimental Elixirs (random magical draughts), Alchemical Savant (Int bonus to healing/damage spells), Restorative Reagents, and Chemical Mastery' },
      { name: 'Armorer',      desc: 'Tools of the Trade (heavy armor proficiency), Arcane Armor (Guardian or Infiltrator models), Armor Modifications (extra infusion slots), and Perfected Armor' },
      { name: 'Artillerist',  desc: 'Eldritch Cannon (flamethrower, force ballista, or protector), Arcane Firearm (+1d8 to spell damage), Explosive Cannon, and Fortified Position' },
      { name: 'Battle Smith', desc: 'Battle Ready (Int for weapon attacks), Steel Defender (CR 2 mechanical companion), Arcane Jolt (+2d6 force or healing on hit), and Improved Defender' },
    ],
  },
  bloodhunter: {
    // Blood Hunter is a Matt Mercer homebrew (2022 version); compatible with 2024 rules.
    // No official 2024 PHB version exists — core mechanics are unchanged.
    subclasses: [
      { name: 'Order of the Ghostslayer',  desc: 'Rite of the Dawn (radiant rite), Ethereal Step (see Ethereal Plane), Blood Curse of the Exorcist, and Brand of Sundering' },
      { name: 'Order of the Lycan',        desc: 'Heightened Senses, Hybrid Transformation (wolf hybrid form with claws and Enhanced Speed), Stalker\'s Prowess, and Advanced Transformation' },
      { name: 'Order of the Mutant',       desc: 'Mutagenic Serums (Aether, Cruelty, Impetus, Mobility, Potency, Sagacity, Shielding, Unbreakable), Mutagenic Mastery, and Strange Metabolism' },
      { name: 'Order of the Profane Soul', desc: 'Pact Magic (Archfey, Fiend, or Great Old One patron), Mystical Nitpick, Crimson Vector, and Terrible Curse' },
    ],
  },
}

// Adjust the feature list when a class's subclass level changed
function patchFeatures(cls, patch) {
  if (!patch.subclassLevel || patch.subclassLevel === cls.subclassLevel) return cls.features
  const oldLevel = cls.subclassLevel
  const newLevel = patch.subclassLevel
  const newName  = patch.subclassName || cls.subclassName
  return cls.features
    .map(f => {
      if (f.type === 'Subclass' && f.level === oldLevel) {
        return { ...f, level: newLevel, name: newName }
      }
      return f
    })
    .sort((a, b) => a.level - b.level)
}

export const CLASSES_2024 = CLASSES.map(cls => {
  const patch = CLASS_PATCHES[cls.id] || {}
  const features = patchFeatures(cls, patch)
  return { ...cls, ...patch, features }
})
