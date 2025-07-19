import * as admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

export class FirebaseStorageService {
  private bucket: admin.storage.Bucket

  constructor() {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      const projectId = process.env.FIREBASE_PROJECT_ID

      if (!serviceAccountPath || !projectId) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH and FIREBASE_PROJECT_ID environment variables are required')
      }

      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${projectId}.appspot.com`
      })
    }

    this.bucket = admin.storage().bucket()
  }

  async uploadFile(filePath: string, key: string): Promise<string> {
    try {
      const destination = `reels/${key}`
      
      await this.bucket.upload(filePath, {
        destination,
        metadata: {
          contentType: this.getContentType(filePath),
        },
        public: true
      })

      // Get the public URL
      const file = this.bucket.file(destination)
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491' // Far future date for public access
      })

      return url
    } catch (error) {
      console.error('Firebase Storage upload error:', error)
      throw new Error('Failed to upload file to Firebase Storage')
    }
  }

  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase()
    const contentTypes: { [key: string]: string } = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    }
    return contentTypes[ext] || 'application/octet-stream'
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const file = this.bucket.file(`reels/${key}`)
      await file.delete()
    } catch (error) {
      console.error('Firebase Storage delete error:', error)
      throw new Error('Failed to delete file from Firebase Storage')
    }
  }
}