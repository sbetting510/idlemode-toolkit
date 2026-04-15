export const CONDITIONS_2014 = [
  { name: 'Blinded',       sev: 'red',    effects: "Can't see. Attacks against you have advantage. Your attacks have disadvantage. Auto-fail checks requiring sight.",                                                          ends: 'Magical healing, spell end, or source removed.' },
  { name: 'Charmed',       sev: 'amber',  effects: "Can't attack or target the charmer with harmful abilities. Charmer has advantage on Charisma checks against you.",                                                         ends: 'Saving throw, harm from charmer, or spell end.' },
  { name: 'Deafened',      sev: 'blue',   effects: "Can't hear. Auto-fail hearing-based ability checks.",                                                                                                                      ends: 'Spell end or source removed.' },
  { name: 'Frightened',    sev: 'amber',  effects: "Disadvantage on checks and attacks while source is in line of sight. Can't willingly move closer to source.",                                                             ends: 'Source leaves line of sight, saving throw, or spell end.' },
  { name: 'Grappled',      sev: 'amber',  effects: "Speed becomes 0. Can't benefit from bonuses to speed.",                                                                                                                   ends: 'Escape action (Athletics or Acrobatics vs grappler), grappler incapacitated, or forced out of reach.' },
  { name: 'Incapacitated', sev: 'red',    effects: "Can't take actions or reactions.",                                                                                                                                        ends: 'Spell end or condition removed.' },
  { name: 'Invisible',     sev: 'purple', effects: "Can't be seen without special senses. Attacks against you have disadvantage. Your attacks have advantage.",                                                                ends: 'Spell end or condition removed.' },
  { name: 'Paralyzed',     sev: 'red',    effects: "Incapacitated. Can't move or speak. Auto-fail Str and Dex saves. Attacks have advantage. Melee within 5 ft are auto-crits.",                                             ends: 'Saving throw (usually Con) or spell end.' },
  { name: 'Petrified',     sev: 'red',    effects: "Turned to stone. Incapacitated. Auto-fail Str/Dex saves. Resistance to all damage. Immune to poison and disease.",                                                       ends: 'Greater Restoration or specific spell.' },
  { name: 'Poisoned',      sev: 'green',  effects: 'Disadvantage on attack rolls and ability checks.',                                                                                                                        ends: 'Antitoxin, spell, or duration end.' },
  { name: 'Prone',         sev: 'green',  effects: 'Your attacks have disadvantage. Melee attacks against you have advantage. Ranged attacks against you have disadvantage.',                                                 ends: 'Stand up (costs half movement speed).' },
  { name: 'Restrained',    sev: 'amber',  effects: 'Speed 0. Your attacks have disadvantage. Attacks against you have advantage. Disadvantage on Dex saves.',                                                                ends: 'Escape action or spell end.' },
  { name: 'Stunned',       sev: 'red',    effects: "Incapacitated. Can't move. Can only speak falteringly. Auto-fail Str/Dex saves. Attacks have advantage.",                                                                 ends: 'Saving throw or spell end.' },
  { name: 'Unconscious',   sev: 'red',    effects: "Incapacitated, can't move or speak. Drop held items, fall prone. Auto-fail Str/Dex saves. Melee within 5 ft are auto-crits.",                                            ends: 'Regaining HP or being stabilized.' },
]

export const EXHAUSTION_2014 = [
  { level: 'Level 1', effect: 'Disadvantage on ability checks' },
  { level: 'Level 2', effect: 'Speed halved' },
  { level: 'Level 3', effect: 'Disadvantage on attack rolls and saving throws' },
  { level: 'Level 4', effect: 'Hit point maximum halved' },
  { level: 'Level 5', effect: 'Speed reduced to 0' },
  { level: 'Level 6', effect: 'Death' },
]
