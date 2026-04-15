import { useVersion } from '../../context/VersionContext'

/**
 * Per-tab version badge.
 *
 * Props:
 *   tabId  — the tab identifier (e.g. 'conditions')
 *
 * Behaviour:
 *   - Shows the effective version for this tab (override → global fallback)
 *   - Clicking toggles between 2014 and 2024 for this tab only
 *   - Gold border + accent when the tab has an active override
 *   - Muted style when simply reflecting the global version
 */
export default function VersionBadge({ tabId }) {
  const { globalVersion, getTabVersion, setTabVersion } = useVersion()

  const effective  = getTabVersion(tabId)
  const isOverride = effective !== globalVersion
  const other      = effective === '2014' ? '2024' : '2014'

  const tooltip = isOverride
    ? `This tab is pinned to ${effective} rules (global: ${globalVersion}) — click to switch to ${other}`
    : `Using ${effective} rules (global) — click to override for this tab only`

  function handleClick() {
    setTabVersion(tabId, other)
  }

  return (
    <button
      onClick={handleClick}
      title={tooltip}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px',
        background: isOverride ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)',
        border: isOverride
          ? '1px solid var(--gold)'
          : '1px solid var(--border2)',
        borderRadius: 4,
        color: isOverride ? 'var(--gold)' : 'var(--muted)',
        fontFamily: 'sans-serif', fontSize: 11, fontWeight: isOverride ? 'bold' : 'normal',
        letterSpacing: '0.03em',
        cursor: 'pointer',
        verticalAlign: 'middle',
        lineHeight: 1.6,
      }}
    >
      {effective}
      <span style={{ fontSize: 10, opacity: 0.8 }}>⇄</span>
    </button>
  )
}
