import { Download, RotateCcw } from 'lucide-react'

interface ReelPreviewProps {
  videoUrl: string
  onCreateAnother: () => void
}

export default function ReelPreview({ videoUrl, onCreateAnother }: ReelPreviewProps) {
  const downloadReel = () => {
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = 'travel-reel.mp4'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Your Travel Reel is Ready! 🎉</h2>
      
      <div className="mb-6">
        <video
          controls
          className="w-full max-w-md mx-auto rounded-lg shadow-md"
          poster="/video-placeholder.jpg"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadReel}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          <Download className="h-5 w-5" />
          Download Reel
        </button>
        
        <button
          onClick={onCreateAnother}
          className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          <RotateCcw className="h-5 w-5" />
          Create Another
        </button>
      </div>
    </div>
  )
}