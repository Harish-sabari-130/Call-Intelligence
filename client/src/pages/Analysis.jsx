import React from 'react'

export default function Analysis() {
  return (
    <div className="page">
      <h2>Call Analysis</h2>
      <div className="card">
        <p className="muted">Overview of recent calls, intents, sentiment, and common issues.</p>
        <ul>
          <li>Bookings: 24 (today)</li>
          <li>Complaints: 3</li>
          <li>Top issue: AC / Cleanliness</li>
        </ul>
      </div>
    </div>
  )
}
