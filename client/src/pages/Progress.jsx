import React, { useEffect, useState } from 'react'
import { getTasks } from '../lib/storage'

export default function Progress() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    setTasks(getTasks().filter((t) => t.status === 'open' || t.status === 'in-progress'))
  }, [])

  return (
    <div className="page">
      <h2>In Progress</h2>
      <div className="card">
        <p className="muted">Shows tasks currently being worked on by staff.</p>
        <ul>
          {tasks.length === 0 && <li className="muted">No active tasks.</li>}
          {tasks.map((t) => (
            <li key={t.id}>{t.issue} - {t.screen} — {t.status}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
