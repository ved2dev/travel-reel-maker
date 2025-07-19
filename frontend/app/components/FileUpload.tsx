'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Play, Image } from 'lucide-react'
import axios from 'axios'

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
  uploadedFiles: File[]
  onStartProcessing: () => void
  onProcessingComplete: (url: string) => void
  onProgressUpdate: (progress: number) => void
}

export default function FileUpload({
  onFilesUploaded,
  uploadedFiles,
  onStartProcessing,
  onProcessingComplete,
  onProgressUpdate
}: FileUploadProps) {
  const [location, setLocation] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...uploadedFiles, ...acceptedFiles]
    onFilesUploaded(newFiles)
  }, [uploadedFiles, onFilesUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    multiple: true
  })

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    onFilesUploaded(newFiles)
  }

  const createReel = async () => {
    if (uploadedFiles.length === 0) return

    onStartProcessing()
    
    try {
      // Step 1: Get signed upload URLs from backend
      console.log('Getting upload URLs for', uploadedFiles.length, 'files')
      onProgressUpdate(10)
      
      const urlResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-upload-urls`,
        {
          fileCount: uploadedFiles.length,
          location: location || 'Travel'
        }
      )

      const { reelId, uploadUrls } = urlResponse.data
      console.log('Got upload URLs for reel:', reelId)
      onProgressUpdate(20)

      // Step 2: Upload files directly to Firebase Storage
      const uploadedFileNames: string[] = []
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        const uploadUrl = uploadUrls[i].uploadUrl
        const fileName = uploadUrls[i].fileName
        
        console.log(`Uploading file ${i + 1}/${uploadedFiles.length}: ${file.name}`)
        
        await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (progressEvent) => {
            const fileProgress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            )
            const totalProgress = 20 + ((i * 60) / uploadedFiles.length) + ((fileProgress * 60) / (uploadedFiles.length * 100))
            onProgressUpdate(Math.round(totalProgress))
          }
        })
        
        uploadedFileNames.push(fileName)
        console.log(`Successfully uploaded: ${file.name}`)
      }

      onProgressUpdate(80)
      console.log('All files uploaded, creating reel...')

      // Step 3: Tell backend to process the uploaded files
      const reelResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-reel`,
        {
          reelId: reelId,
          location: location || 'Travel',
          fileNames: uploadedFileNames
        }
      )

      onProgressUpdate(100)
      console.log('Reel created successfully:', reelResponse.data)
      
      onProcessingComplete(reelResponse.data.downloadUrl)
      
    } catch (error) {
      console.error('Error creating reel:', error)
      alert('Failed to create reel. Please try again.')
      onProgressUpdate(0)
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop your travel photos and videos here
            </p>
            <p className="text-sm text-gray-500">
              or click to select files (JPEG, PNG, MP4, MOV)
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <Image className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Play className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Location (optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Goa, Paris, Tokyo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={createReel}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create My Travel Reel
          </button>
        </div>
      )}
    </div>
  )
}