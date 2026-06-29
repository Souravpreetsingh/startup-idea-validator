export const voiceService = {
  async startListening(): Promise<string> {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported in this browser')
    }

    return new Promise((resolve, reject) => {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event: any) => {
        resolve(event.results[0][0].transcript)
      }

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      recognition.onend = () => {
        reject(new Error('Speech recognition ended unexpectedly'))
      }

      recognition.start()
    })
  },

  stopListening(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.abort()
    }
  },

  speakResponse(text: string, onEnd?: () => void): void {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Female'))
    if (preferred) utterance.voice = preferred

    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  },

  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  },
}
