import React, { useState, useEffect } from 'react'
import BookingForm from '../components/BookingForm'
import ComplaintForm from '../components/ComplaintForm'
import { getBookings } from '../lib/storage'

const sampleCalls = [
  {
    id: 'TH-1001',
    customer: 'Rahul',
    intent: 'booking',
    snippet: 'I want to book 3 tickets for Leo at 6 PM.'
  },
  {
    id: 'TH-1002',
    customer: 'Sofia',
    intent: 'complaint',
    snippet: 'AC was not working in Screen 2 yesterday.'
  }
]

export default function Transcript() {
  const [showBooking, setShowBooking] = useState(false)
  const [showComplaint, setShowComplaint] = useState(false)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    setBookings(getBookings())
  }, [])

  function handleSaved() {
    setBookings(getBookings())
  }

  return (
    <div className="page">
      <h2>Live Transcripts</h2>
      <div className="card-list">
        <div className="call-list">
          {sampleCalls.map((c) => (
            <div key={c.id} className="call-item">
              <div className="call-meta">
                <strong>{c.customer}</strong>
                <span className="muted">{c.id}</span>
                <span className="tag">{c.intent}</span>
              </div>
              <div className="call-snippet">{c.snippet}</div>
              <div style={{marginTop:8}}>
                {c.intent === 'booking' && <button className="btn" onClick={() => setShowBooking(true)}>Create Booking</button>}
                {c.intent === 'complaint' && <button className="btn" onClick={() => setShowComplaint(true)}>Register Complaint</button>}
              </div>
            </div>
          ))}
        </div>

        <div className="transcript-panel">
          <div className="panel-header">Recent Bookings</div>
          <div className="transcript-body muted">
            {bookings.length === 0 ? (
              <div>No bookings yet. Create one from the call list.</div>
            ) : (
              <ul>
                {bookings.map((b) => (
                  <li key={b.id}>{b.id} — {b.movie} • {b.date} • {b.time} • {b.seats} seats • ₹{b.total}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showBooking && <BookingForm onClose={() => setShowBooking(false)} onSaved={handleSaved} />}
      {showComplaint && <ComplaintForm onClose={() => setShowComplaint(false)} onSaved={handleSaved} />}
    </div>
  )
}
