import React, { useState } from 'react'
import { saveBooking } from '../lib/storage'

function generateId() {
  return 'TH' + Math.floor(10000 + Math.random() * 90000)
}

export default function BookingForm({ onClose, onSaved }) {
  const [movie, setMovie] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [seats, setSeats] = useState(1)
  const pricePerSeat = 150

  const total = seats * pricePerSeat

  function submit(e) {
    e.preventDefault()
    const booking = {
      id: generateId(),
      movie,
      date,
      time,
      seats: Number(seats),
      total,
      createdAt: new Date().toISOString()
    }
    saveBooking(booking)
    if (onSaved) onSaved(booking)
    if (onClose) onClose()
  }

  return (
    <div className="modal">
      <div className="modal-card">
        <div className="modal-header">
          <strong>Book Tickets</strong>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} className="form-grid">
          <label>Movie name
            <input required value={movie} onChange={(e) => setMovie(e.target.value)} />
          </label>
          <label>Date
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>Show time
            <input required placeholder="6:00 PM" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label>Number of seats
            <input required type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} />
          </label>
          <div className="form-actions">
            <div className="muted">Total: ₹{total}</div>
            <div>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn primary">Confirm</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
