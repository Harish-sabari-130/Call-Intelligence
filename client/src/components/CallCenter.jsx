import React, { useState, useEffect } from 'react'
import { detectIntent, botFlows, getNextPrompt, getStepName } from '../lib/bot'
import { startSpeechRecognition, speak, stopSpeech } from '../lib/speech'
import { saveBooking, saveTask } from '../lib/storage'

function generateId(prefix) {
  return prefix + Math.floor(10000 + Math.random() * 90000)
}

export default function CallCenter() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [currentIntent, setCurrentIntent] = useState(null)
  const [callHistory, setCallHistory] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [formData, setFormData] = useState({})

  // Start incoming call
  function handleIncomingCall() {
    setIsCallActive(true)
    setCurrentIntent('greeting')
    setCallHistory([])
    setFormData({})
    setStepIndex(0)
    setTranscript('')
    
    const greeting = botFlows.greeting[0]
    addToHistory('bot', greeting)
    speak(greeting)
    setIsSpeaking(true)
  }

  // End call
  function handleEndCall() {
    stopSpeech()
    setIsCallActive(false)
    setCurrentIntent(null)
    setIsListening(false)
  }

  // Handle user speech input
  function handleListen() {
    if (isListening) return
    
    setIsListening(true)
    const recognition = startSpeechRecognition(
      (result) => {
        setTranscript(result)
        setIsListening(false)
        processUserInput(result)
      },
      (error) => {
        console.error(error)
        setIsListening(false)
      }
    )
  }

  // Manual text input (for testing)
  function handleTextInput(e) {
    if (e.key === 'Enter' && transcript.trim()) {
      setIsListening(false)
      processUserInput(transcript)
      setTranscript('')
    }
  }

  // Process user input and continue dialogue
  function processUserInput(input) {
    addToHistory('user', input)
    
    if (currentIntent === 'greeting') {
      const intent = detectIntent(input)
      setCurrentIntent(intent)
      setStepIndex(0)
      setFormData({})
      
      if (intent === 'booking') {
        const prompt = getNextPrompt(botFlows.booking, 0)
        addToHistory('bot', prompt)
        speak(prompt)
      } else if (intent === 'complaint') {
        const prompt = getNextPrompt(botFlows.complaint, 0)
        addToHistory('bot', prompt)
        speak(prompt)
      } else if (intent === 'enquiry') {
        const response =
          'We are showing Leo (10 AM, 2 PM, 6 PM) and Avatar (11 AM, 3:30 PM, 7:30 PM). ' +
          'Price: ₹150 per ticket. Location: Downtown. Facilities: AC, Parking, Food Court.'
        addToHistory('bot', response)
        speak(response)
      }
      return
    }
    
    // Handle booking flow
    if (currentIntent === 'booking') {
      const flow = botFlows.booking
      const currentStep = getStepName(flow, stepIndex)
      
      setFormData((prev) => ({ ...prev, [currentStep]: input }))
      
      if (stepIndex < flow.steps.length - 2) {
        const nextPrompt = getNextPrompt(flow, stepIndex + 1)
        addToHistory('bot', nextPrompt)
        speak(nextPrompt)
        setStepIndex(stepIndex + 1)
      } else if (stepIndex === flow.steps.length - 2) {
        // Confirm booking
        const confirm = input.toLowerCase().includes('yes')
        if (confirm) {
          const booking = {
            id: generateId('TH'),
            movie: formData.movie || input,
            date: formData.date || 'Today',
            time: formData.time || 'Evening',
            seats: parseInt(formData.seats) || 1,
            total: (parseInt(formData.seats) || 1) * 150,
            createdAt: new Date().toISOString()
          }
          saveBooking(booking)
          
          const response = `Booking confirmed! Your booking ID is ${booking.id}.`
          addToHistory('bot', response)
          speak(response)
          
          setTimeout(() => {
            handleEndCall()
          }, 2000)
        } else {
          const response = 'Booking cancelled. Thank you for calling Sunset Cinemas!'
          addToHistory('bot', response)
          speak(response)
          setTimeout(() => handleEndCall(), 2000)
        }
      }
      return
    }
    
    // Handle complaint flow
    if (currentIntent === 'complaint') {
      const flow = botFlows.complaint
      const currentStep = getStepName(flow, stepIndex)
      
      setFormData((prev) => ({ ...prev, [currentStep]: input }))
      
      if (stepIndex < flow.steps.length - 2) {
        const nextPrompt = getNextPrompt(flow, stepIndex + 1)
        addToHistory('bot', nextPrompt)
        speak(nextPrompt)
        setStepIndex(stepIndex + 1)
      } else if (stepIndex === flow.steps.length - 2) {
        // Final confirmation
        const task = {
          id: generateId('T-'),
          issue: formData.issue || 'Issue',
          screen: formData.screen || 'General',
          when: formData.when || 'Earlier',
          deadline: input,
          priority: 'High',
          status: 'open',
          createdAt: new Date().toISOString()
        }
        saveTask(task)
        
        const response = `Thank you. Your complaint has been registered. Our team will resolve it by ${input}. Task ID: ${task.id}`
        addToHistory('bot', response)
        speak(response)
        
        setTimeout(() => {
          handleEndCall()
        }, 2000)
      }
    }
  }

  function addToHistory(speaker, text) {
    setCallHistory((prev) => [...prev, { speaker, text, id: Date.now() }])
  }

  return (
    <div className="call-center">
      <div className="call-container">
        <div className="call-status">
          {isCallActive ? (
            <div className="status-active">
              <div className="pulse"></div> Call Active
            </div>
          ) : (
            <div className="status-idle">Idle</div>
          )}
        </div>

        <div className="call-transcript">
          <div className="transcript-label">Transcript</div>
          {callHistory.map((msg) => (
            <div key={msg.id} className={`msg msg-${msg.speaker}`}>
              <span className="speaker-label">{msg.speaker === 'bot' ? 'Bot' : 'Customer'}:</span>
              <span className="msg-text">{msg.text}</span>
            </div>
          ))}
        </div>

        {isCallActive && (
          <div className="call-controls">
            <div className="input-group">
              <input
                type="text"
                placeholder="Type or speak..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyPress={handleTextInput}
                className="call-input"
              />
              <button onClick={handleListen} disabled={isListening} className="btn-listen">
                {isListening ? '🎤 Listening...' : '🎤 Speak'}
              </button>
            </div>
            <button onClick={handleEndCall} className="btn-end-call">
              End Call
            </button>
          </div>
        )}

        {!isCallActive && (
          <button onClick={handleIncomingCall} className="btn-incoming-call">
            ☎️ Simulate Incoming Call
          </button>
        )}
      </div>
    </div>
  )
}
