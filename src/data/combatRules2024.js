export const COMBAT_RULES_2024 = [
  // Death & Dying — Death saving throws and Stabilizing unchanged
  { name: 'Death saving throws', cat: 'Death & Dying',   desc: 'Roll d20 each turn at 0 HP. 10+ = success, 9− = failure. 3 successes = stable. 3 failures = dead. Roll of 1 = 2 failures. Roll of 20 = regain 1 HP.' },
  { name: 'Stabilizing',         cat: 'Death & Dying',   desc: 'Use an action to make DC 10 Medicine check on a 0 HP creature to stabilize it. Any healing also stabilizes. A stable creature regains 1 HP after 1d4 hours.' },
  // NEW — replaces the 2014 tiered exhaustion chart
  { name: 'Exhaustion revised',  cat: 'Death & Dying',   desc: 'Each exhaustion level imposes a cumulative −2 penalty to all d20 rolls and reduces speed by 5 ft (level 3 exhaustion = −6 to all d20 rolls, −15 ft speed). Still 6 levels maximum; death at level 6. Replaces the 2014 tiered effect chart.' },

  // Spellcasting — unchanged
  { name: 'Concentration',       cat: 'Spellcasting',    desc: 'You can concentrate on one spell at a time. Taking damage requires a Con save (DC = max(10, half damage taken)). Being incapacitated or killed ends it instantly.' },
  { name: 'Casting in melee',    cat: 'Spellcasting',    desc: 'Being within 5 ft of a hostile creature does not impose disadvantage on spell attack rolls. Ranged spell attacks do have disadvantage if a hostile creature is within 5 ft.' },

  // Cover — unchanged
  { name: 'Half cover',          cat: 'Cover',           desc: '+2 bonus to AC and Dex saves. Provided by a low wall, large furniture, or another creature.' },
  { name: 'Three-quarters cover',cat: 'Cover',           desc: '+5 bonus to AC and Dex saves. Provided by a portcullis, arrow slit, or thick tree trunk.' },
  { name: 'Full cover',          cat: 'Cover',           desc: "Can't be targeted directly by attacks or spells. Provided by complete concealment — a wall, closed door, etc." },

  // Movement — Difficult terrain changed; others unchanged
  { name: 'Difficult terrain',   cat: 'Movement',        desc: 'Costs 1 extra foot of movement per foot traveled. Moving through a friendly creature\'s space is no longer difficult terrain — allies do not impede each other\'s movement.' },
  { name: 'Falling',             cat: 'Movement',        desc: '1d6 bludgeoning damage per 10 ft fallen, max 20d6. Land prone unless you avoid damage somehow.' },
  { name: 'Climbing & swimming', cat: 'Movement',        desc: 'Each foot costs 1 extra foot of movement unless you have the appropriate speed.' },

  // Initiative — Surprise changed; Initiative unchanged
  { name: 'Surprise',            cat: 'Initiative',      desc: 'Surprised creatures roll Initiative at Disadvantage. They are no longer prevented from acting on their first turn — they simply go later in the order due to the lower roll.' },
  { name: 'Initiative',          cat: 'Initiative',      desc: 'Roll d20 + Dex modifier at the start of combat. Higher results act first. Ties broken by higher Dex modifier.' },

  // Special Attacks — Grappling, Shoving, Two-weapon fighting changed; new Unarmed Strike options; Flanking unchanged
  { name: 'Unarmed Strike options', cat: 'Special Attacks', desc: 'When making an Unarmed Strike, choose one: Damage (attack roll, deals 1 + Str mod bludgeoning), Grapple (target saves or gains Grappled condition), or Shove (target saves or is pushed 5 ft / knocked Prone). You may equip or unequip one weapon as part of the attack.' },
  { name: 'Grappling',           cat: 'Special Attacks', desc: 'Use an Unarmed Strike (replaces one attack). Target makes a Str or Dex save (their choice) against DC 8 + your Str mod + your Prof bonus. On failure, target has the Grappled condition. One Grapple Per Hand — the same hand cannot grapple multiple creatures.' },
  { name: 'Shoving',             cat: 'Special Attacks', desc: 'Use an Unarmed Strike (replaces one attack). Target makes a Str or Dex save (their choice) against DC 8 + your Str mod + your Prof bonus. On failure, push the target 5 ft away or knock it Prone. No contested Athletics check.' },
  { name: 'Two-weapon fighting', cat: 'Special Attacks', desc: "When you Attack with a Light weapon, use a bonus action to attack with a second Light weapon in the other hand. Now works with any Light weapon, including ranged. Don't add ability mod to bonus attack damage unless negative." },
  { name: 'Flanking (optional)', cat: 'Special Attacks', desc: 'When you and an ally are on opposite sides of an enemy, you both have advantage on melee attacks against it. DM decides whether to use this rule.' },
]
