const BOOKING_KEY = 'theatre_bookings'
const TASK_KEY = 'theatre_tasks'

function read(key) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : []
  } catch (e) {
    return []
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getBookings() {
  return read(BOOKING_KEY)
}

export function saveBooking(b) {
  const list = read(BOOKING_KEY)
  list.unshift(b)
  write(BOOKING_KEY, list)
}

export function getTasks() {
  return read(TASK_KEY)
}

export function saveTask(t) {
  const list = read(TASK_KEY)
  list.unshift(t)
  write(TASK_KEY, list)
}

export function updateTaskStatus(id, status) {
  const list = read(TASK_KEY).map((t) => (t.id === id ? { ...t, status } : t))
  write(TASK_KEY, list)
}
