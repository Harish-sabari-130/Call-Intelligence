import React from 'react'

export default function Settings() {
  return (
    <div className="page">
      <h2>Settings</h2>
      <div className="card">
        <label className="setting-row">Theatre Name
          <input placeholder="Sunset Cinemas" />
        </label>
        <label className="setting-row">Notification Phone
          <input placeholder="+91-XXXXXXXXXX" />
        </label>
      </div>
    </div>
  )
}
