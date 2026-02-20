import React, { useEffect, useState } from 'react'
import { getTasks } from '../lib/storage'

export default function Complete() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    setTasks(getTasks().filter((t) => t.status === 'completed'))
  }, [])

  return (
    <div className="page">
      <h2>Completed Tasks</h2>
      <div className="card">
        <p className="muted">All resolved complaints and finished jobs.</p>
        <ul>
          {tasks.length === 0 && <li className="muted">No completed tasks yet.</li>}
          {tasks.map((t) => (
            <li key={t.id}>{t.issue} — {t.screen} — Completed</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
