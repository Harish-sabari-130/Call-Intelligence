// Speech recognition and synthesis helpers

export function startSpeechRecognition(callback, errorCallback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
  if (!SpeechRecognition) {
    errorCallback('Speech Recognition not supported in this browser')
    return null
  }
  
  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = 'en-US'
  
  recognition.onstart = () => {
    console.log('Listening...')
  }
  
  recognition.onresult = (event) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }
    callback(transcript)
  }
  
  recognition.onerror = (event) => {
    errorCallback(`Speech error: ${event.error}`)
  }
  
  recognition.onend = () => {
    console.log('Stopped listening')
  }
  
  recognition.start()
  return recognition
}

export function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1.0
  utterance.pitch = 1.0
  utterance.volume = 1.0
  window.speechSynthesis.speak(utterance)
}

export function stopSpeech() {
  window.speechSynthesis.cancel()
}
