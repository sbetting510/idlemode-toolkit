export const CONDITIONS_2024 = [
  // Unchanged
  { name: 'Blinded',       sev: 'red',    effects: "Can't see. Attacks against you have advantage. Your attacks have disadvantage. Auto-fail checks requiring sight.",                                                                                                                                  ends: 'Magical healing, spell end, or source removed.' },
  { name: 'Charmed',       sev: 'amber',  effects: "Can't attack or target the charmer with harmful abilities. Charmer has advantage on Charisma checks against you.",                                                                                                                                 ends: 'Saving throw, harm from charmer, or spell end.' },
  { name: 'Deafened',      sev: 'blue',   effects: "Can't hear. Auto-fail hearing-based ability checks.",                                                                                                                                                                                             ends: 'Spell end or source removed.' },
  { name: 'Frightened',    sev: 'amber',  effects: "Disadvantage on checks and attacks while source is in line of sight. Can't willingly move closer to source.",                                                                                                                                    ends: 'Source leaves line of sight, saving throw, or spell end.' },
  // Changed
  { name: 'Grappled',      sev: 'amber',  effects: "Speed becomes 0. Disadvantage on attack rolls against any target other than the grappler. The grappler can drag or carry you when it moves, but every foot costs 1 extra foot unless you are Tiny or two or more sizes smaller than the grappler.", ends: 'Escape action (Str Athletics or Dex Acrobatics check vs DC 8 + grappler\'s Str mod + Prof bonus), grappler becomes Incapacitated, or distance exceeds grapple range.' },
  // Changed
  { name: 'Incapacitated', sev: 'red',    effects: "Can't take actions or reactions. Can't concentrate on spells. Can't speak. Rolls initiative with Disadvantage.",                                                                                                                                  ends: 'Spell end or condition removed.' },
  // Changed
  { name: 'Invisible',     sev: 'purple', effects: "Can't be seen without special senses. Attacks against you have disadvantage. Your attacks have advantage. Grants Advantage on Initiative rolls.",                                                                                                  ends: 'Spell end or condition removed.' },
  // Unchanged
  { name: 'Paralyzed',     sev: 'red',    effects: "Incapacitated. Can't move or speak. Auto-fail Str and Dex saves. Attacks have advantage. Melee within 5 ft are auto-crits.",                                                                                                                     ends: 'Saving throw (usually Con) or spell end.' },
  { name: 'Petrified',     sev: 'red',    effects: "Turned to stone. Incapacitated. Auto-fail Str/Dex saves. Resistance to all damage. Immune to poison and disease.",                                                                                                                               ends: 'Greater Restoration or specific spell.' },
  { name: 'Poisoned',      sev: 'green',  effects: 'Disadvantage on attack rolls and ability checks.',                                                                                                                                                                                               ends: 'Antitoxin, spell, or duration end.' },
  { name: 'Prone',         sev: 'green',  effects: 'Your attacks have disadvantage. Melee attacks against you have advantage. Ranged attacks against you have disadvantage.',                                                                                                                        ends: 'Stand up (costs half movement speed).' },
  { name: 'Restrained',    sev: 'amber',  effects: 'Speed 0. Your attacks have disadvantage. Attacks against you have advantage. Disadvantage on Dex saves.',                                                                                                                                       ends: 'Escape action or spell end.' },
  { name: 'Stunned',       sev: 'red',    effects: "Incapacitated. Can't move. Can only speak falteringly. Auto-fail Str/Dex saves. Attacks have advantage.",                                                                                                                                        ends: 'Saving throw or spell end.' },
  { name: 'Unconscious',   sev: 'red',    effects: "Incapacitated, can't move or speak. Drop held items, fall prone. Auto-fail Str/Dex saves. Melee within 5 ft are auto-crits.",                                                                                                                   ends: 'Regaining HP or being stabilized.' },
]

export const EXHAUSTION_2024 = [
  { level: 'Level 1', effect: 'All d20 rolls reduced by 2; Speed reduced by 5 ft' },
  { level: 'Level 2', effect: 'All d20 rolls reduced by 4; Speed reduced by 10 ft' },
  { level: 'Level 3', effect: 'All d20 rolls reduced by 6; Speed reduced by 15 ft' },
  { level: 'Level 4', effect: 'All d20 rolls reduced by 8; Speed reduced by 20 ft' },
  { level: 'Level 5', effect: 'All d20 rolls reduced by 10; Speed reduced by 25 ft' },
  { level: 'Level 6', effect: 'Death' },
]
