import { useState } from 'react'

const FAQ = [
  {
    q: 'How do I start tracking a campaign?',
    a: 'Open the Campaign Manager tab and use the Character Builder to create your party members. Each character saves automatically and appears in the Campaign Manager where you can track HP, conditions, spell slots, XP, and more.',
  },
  {
    q: 'How does the Initiative Tracker work?',
    a: 'Go to the Encounter Calc tab, add monsters to your encounter, then click "Track Combat." Your active campaign characters are added automatically. Set initiative for each combatant, click "Start Combat," and use the tracker to manage turns, HP, and conditions. Combat state is saved if you switch tabs mid-fight.',
  },
  {
    q: 'Can I run the Encounter Calc from inside the Campaign Manager?',
    a: 'Yes — open the Campaign Manager, select any campaign, and navigate to the Combat module. It embeds the full Encounter Calculator and Initiative Tracker with your active party pre-loaded.',
  },
  {
    q: 'How do the Generators work?',
    a: 'Open the Generators tab. Pick a category — names, taverns, towns, NPCs, quests, or loot — and hit Generate. Results are editable inline. NPCs, quests, and loot items can be saved directly to your Campaign Manager with one click.',
  },
  {
    q: 'Will I lose my campaign data if I close the browser?',
    a: 'No — your data is stored in your browser\'s local storage and persists between sessions. It is tied to this specific browser on this device, so switching browsers or clearing site data will erase it. Use the Export button in the Campaign Manager to back up your data.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes, the toolkit is fully responsive and works on phones and tablets. The Initiative Tracker and Campaign Manager are especially useful at the table on a tablet.',
  },
  {
    q: 'Which edition of D&D does it support?',
    a: 'Both the 2014 SRD (5th Edition) and 2024 SRD (5.2 / "One D&D"). Use the edition toggle at the top of the app to switch between them. Spell and monster data updates to match.',
  },
]

function Accordion({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${open === i ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
            borderRadius: 8,
            overflow: 'hidden',
            transition: 'border-color 0.15s',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '0.9rem 1.1rem', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--parch)', lineHeight: 1.4 }}>
              {item.q}
            </span>
            <span style={{ fontSize: 18, color: 'var(--gold)', flexShrink: 0, lineHeight: 1 }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <div style={{ padding: '0 1.1rem 1rem', fontSize: 13, color: 'var(--parch2)', lineHeight: 1.7 }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function LandingPage({ onEnter }) {
  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '1.25rem',
  }

  const sectionTitle = {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'var(--gold)',
    letterSpacing: '0.04em',
    marginBottom: '1rem',
  }

  const FreeBadge = () => (
    <span style={{
      background: 'rgba(30,100,30,0.3)', color: '#90c870',
      border: '1px solid rgba(30,100,30,0.5)',
      borderRadius: 3, fontSize: 9, fontFamily: 'sans-serif',
      padding: '1px 5px', marginLeft: 6, verticalAlign: 'middle', fontWeight: 'bold',
    }}>FREE</span>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--stone)', padding: '2rem 1.25rem 3rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', padding: '3rem 0 2.5rem' }}>
          <div style={{
            width: 64, height: 64,
            background: 'var(--crimson)',
            border: '2px solid var(--gold)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, margin: '0 auto 1.25rem',
          }}>⚔</div>

          <h1 style={{
            fontSize: 36, fontWeight: 'bold', color: 'var(--gold)',
            letterSpacing: '0.04em', margin: '0 0 0.5rem',
          }}>D&D Toolkit</h1>

          <p style={{
            fontSize: 15, color: 'var(--parch2)', fontStyle: 'italic',
            margin: '0 0 2rem', opacity: 0.85,
          }}>Free 5th Edition Reference — 2014 &amp; 2024 SRD</p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onEnter}
              style={{
                background: 'var(--crimson)',
                border: '1px solid var(--gold)',
                borderRadius: 6,
                color: 'var(--parch)',
                fontFamily: 'Georgia, serif',
                fontSize: 14,
                padding: '10px 24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '0.03em',
              }}
            >Enter the Toolkit</button>

            <a
              href="https://www.etsy.com/shop/IdleModeCo"
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'transparent',
                border: '1px solid var(--border2)',
                borderRadius: 6,
                color: 'var(--parch2)',
                fontFamily: 'Georgia, serif',
                fontSize: 14,
                padding: '10px 24px',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                lineHeight: 1.4,
              }}
            >Browse on Etsy</a>
          </div>
        </div>

        {/* ── Features ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ ...sectionTitle, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
            What&rsquo;s inside
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            <div style={cardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>📖</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 6 }}>
                Reference Tools<FreeBadge />
              </div>
              <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
                Conditions, Actions, Combat Rules, Saves &amp; DCs, Spells,
                Class Sheets, Dice Roller, and Monsters — all free, forever.
                Supports both 2014 and 2024 SRD rules with a single toggle.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>⚔</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 6 }}>
                Encounter Calculator<FreeBadge />
              </div>
              <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
                Build and balance encounters for your party. Add monsters,
                set party size and level, and get instant XP-based difficulty
                ratings. Launch the Initiative Tracker directly from any encounter.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>⚡</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 6 }}>
                Initiative Tracker<FreeBadge />
              </div>
              <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
                Run combat round-by-round with full HP tracking, a built-in dice
                roller, and turn order management. Your active party populates
                automatically. Combat state is saved if you switch tabs mid-fight.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 6 }}>
                Campaign Manager<FreeBadge />
              </div>
              <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
                Track your entire campaign — characters, sessions, encounters,
                loot, NPCs, and quests. Full DM panel per character with spell
                slots, conditions, death saves, and a per-character journal.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>🧙</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 6 }}>
                Character Builder<FreeBadge />
              </div>
              <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
                Build a full 5e character in 10 guided steps — race, class,
                background, ability scores (Standard Array, Point Buy, or Manual),
                skills, spells, equipment, and appearance. Print-to-PDF export included.
              </p>
            </div>

            <div style={cardStyle}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>🎲</div>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 6 }}>
                Generators<FreeBadge />
              </div>
              <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
                Instantly generate names (60,000+ combos), tavern names, towns,
                detailed NPCs, quest hooks, and loot. Results are editable and
                can be saved directly to your campaign with one click.
              </p>
            </div>
          </div>
        </div>

        {/* ── How To ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ ...sectionTitle, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
            How to use it
          </div>
          <Accordion items={FAQ} />
        </div>

        {/* ── Storage Notice ── */}
        <div style={{
          background: 'rgba(180,120,0,0.12)',
          border: '1px solid rgba(180,120,0,0.4)',
          borderRadius: 8,
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>⚠</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#f5c842', marginBottom: 4 }}>
              About your campaign data
            </div>
            <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: 0 }}>
              The Campaign Manager saves your data directly in this browser using local storage.
              This means your data stays private and works offline — but it is tied to this browser
              on this device. Clearing your browser data or switching browsers will erase your
              campaign. Use the Export button in the Campaign Manager to back up your data.
            </p>
          </div>
        </div>

        {/* ── Etsy Section ── */}
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          padding: '2rem 1.5rem',
          marginBottom: '2.5rem',
          borderColor: 'rgba(201,168,76,0.25)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--gold)', marginBottom: 8 }}>
            Want something you can take offline?
          </div>
          <p style={{ fontSize: 13, color: 'var(--parch2)', lineHeight: 1.6, margin: '0 0 1.25rem', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Our D&D Google Sheets toolkit on Etsy gives you the same reference power
            in a portable spreadsheet format — no internet required at the table.
          </p>
          <a
            href="https://www.etsy.com/shop/IdleModeCo"
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid var(--gold)',
              borderRadius: 6,
              color: 'var(--gold)',
              fontFamily: 'Georgia, serif',
              fontSize: 13,
              padding: '8px 20px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >Shop the toolkit on Etsy →</a>
        </div>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'sans-serif', lineHeight: 1.6, marginBottom: 8 }}>
            This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") and System Reference Document 5.2 ("SRD 5.2") by Wizards of the Coast LLC, available at{' '}
            <a href="https://www.dndbeyond.com/srd" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>
              dndbeyond.com/srd
            </a>
            . The SRD 5.1 and SRD 5.2 are licensed under the{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>
              Creative Commons Attribution 4.0 International License
            </a>
            . IdleModeCo D&D Toolkit is not affiliated with or endorsed by Wizards of the Coast.
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>
            Already been here before?{' '}
            <button
              onClick={onEnter}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: 'var(--gold)', fontFamily: 'sans-serif', fontSize: 12,
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >Skip to the toolkit →</button>
          </p>
        </footer>

      </div>
    </div>
  )
}
