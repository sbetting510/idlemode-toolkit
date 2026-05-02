# ⚔️ IdleMode D&D Toolkit

A free, browser-based **D&D 5th Edition reference and campaign management app** for players and Dungeon Masters. No account required, no ads, no tracking beyond anonymous page analytics.

**Live:** [idlemode-toolkit.vercel.app](https://idlemode-toolkit.vercel.app)

---

## What's Inside

The app is organised into 11 tabs, all currently free:

| Tab | Description |
|---|---|
| **Conditions** | All SRD conditions with mechanical effects |
| **Actions** | Action economy reference (actions, bonus actions, reactions) |
| **Combat Rules** | Key combat rules quick-reference |
| **Saves & DCs** | Saving throw and DC tables |
| **Spells** | Full SRD spell list, filterable by class and level |
| **Class Sheets** | Per-class cheat sheets for all SRD classes |
| **Dice Roller** | In-browser dice roller supporting standard D&D dice |
| **Monsters** | Full monster stat block database; monsters can be added to the Encounter Calculator |
| **Encounter Calculator** | Build and balance encounters by party size and level; XP-based difficulty ratings (Easy → Deadly) |
| **Campaign Manager** | Track characters, sessions, encounters, loot, NPCs, and quests — all stored locally in the browser; expandable DM view cards per character |
| **Character Builder** | 10-step guided character creation wizard (race, class, background, ability scores, skills, spells, equipment, appearance); saves to Campaign Manager with print-to-PDF export |

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 19 |
| **Build tool** | Vite 8 |
| **Analytics** | @vercel/analytics (anonymous, no PII) |
| **Deployment** | Vercel |
| **Styling** | Inline styles + a single global CSS file with CSS custom properties |
| **Storage** | `localStorage` only — no backend, no database |

---

## Project Structure

```
idlemode-toolkit/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Root component — tab router, global state, header/nav
│   ├── styles/
│   │   └── globals.css             # CSS variables, base reset, responsive nav breakpoints
│   ├── context/
│   │   └── VersionContext.jsx      # 2014 / 2024 SRD version toggle (global + per-tab)
│   ├── hooks/
│   │   ├── useLicense.js           # License key validation & localStorage persistence
│   │   └── useCampaign.js          # Campaign CRUD & localStorage persistence
│   ├── data/
│   │   ├── monsters.js             # Full monster stat block dataset
│   │   ├── characterData.js        # Races, classes, backgrounds, features, ability/skill tables
│   │   ├── nameData.js             # Phonetic name pools for all playable races
│   │   └── spellLists.js           # Class-to-spell mappings (2014 & 2024 SRD)
│   └── components/
│       ├── LandingPage.jsx         # First-visit welcome/marketing page
│       ├── ui/
│       │   └── UnlockModal.jsx     # License key entry modal
│       └── tabs/
│           ├── Conditions.jsx
│           ├── Actions.jsx
│           ├── CombatRules.jsx
│           ├── SavesDCs.jsx
│           ├── Spells.jsx
│           ├── ClassSheets.jsx
│           ├── DiceRoller.jsx
│           ├── Monsters.jsx
│           ├── EncounterCalc.jsx
│           ├── CampaignManager.jsx
│           └── CharacterBuilder.jsx  # 10-step character creation wizard
├── eslint.config.js
├── vite.config.js
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Lint
npm run lint

# Production build (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## Design System

All colours and typography are defined as CSS variables in `src/styles/globals.css`.

| Variable | Value | Use |
|---|---|---|
| `--stone` | `#1a1a2e` | Primary background |
| `--stone2` | `#16213e` | Header / nav background |
| `--gold` | `#c9a84c` | Headings, active states, borders |
| `--gold2` | `#e8c96a` | Hover states |
| `--crimson` | `#8b0000` | Accent / CTA buttons |
| `--parch` | `#f5f0e1` | Primary text |
| `--parch2` | `#e8dfc8` | Secondary text |
| `--muted` | `#888888` | Placeholder / metadata text |
| `--border` | `rgba(201,168,76,0.25)` | Subtle borders |
| `--border2` | `rgba(201,168,76,0.5)` | Stronger borders |

**Font:** Georgia / Times New Roman (serif throughout). Responsive layout switches from a tab bar (desktop) to a hamburger dropdown (mobile) at 639px.

---

## SRD Version Toggle

A global **2014 / 2024** toggle in the header (powered by `VersionContext`) lets users switch between the D&D 5e 2014 SRD and the 2024 revised rules. The selected version persists in localStorage under the key `idlemode_versions`. Individual tabs can also maintain a per-tab version override.

---

## License System

The app includes a key-based unlock system (`useLicense` hook, localStorage key `idlemode_license`). License keys are currently hardcoded in `src/hooks/useLicense.js` and sold via Gumroad.

- **Purchase:** [idlemodeco.gumroad.com/l/toolkit](https://idlemodeco.gumroad.com/l/toolkit) — $19.99
- **Dev reset:** `Ctrl+Shift+R` clears the stored license key from localStorage

> **Note:** All 10 tabs are currently set to `paid: false`, so the lock UI is dormant. The unlock flow is in place for future paid features.

---

## Campaign Manager — Data Model

Campaign data is stored in localStorage under `idlemode_campaign` with the following shape:

```js
{
  name: string,
  setting: string,
  createdAt: string | null,
  characters: [],   // see character schema below
  sessions: [],     // { number, title, date, summary, highlights, xpAwarded, goldAwarded }
  encounters: [],   // { name, difficulty, outcome, xp, notes }
  loot: [],         // { name, type, rarity, value, owner, notes }
  npcs: [],         // { name, role, disposition, location, notes }
  quests: [],       // { title, status, priority, givenBy, reward, notes }
}
```

### Character schema

Quick-add characters use the minimal shape `{ name, race, class, level, hp, maxHp, ac, status, notes }`. Characters created via the Character Builder wizard are stored with the full shape:

```js
{
  id: string,                 // UUID assigned on save
  name, playerName,
  level, xp, alignment,
  race, subrace, dragonAncestry,
  class, subclass, background,
  str, dex, con, int, wis, cha,   // ability scores
  scoreMethod,                     // 'standard' | 'pointbuy' | 'manual'
  scoresConfirmed: boolean,
  hp, maxHp, ac, initiative, speed, profBonus, passivePerception,
  inspiration: boolean,
  savingThrows: string[],          // ability keys with class proficiency
  skillProfs: string[],            // proficient skill names
  toolProfs: string[],
  languages: string[],
  features: string[],
  racialTraits: string[],
  spellcastingAbility: string,
  spellSlots: number[],            // indexed by spell level (1–9)
  cantrips: string[],
  spells: string[],
  equipment: string[],
  cp, sp, ep, gp, pp,              // currency
  age, height, weight, eyes, hair, skin, appearance,
  personalityTrait, ideal, bond, flaw, backstory,
  status: 'Active' | 'Inactive' | 'Dead' | 'Retired',
  notes: string,
  createdAt: number,               // Date.now()
  updatedAt: number,
}
```

Builder characters display expanded stat cards in Campaign Manager, including saving throws, skills, spell slots, inline HP editing, and a print-to-PDF option. Quick-add characters display a simpler card. Both types coexist in the same `characters` array.

Data is device/browser-local only. Users should be advised to export important notes elsewhere for safekeeping.

---

## Deployment

The app deploys automatically to Vercel on push to `main`. No environment variables are required — everything runs client-side.

---

## Legal

This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") and System Reference Document 5.2 ("SRD 5.2") by Wizards of the Coast LLC, available at [dndbeyond.com/srd](https://www.dndbeyond.com/srd). The SRD 5.1 and SRD 5.2 are licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).

IdleModeCo D&D Toolkit is not affiliated with or endorsed by Wizards of the Coast.

---

## Links

- **Live app:** [idlemode-toolkit.vercel.app](https://idlemode-toolkit.vercel.app)
- **Etsy shop:** [etsy.com/shop/IdleModeCo](https://www.etsy.com/shop/IdleModeCo)
- **Ko-fi:** [ko-fi.com/idlemode](https://ko-fi.com/idlemode)
- **Contact:** shopidlemode@gmail.com
