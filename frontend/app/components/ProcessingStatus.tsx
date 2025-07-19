interface ProcessingStatusProps {
  progress: number
}

export default function ProcessingStatus({ progress }: ProcessingStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Creating Your Travel Reel</h2>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress}% complete</p>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p>✨ Processing your media files</p>
        <p>🎬 Adding transitions and effects</p>
        <p>🎵 Adding background music</p>
        <p>📝 Generating title overlay</p>
      </div>
    </div>
  )
}