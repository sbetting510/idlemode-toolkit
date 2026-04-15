export const COMBAT_RULES_2014 = [
  // Death & Dying
  { name: 'Death saving throws', cat: 'Death & Dying',   desc: 'Roll d20 each turn at 0 HP. 10+ = success, 9− = failure. 3 successes = stable. 3 failures = dead. Roll of 1 = 2 failures. Roll of 20 = regain 1 HP.' },
  { name: 'Stabilizing',         cat: 'Death & Dying',   desc: 'Use an action to make DC 10 Medicine check on a 0 HP creature to stabilize it. Any healing also stabilizes. A stable creature regains 1 HP after 1d4 hours.' },
  // Spellcasting
  { name: 'Concentration',       cat: 'Spellcasting',    desc: 'You can concentrate on one spell at a time. Taking damage requires a Con save (DC = max(10, half damage taken)). Being incapacitated or killed ends it instantly.' },
  { name: 'Casting in melee',    cat: 'Spellcasting',    desc: 'Being within 5 ft of a hostile creature does not impose disadvantage on spell attack rolls. Ranged spell attacks do have disadvantage if a hostile creature is within 5 ft.' },
  // Cover
  { name: 'Half cover',          cat: 'Cover',           desc: '+2 bonus to AC and Dex saves. Provided by a low wall, large furniture, or another creature.' },
  { name: 'Three-quarters cover',cat: 'Cover',           desc: '+5 bonus to AC and Dex saves. Provided by a portcullis, arrow slit, or thick tree trunk.' },
  { name: 'Full cover',          cat: 'Cover',           desc: "Can't be targeted directly by attacks or spells. Provided by complete concealment — a wall, closed door, etc." },
  // Movement
  { name: 'Difficult terrain',   cat: 'Movement',        desc: 'Costs 1 extra foot of movement per foot traveled. Rubble, deep snow, shallow water, dense forest, etc.' },
  { name: 'Falling',             cat: 'Movement',        desc: '1d6 bludgeoning damage per 10 ft fallen, max 20d6. Land prone unless you avoid damage somehow.' },
  { name: 'Climbing & swimming', cat: 'Movement',        desc: 'Each foot costs 1 extra foot of movement unless you have the appropriate speed.' },
  // Initiative
  { name: 'Surprise',            cat: 'Initiative',      desc: "If surprised, you can't move or take an action on your first turn, and can't take reactions until that turn ends." },
  { name: 'Initiative',          cat: 'Initiative',      desc: 'Roll d20 + Dex modifier at the start of combat. Higher results act first. Ties broken by higher Dex modifier.' },
  // Special Attacks
  { name: 'Grappling',           cat: 'Special Attacks', desc: "Use the Attack action: Strength (Athletics) vs target's Athletics or Acrobatics. On success, target is grappled (speed 0)." },
  { name: 'Shoving',             cat: 'Special Attacks', desc: "Use the Attack action: Strength (Athletics) vs target's Athletics or Acrobatics. On success, knock prone or push 5 ft." },
  { name: 'Two-weapon fighting', cat: 'Special Attacks', desc: "When you Attack with a light melee weapon, use a bonus action to attack with a different light melee weapon. Don't add ability mod to bonus attack damage unless negative." },
  { name: 'Flanking (optional)', cat: 'Special Attacks', desc: 'When you and an ally are on opposite sides of an enemy, you both have advantage on melee attacks against it. DM decides whether to use this rule.' },
]
