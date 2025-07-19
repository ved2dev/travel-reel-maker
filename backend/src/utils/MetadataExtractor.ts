import exifr from 'exifr'
import fs from 'fs'

export class MetadataExtractor {
  async extractDate(filePath: string): Promise<Date | null> {
    try {
      const stats = fs.statSync(filePath)

      // Try to extract EXIF data for images
      if (this.isImageFile(filePath)) {
        const exifData = await exifr.parse(filePath)
        if (exifData?.DateTimeOriginal) {
          return new Date(exifData.DateTimeOriginal)
        }
        if (exifData?.DateTime) {
          return new Date(exifData.DateTime)
        }
      }

      // Fall back to file creation time
      return stats.birthtime || stats.mtime
    } catch (error) {
      console.error('Error extracting metadata:', error)
      return null
    }
  }

  async extractLocation(filePath: string): Promise<string | null> {
    try {
      if (this.isImageFile(filePath)) {
        const exifData = await exifr.parse(filePath, { gps: true })
        if (exifData?.latitude && exifData?.longitude) {
          // In a real app, you'd use a reverse geocoding service
          return `${exifData.latitude.toFixed(4)}, ${exifData.longitude.toFixed(4)}`
        }
      }
      return null
    } catch (error) {
      console.error('Error extracting location:', error)
      return null
    }
  }

  private isImageFile(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp']
    const ext = filePath.toLowerCase().substring(filePath.lastIndexOf('.'))
    return imageExtensions.includes(ext)
  }
}