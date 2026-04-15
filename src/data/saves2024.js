export const SAVES_2024 = [
  { ability: 'Strength',     triggers: 'Grapple escape (now a save vs DC 8 + Str mod + Prof), Thunderwave, push effects, Hold Monster (Str)', range: '12–18' },
  { ability: 'Dexterity',    triggers: 'Fireball, breath weapons, traps, most area spells, Evasion. Also used as an alternative to Strength when escaping a Grapple or Shove. Surprised creatures roll initiative at Disadvantage (Dex-based).', range: '13–18' },
  { ability: 'Constitution', triggers: 'Concentration checks, poison, disease, massive damage. Exhaustion now applies a cumulative −2 per level to all d20 rolls including Con saves.', range: '10–18' },
  { ability: 'Intelligence', triggers: 'Mind Flayer extract, Feeblemind, Symbol, some illusions',       range: '13–17' },
  { ability: 'Wisdom',       triggers: 'Charm, Fear, Hold Person, Command, Dominate, Banishment',       range: '13–17' },
  { ability: 'Charisma',     triggers: 'Banishment, Compulsion, Modify Memory',                         range: '13–17' },
]

// DC reference is unchanged between editions
export const DCS_2024 = [
  { dc: 5,  label: 'Very easy', example: 'Kick open an unlocked door' },
  { dc: 10, label: 'Easy',      example: 'Climb a knotted rope'        },
  { dc: 15, label: 'Medium',    example: 'Pick a simple lock'          },
  { dc: 20, label: 'Hard',      example: 'Break a reinforced door'     },
  { dc: 25, label: 'Very hard', example: 'Lift a portcullis'           },
  { dc: 30, label: 'Heroic',    example: 'Near-impossible feat'        },
]
