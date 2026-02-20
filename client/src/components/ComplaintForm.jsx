import React, { useState } from 'react'
import { saveTask } from '../lib/storage'

function generateTaskId() {
  return 'T-' + Math.floor(1000 + Math.random() * 9000)
}

export default function ComplaintForm({ onClose, onSaved }) {
  const [issue, setIssue] = useState('')
  const [screen, setScreen] = useState('')
  const [when, setWhen] = useState('')
  const [deadline, setDeadline] = useState('')

  function submit(e) {
    e.preventDefault()
    const task = {
      id: generateTaskId(),
      issue,
      screen,
      when,
      deadline,
      priority: 'High',
      status: 'open',
      createdAt: new Date().toISOString()
    }
    saveTask(task)
    if (onSaved) onSaved(task)
    if (onClose) onClose()
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <div className="modal-header">
          <strong>Register Complaint</strong>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="form-grid">
          <label>Describe issue
            <textarea required value={issue} onChange={(e) => setIssue(e.target.value)} />
          </label>
          <label>Screen
            <input required value={screen} onChange={(e) => setScreen(e.target.value)} placeholder="Screen 2" />
          </label>
          <label>When did this happen?
            <input required value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Yesterday evening" />
          </label>
          <label>Preferred fix time
            <input required type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </label>
          <div className="form-actions">
            <div className="muted">Priority: High</div>
            <div>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
