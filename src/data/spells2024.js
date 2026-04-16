import { SPELLS } from './spells'

// Spells with changed mechanics in 2024
const CHANGES = {
  'Blade Ward':   ['Blade Ward',0,'Abjuration','1 action','Self','1 minute','Yes','V, S','No','Invoke a protective ward; gain resistance to bludgeoning, piercing, and slashing damage for 1 minute. Requires concentration (up from 1 round, no concentration in 2014).'],
  'True Strike':  ['True Strike',0,'Divination','1 action','Self','Instantaneous','No','S, M','No','Channel arcane precision into a melee weapon attack using your spellcasting ability modifier; on a hit deal the weapon\'s damage plus 1d6 radiant. (Completely redesigned — no longer sets up advantage.)'],
  'Sleep':        ['Sleep',1,'Enchantment','1 action','60 feet','1 minute','No','V, S, M','No','Creatures in a 5-ft-radius sphere make a Wis save or fall unconscious. Awakened by damage or a creature using an action to rouse them. No longer targets by HP pool.'],
  'Barkskin':     ['Barkskin',2,'Transmutation','1 bonus action','Touch','1 hour','No','V, S, M','No','Touch a willing creature; its AC becomes 17 if not already higher. Concentration is no longer required; cast time reduced to bonus action. (Changed from 2014.)'],
  'Cloud of Daggers': ['Cloud of Daggers',2,'Conjuration','1 action','60 feet','1 minute','Yes','V, S, M','No','Fill a 5-ft cube with spinning daggers; move it up to 30 ft as a bonus action. Creatures entering or ending their turn there take 4d4 slashing. (Moveable in 2024.)'],
  'Lesser Restoration': ['Lesser Restoration',2,'Abjuration','1 bonus action','Touch','Instantaneous','No','V, S','No','End one disease or one condition: blinded, deafened, paralyzed, or poisoned. Cast as a bonus action in 2024 (was 1 action in 2014).'],
  'Magic Weapon': ['Magic Weapon',2,'Transmutation','1 bonus action','Touch','1 hour','No','V, S','No','Touch a nonmagical weapon; it gains a +1 bonus to attack and damage rolls for 1 hour. Concentration is no longer required. +2 at 5th level, +3 at 7th level.'],
  'Prayer of Healing': ['Prayer of Healing',2,'Evocation','10 minutes','30 feet','Instantaneous','No','V','No','Up to 5 creatures each regain 2d8 + spellcasting modifier HP. (2024: up to 5 targets, can be used after a Short Rest.)'],
  'Spiritual Weapon': ['Spiritual Weapon',2,'Evocation','1 bonus action','60 feet','1 minute','Yes','V, S','No','Create a floating spectral weapon that attacks as a bonus action; requires concentration in 2024. (Was non-concentration in 2014.)'],
  'Evard\'s Black Tentacles': null, // renamed to Black Tentacles in 2024
}

// New cantrips and spells in the 2024 PHB not present in 2014 SRD
const NEW_SPELLS = [
  // Cantrips
  ['Elementalism',   0,'Transmutation','1 action','30 feet','Instantaneous','No','V, S','No','Exert minor control over a natural element: cause a fire to flare or gutter, shape or freeze a small amount of water, create a puff of air, or move a small piece of earth.'],
  ['Mind Sliver',    0,'Enchantment', '1 action','60 feet','Instantaneous','No','V',   'No','Drive a spike of psychic disruption into one creature\'s mind; Int save or 1d6 psychic and must subtract 1d4 from the next saving throw made before the end of your next turn.'],
  ['Sorcerous Burst',0,'Evocation',   '1 action','120 feet','Instantaneous','No','V, S','No','Project a burst of magical energy; target takes 1d8 damage (choose damage type each cast). For each die showing 8, roll an additional d8 and add it to the total.'],
  ['Starry Wisp',    0,'Evocation',   '1 action','60 feet','Instantaneous','No','V, S','No','Hurl a mote of starlight; Dex save or 1d8 radiant and the target sheds dim light in a 10-ft radius until your next turn (attacks against it can\'t benefit from being hidden).'],
  ['Thunderclap',    0,'Evocation',   '1 action','Self (5-ft radius)','Instantaneous','No','S','No','Create a burst of thunderous sound; each creature within 5 ft makes a Con save or takes 1d6 thunder damage. The crack is audible up to 100 ft away.'],
  ['Toll the Dead',  0,'Necromancy',  '1 action','60 feet','Instantaneous','No','V, S','No','Fill the air with a mournful death-bell toll; target makes a Wis save or takes 1d8 necrotic damage (1d12 if the creature is missing any HP).'],
  ['Word of Radiance',0,'Evocation',  '1 action','Self (5-ft radius)','Instantaneous','No','V, M','No','Burning radiance erupts from you; each creature of your choice within 5 ft makes a Con save or takes 1d6 radiant damage.'],
  // Level 1
  ['Chromatic Orb',  1,'Evocation',   '1 action','90 feet','Instantaneous','No','V, S, M','No','Hurl a 4-inch sphere of energy; make a ranged spell attack for 3d8 damage. Choose the damage type: acid, cold, fire, lightning, poison, or thunder.'],
  ['Dissonant Whispers',1,'Enchantment','1 action','60 feet','Instantaneous','No','V','No','Whisper a discordant melody; target makes a Wis save or takes 3d6 psychic damage and uses its reaction to immediately move away.'],
  ['Divine Smite',   1,'Evocation',   '1 bonus action','Self','Instantaneous','No','V','No','When you hit with a melee weapon attack, expend a spell slot to deal extra radiant damage: 2d8 for 1st level +1d8 per slot above 1st, and +1d8 against undead or fiends.'],
  ['Ensnaring Strike',1,'Conjuration','1 bonus action','Self','1 minute','Yes','V','No','Your next weapon hit causes vines to erupt; target makes a Str save or is restrained and takes 1d6 piercing at the start of each of its turns.'],
  ['Searing Smite',  1,'Evocation',   '1 bonus action','Self','1 minute','Yes','V','No','Your next weapon hit deals an extra 1d6 fire and sets the target ablaze; the target takes 1d6 fire at the start of each turn until it succeeds on a Con save.'],
  // Level 2
  ['Arcane Vigor',   2,'Abjuration',  '1 bonus action','Self','Instantaneous','No','V, S','No','Draw on your magical reserves to heal yourself; regain HP equal to 2d6 + your spellcasting ability modifier. Higher slots increase the dice.'],
  ['Dragon\'s Breath',2,'Transmutation','1 bonus action','Touch','1 minute','Yes','V, S, M','No','Touch a willing creature; it can use an action to exhale energy in a 15-ft cone dealing 3d6 damage. Choose acid, cold, fire, lightning, or poison.'],
  ['Mind Spike',     2,'Divination',  '1 action','60 feet','1 hour','Yes','V','No','Make a ranged spell attack; on a hit deal 3d8 psychic damage and you always know the target\'s location for the duration, even if hidden or invisible.'],
  ['Shining Smite',  2,'Transmutation','1 bonus action','Self','1 minute','Yes','V','No','Your next weapon hit deals an extra 2d6 radiant and the target sheds bright light 5 ft; attacks against it have advantage while it glows.'],
  // Level 4
  ['Black Tentacles',4,'Conjuration', '1 action','90 feet','1 minute','Yes','V, S, M','No','Rubbery tentacles fill a 20-ft square; creatures make Dex saves or are restrained and take 3d6 bludgeoning at the start of each turn. (Renamed from Evard\'s Black Tentacles in 2024.)'],
  ['Charm Monster',  4,'Enchantment', '1 action','30 feet','1 hour','No','V, S','No','A creature makes a Wis save or is charmed by you for the duration; it regards you as a friendly acquaintance. Works on any creature, not just humanoids.'],
  ['Fount of Moonlight',4,'Evocation','1 action','Self','10 minutes','Yes','V, S','No','Luminous moonlight radiates from you in a 20-ft radius; shed bright light, deal 2d6 radiant as a reaction when hit, and attack with radiant energy.'],
  ['Vitriolic Sphere',4,'Evocation',  '1 action','150 feet','Instantaneous','No','V, S, M','No','Hurl a 2-inch sphere of acid; creatures in a 20-ft radius make Dex saves or take 10d4 acid now and 5d4 acid at the end of their next turn.'],
  // Level 5
  ['Jallarzi\'s Storm of Radiance',5,'Evocation','1 action','120 feet','1 minute','Yes','V, S','No','A storm of searing radiance fills a 10-ft radius, 30-ft tall cylinder; creatures inside make Con saves or take 2d10 radiant and become blinded until the end of their next turn.'],
  ['Summon Dragon',  5,'Conjuration', '1 action','60 feet','1 hour','Yes','V, S, M','No','Summon a draconic spirit that appears in an unoccupied space; choose a damage type to determine its nature. It obeys your commands and can breathe energy.'],
  ['Yolande\'s Regal Presence',5,'Enchantment','1 action','60 feet','1 minute','Yes','V, S','No','You radiate regal power; creatures make Wis saves or are charmed until the end of your next turn, treating you as royalty and unable to attack you.'],
  // Level 6
  ['Tasha\'s Bubbling Cauldron',6,'Conjuration','1 action','5 feet','10 minutes','No','V, S, M','No','Summon a magical cauldron that produces one of several effects: healing potion, antitoxin, or poison brew. Lasts 10 minutes or until used.'],
  // Level 7
  ['Power Word Fortify',7,'Enchantment','1 action','60 feet','Instantaneous','No','V','No','Utter a word of power; grant a creature you can see temporary HP equal to your spellcasting ability modifier × 10, up to a maximum based on their current HP.'],
  // Level 8
  ['Tsunami',        8,'Conjuration', '1 minute','Sight','6 rounds','Yes','V, S','No','A wall of water 300 ft long, 300 ft high, and 50 ft thick crashes forward; creatures make Str saves each round or take 6d10 bludgeoning and are swept away.'],
  // Befuddlement replaces Feeblemind in 2024
  ['Befuddlement',   8,'Enchantment', '1 action','150 feet','30 days','No','V, S, M','No','Target makes an Int save; on a fail Int and Cha scores become 1 and it can\'t cast spells, activate magic items, or communicate coherently. Repeats the save every 30 days.'],
]

export const SPELLS_2024 = [
  ...SPELLS
    .filter(s => s[0] !== 'Feeblemind' && s[0] !== "Evard's Black Tentacles")
    .map(s => CHANGES[s[0]] !== undefined ? CHANGES[s[0]] : s)
    .filter(Boolean),
  ...NEW_SPELLS,
].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
