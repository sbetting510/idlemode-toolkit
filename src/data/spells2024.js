import { SPELLS } from './spells'

// Spells with changed mechanics in 2024
const CHANGES = {
  'Blade Ward': ['Blade Ward',0,'Abjuration','1 action','Self','1 minute','Yes','V, S','No','Invoke a protective ward; gain resistance to bludgeoning, piercing, and slashing damage for 1 minute. Requires concentration (up from 1 round, no concentration in 2014).'],
  'True Strike': ['True Strike',0,'Divination','1 action','Self','Instantaneous','No','S, M','No','Channel arcane precision into a melee weapon attack using your spellcasting ability modifier; on a hit deal the weapon\'s damage plus 1d6 radiant. (Completely redesigned — no longer sets up advantage.)'],
  'Sleep': ['Sleep',1,'Enchantment','1 action','60 feet','1 minute','No','V, S, M','No','Creatures in a 5-ft-radius sphere make a Wis save or fall unconscious. Awakened by damage or a creature using an action to rouse them. No longer targets by HP pool.'],
  'Magic Weapon': ['Magic Weapon',2,'Transmutation','1 bonus action','Touch','1 hour','No','V, S','No','Touch a nonmagical weapon; it gains a +1 bonus to attack and damage rolls for 1 hour. Concentration is no longer required. +2 at 5th level, +3 at 7th level.'],
}

// New cantrips and spells in the 2024 PHB not present in 2014 SRD
const NEW_SPELLS = [
  ['Elementalism',   0,'Transmutation','1 action','30 feet','Instantaneous','No','V, S','No','Exert minor control over a natural element: cause a fire to flare or gutter, shape or freeze a small amount of water, create a puff of air, or move a small piece of earth.'],
  ['Mind Sliver',    0,'Enchantment', '1 action','60 feet','Instantaneous','No','V',   'No','Drive a spike of psychic disruption into one creature\'s mind; Int save or 1d6 psychic and must subtract 1d4 from the next saving throw made before the end of your next turn.'],
  ['Sorcerous Burst',0,'Evocation',   '1 action','120 feet','Instantaneous','No','V, S','No','Project a burst of magical energy; target takes 1d8 damage (choose damage type each cast). For each die showing 8, roll an additional d8 and add it to the total.'],
  ['Starry Wisp',    0,'Evocation',   '1 action','60 feet','Instantaneous','No','V, S','No','Hurl a mote of starlight; Dex save or 1d8 radiant and the target sheds dim light in a 10-ft radius until your next turn (attacks against it can\'t benefit from being hidden).'],
  ['Thunderclap',    0,'Evocation',   '1 action','Self (5-ft radius)','Instantaneous','No','S','No','Create a burst of thunderous sound; each creature within 5 ft makes a Con save or takes 1d6 thunder damage. The crack is audible up to 100 ft away.'],
  ['Toll the Dead',  0,'Necromancy',  '1 action','60 feet','Instantaneous','No','V, S','No','Fill the air with a mournful death-bell toll; target makes a Wis save or takes 1d8 necrotic damage (1d12 if the creature is missing any HP).'],
  ['Word of Radiance',0,'Evocation',  '1 action','Self (5-ft radius)','Instantaneous','No','V, M','No','Burning radiance erupts from you; each creature of your choice within 5 ft makes a Con save or takes 1d6 radiant damage.'],
  // Befuddlement replaces Feeblemind in 2024
  ['Befuddlement',   8,'Enchantment', '1 action','150 feet','30 days','No','V, S, M','No','Target makes an Int save; on a fail Int and Cha scores become 1 and it can\'t cast spells, activate magic items, or communicate coherently. Repeats the save every 30 days.'],
]

export const SPELLS_2024 = [
  ...SPELLS
    .filter(s => s[0] !== 'Feeblemind')
    .map(s => CHANGES[s[0]] || s),
  ...NEW_SPELLS,
].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
