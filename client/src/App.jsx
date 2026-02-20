import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import CallInteraction from './pages/CallInteraction'
import Transcript from './pages/Transcript'
import Analysis from './pages/Analysis'
import Schedule from './pages/Schedule'
import Progress from './pages/Progress'
import Complete from './pages/Complete'
import Settings from './pages/Settings'

export default function App() {
  const [page, setPage] = useState('call')

  const renderPage = () => {
    switch (page) {
      case 'call':
        return <CallInteraction />
      case 'transcript':
        return <Transcript />
      case 'analysis':
        return <Analysis />
      case 'schedule':
        return <Schedule />
      case 'progress':
        return <Progress />
      case 'complete':
        return <Complete />
      case 'settings':
        return <Settings />
      default:
        return <CallInteraction />
    }
  }

  return (
    <div className="app-root">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="main-area">
        <header className="topbar">
          <div className="theatre-name">Sunset Cinemas — Owner Dashboard</div>
          <div className="topbar-right">
            <button className="btn-notifications" title="Notifications">
              <span className="bell-icon">🔔</span>
              <span className="badge">3</span>
            </button>
            <button className="profile-button" title="Owner Profile">
              <div className="profile-avatar">👤</div>
            </button>
          </div>
        </header>
        <section className="content-area">{renderPage()}</section>
      </main>
    </div>
  )
}
