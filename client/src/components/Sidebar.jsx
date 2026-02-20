import React from 'react'

const items = [
  { id: 'call', label: 'Call' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'progress', label: 'Progress' },
  { id: 'complete', label: 'Complete' },
  { id: 'settings', label: 'Settings' }
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Owner Panel</div>
      <nav className="nav-list">
        {items.map((it) => (
          <button
            key={it.id}
            className={`nav-item ${active === it.id ? 'active' : ''}`}
            onClick={() => onNavigate(it.id)}
          >
            <span className="nav-label">{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">v0.1</div>
    </aside>
  )
}
