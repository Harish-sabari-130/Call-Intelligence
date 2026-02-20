// Simple intent detection based on keywords
export function detectIntent(text) {
  const lower = text.toLowerCase()
  
  if (
    lower.includes('book') ||
    lower.includes('ticket') ||
    lower.includes('watch') ||
    lower.includes('movie')
  ) {
    return 'booking'
  }
  
  if (
    lower.includes('ac') ||
    lower.includes('broken') ||
    lower.includes('dirty') ||
    lower.includes('not working') ||
    lower.includes('issue') ||
    lower.includes('problem') ||
    lower.includes('complain')
  ) {
    return 'complaint'
  }
  
  if (
    lower.includes('running') ||
    lower.includes('showing') ||
    lower.includes('movie') ||
    lower.includes('timing') ||
    lower.includes('price') ||
    lower.includes('location') ||
    lower.includes('parking') ||
    lower.includes('food') ||
    lower.includes('facilities')
  ) {
    return 'enquiry'
  }
  
  return 'greeting'
}

// Bot responses and dialogue steps
export const botFlows = {
  greeting: [
    'Welcome to Sunset Cinemas! How may I help you today?',
    'You can book a ticket, ask about movies, or report an issue.'
  ],
  
  booking: {
    steps: [
      { step: 'movie', prompt: 'Which movie would you like to watch?' },
      { step: 'date', prompt: 'What date would you prefer?' },
      { step: 'time', prompt: 'What show time?' },
      { step: 'seats', prompt: 'How many tickets?' },
      { step: 'confirm', prompt: 'Confirm your booking?' }
    ],
    confirm: (data) =>
      `Your total is ₹${data.seats * 150}. Confirmed! Your booking ID is ${generateId('TH')}.`
  },
  
  complaint: {
    steps: [
      { step: 'issue', prompt: 'Please describe your issue.' },
      { step: 'screen', prompt: 'Which screen or area?' },
      { step: 'when', prompt: 'When did this happen?' },
      { step: 'deadline', prompt: 'When should we fix this?' },
      { step: 'confirm', prompt: 'Thank you. Your complaint is registered.' }
    ]
  },
  
  enquiry: {
    movies: [
      { name: 'Leo', times: ['10:00 AM', '2:00 PM', '6:00 PM'] },
      { name: 'Avatar', times: ['11:00 AM', '3:30 PM', '7:30 PM'] }
    ],
    price: '₹150 per ticket',
    location: 'Downtown, Near Central Mall',
    facilities: 'AC, Parking, Food Court, Clean Screens'
  }
}

function generateId(prefix) {
  return prefix + Math.floor(10000 + Math.random() * 90000)
}

export function getNextPrompt(flow, stepIndex) {
  if (flow && flow.steps && flow.steps[stepIndex]) {
    return flow.steps[stepIndex].prompt
  }
  return ''
}

export function getStepName(flow, stepIndex) {
  if (flow && flow.steps && flow.steps[stepIndex]) {
    return flow.steps[stepIndex].step
  }
  return ''
}
