import ffmpeg from 'fluent-ffmpeg'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import { FirebaseStorageService } from './S3Service'
import { MetadataExtractor } from '../utils/MetadataExtractor'

export class ReelService {
  private firebaseStorageService: FirebaseStorageService
  private metadataExtractor: MetadataExtractor

  constructor(firebaseStorageService: FirebaseStorageService) {
    this.firebaseStorageService = firebaseStorageService
    this.metadataExtractor = new MetadataExtractor()
  }

  async createReel(files: Express.Multer.File[], location: string) {
    const reelId = uuidv4()
    const outputPath = path.join('temp', `${reelId}.mp4`)

    try {
      // Sort files by creation date if available
      const sortedFiles = await this.sortFilesByDate(files)
      
      // Generate title
      const title = await this.generateTitle(sortedFiles, location)
      
      // Create video reel
      await this.processVideoReel(sortedFiles, outputPath, title)
      
      // Upload to Firebase Storage
      const downloadUrl = await this.firebaseStorageService.uploadFile(outputPath, `${reelId}.mp4`)
      
      // Cleanup local files
      this.cleanupFiles([...files, { path: outputPath } as Express.Multer.File])
      
      return {
        reelId,
        downloadUrl
      }
    } catch (error) {
      // Cleanup on error
      this.cleanupFiles([...files, { path: outputPath } as Express.Multer.File])
      throw error
    }
  }

  private async sortFilesByDate(files: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    const filesWithDates = await Promise.all(
      files.map(async (file) => {
        const metadata = await this.metadataExtractor.extractDate(file.path)
        return { file, date: metadata || new Date(0) }
      })
    )

    return filesWithDates
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(item => item.file)
  }

  private async generateTitle(files: Express.Multer.File[], location: string): Promise<string> {
    const year = new Date().getFullYear()
    return location ? `Trip to ${location} ${year}` : `Travel Memories ${year}`
  }

  private async processVideoReel(
    files: Express.Multer.File[],
    outputPath: string,
    title: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg()

      // Add input files
      files.forEach((file) => {
        command.input(file.path)
      })

      // Add background music (placeholder - you'll need to add actual music file)
      const musicPath = path.join(__dirname, '../../assets/default-music.mp3')
      if (fs.existsSync(musicPath)) {
        command.input(musicPath)
      }

      command
        .complexFilter([
          // Scale all inputs to same size
          ...files.map((_, i) => `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v${i}]`),
          // Concatenate videos
          `${files.map((_, i) => `[v${i}]`).join('')}concat=n=${files.length}:v=1:a=0[outv]`,
          // Add title overlay
          `[outv]drawtext=text='${title}':fontfile=/System/Library/Fonts/Arial.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=100:enable='between(t,1,4)'[finalv]`
        ])
        .outputOptions([
          '-map', '[finalv]',
          '-map', `${files.length}:a?`, // Audio from music file if exists
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-shortest',
          '-t', '60' // Max 60 seconds
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run()
    })
  }

  private cleanupFiles(files: Express.Multer.File[]) {
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
    })
  }

  async getProcessingStatus(reelId: string) {
    // This would typically check a database or cache
    // For now, return a simple status
    return {
      reelId,
      status: 'completed',
      progress: 100
    }
  }
}