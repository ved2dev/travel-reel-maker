'use client'

import { useState } from 'react'
import FileUpload from './components/FileUpload'
import ProcessingStatus from './components/ProcessingStatus'
import ReelPreview from './components/ReelPreview'

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [completedReelUrl, setCompletedReelUrl] = useState<string | null>(null)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Travel Reel Maker
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Upload your travel photos and videos to create an amazing 30-60 second reel
        </p>

        {!completedReelUrl && (
          <FileUpload
            onFilesUploaded={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            onStartProcessing={() => setIsProcessing(true)}
            onProcessingComplete={setCompletedReelUrl}
            onProgressUpdate={setProcessingProgress}
          />
        )}

        {isProcessing && (
          <ProcessingStatus progress={processingProgress} />
        )}

        {completedReelUrl && (
          <ReelPreview
            videoUrl={completedReelUrl}
            onCreateAnother={() => {
              setUploadedFiles([])
              setIsProcessing(false)
              setProcessingProgress(0)
              setCompletedReelUrl(null)
            }}
          />
        )}
      </div>
    </main>
  )
}