import React, { useEffect, useState } from 'react'
import { getTasks, updateTaskStatus } from '../lib/storage'

export default function Schedule() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    setTasks(getTasks())
  }, [])

  function markDone(id) {
    updateTaskStatus(id, 'completed')
    setTasks(getTasks())
  }

  return (
    <div className="page">
      <h2>Schedule / Tasks</h2>
      <div className="card-list">
        {tasks.length === 0 && <div className="card muted">No scheduled tasks.</div>}
        {tasks.map((t) => (
          <div key={t.id} className="task-card">
            <div className="task-title">{t.issue} — {t.screen}</div>
            <div className="task-meta">Deadline: {t.deadline} • Priority: {t.priority}</div>
            <div style={{marginTop:8}}>
              {t.status !== 'completed' ? (
                <button className="btn" onClick={() => markDone(t.id)}>Mark completed</button>
              ) : (
                <span className="muted">Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
