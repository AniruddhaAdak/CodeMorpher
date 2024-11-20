'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Mic, Upload, Copy, Download, Wand2 } from 'lucide-react'
import confetti from 'canvas-confetti'

const API_KEY = '5b1fd20849da4dd3b981ca0f1a175209'

const supportedFormats = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/flac',
  'audio/ogg',
  'audio/webm'
]

export default function VoiceVista() {
  const [file, setFile] = useState(null)
  const [transcribing, setTranscribing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [transcriptionResult, setTranscriptionResult] = useState('')
  const [enhancedResult, setEnhancedResult] = useState('')
  const [showEnhanced, setShowEnhanced] = useState(false)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e) => {
      e.preventDefault()
      dropZone.classList.add('border-primary', 'bg-primary/10')
    }

    const handleDragLeave = () => {
      dropZone.classList.remove('border-primary', 'bg-primary/10')
    }

    const handleDrop = (e) => {
      e.preventDefault()
      dropZone.classList.remove('border-primary', 'bg-primary/10')
      const files = e.dataTransfer.files
      if (files.length) {
        const file = files[0]
        if (validateFile(file)) {
          setFile(file)
        }
      }
    }

    dropZone.addEventListener('dragover', handleDragOver)
    dropZone.addEventListener('dragleave', handleDragLeave)
    dropZone.addEventListener('drop', handleDrop)

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver)
      dropZone.removeEventListener('dragleave', handleDragLeave)
      dropZone.removeEventListener('drop', handleDrop)
    }
  }, [])

  const validateFile = (file) => {
    if (supportedFormats.includes(file.type)) {
      return true
    } else {
      alert('Unsupported file format. Please upload an audio file in MP3, WAV, M4A, FLAC, OGG, or WEBM format.')
      return false
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && validateFile(file)) {
      setFile(file)
    }
  }

  const updateProgress = (percent, message) => {
    setProgress(percent)
    setProgressText(message)
  }

  const transcribeAudio = async () => {
    if (!file) {
      alert('Please select an audio file.')
      return
    }

    setTranscribing(true)
    setProgress(0)
    setProgressText('Preparing for transcription...')

    try {
      const formData = new FormData()
      formData.append('audio', file)

      updateProgress(10, 'Uploading audio file...')
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'authorization': API_KEY
        },
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload the audio file.')
      }

      const uploadData = await uploadResponse.json()
      const uploadUrl = uploadData.upload_url

      updateProgress(40, 'Audio file uploaded. Sending for transcription...')
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'authorization': API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ audio_url: uploadUrl })
      })

      if (!transcriptResponse.ok) {
        throw new Error('Failed to create the transcription request.')
      }

      const transcriptData = await transcriptResponse.json()
      const transcriptId = transcriptData.id

      updateProgress(60, 'Transcription in progress...')
      let status = 'queued'
      while (status !== 'completed' && status !== 'error') {
        await new Promise(r => setTimeout(r, 3000))
        const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          method: 'GET',
          headers: {
            'authorization': API_KEY
          }
        })

        if (!statusResponse.ok) {
          throw new Error('Failed to check the transcription status.')
        }

        const statusData = await statusResponse.json()
        status = statusData.status

        if (status === 'completed') {
          updateProgress(100, 'Transcription completed!')
          setTranscriptionResult(statusData.text)
          setTranscribing(false)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        } else if (status === 'error') {
          throw new Error('An error occurred during transcription.')
        } else {
          const progressPercent = status === 'processing' ? 70 : 50
          updateProgress(progressPercent, 'Transcription in progress...')
        }
      }
    } catch (error) {
      console.error(error)
      alert(error.message)
      setTranscribing(false)
    }
  }

  const enhanceTranscription = async () => {
    setProgressText('Enhancing transcription...')
    setProgress(0)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY' // Replace with your actual OpenAI API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that improves transcriptions by fixing grammar, punctuation, and formatting."
            },
            {
              role: "user",
              content: `Please enhance the following transcription: ${transcriptionResult}`
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to enhance the transcription.')
      }

      const data = await response.json()
      setEnhancedResult(data.choices[0].message.content)
      setShowEnhanced(true)
      setProgress(100)
      setProgressText('Transcription enhanced!')
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!')
    }).catch(err => {
      console.error('Copy error:', err)
      alert('Failed to copy text.')
    })
  }

  const downloadTranscription = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 px-4 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">VoiceVista</h1>
        <p className="text-xl">Unveil the power of your voice with AI-driven transcription and enhancement</p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
          <div
            ref={dropZoneRef}
            className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.flac,.ogg,.webm"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-xl mb-2">{file ? file.name : 'Drag and drop your audio file here or click to select'}</p>
            <p className="text-sm text-gray-500">Accepted formats: MP3, WAV, M4A, FLAC, OGG, WEBM</p>
          </div>
          <Button
            onClick={transcribeAudio}
            disabled={!file || transcribing}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {transcribing ? 'Transcribing...' : 'Transcribe'}
            <Mic className="ml-2" />
          </Button>
        </div>

        {transcribing && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-pulse">
            <Progress value={progress} className="mb-4" />
            <p className="text-center text-gray-600">{progressText}</p>
          </div>
        )}

        {transcriptionResult && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Transcription Result</h2>
            <pre className="bg-gray-100 p-4 rounded-lg mb-4 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {showEnhanced ? enhancedResult : transcriptionResult}
            </pre>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => copyToClipboard(showEnhanced ? enhancedResult : transcriptionResult)} className="flex-1">
                Copy Text
                <Copy className="ml-2" />
              </Button>
              <Button onClick={() => downloadTranscription(showEnhanced ? enhancedResult : transcriptionResult, 'transcription.txt')} className="flex-1">
                Download
                <Download className="ml-2" />
              </Button>
              <Button onClick={enhanceTranscription} className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                {showEnhanced ? 'Show Original' : 'Enhance'}
                <Wand2 className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white py-4 text-center">
        <p className="text-gray-600">Developed with ❤️ by VoiceVista Team</p>
      </footer>
    </div>
  )
}
