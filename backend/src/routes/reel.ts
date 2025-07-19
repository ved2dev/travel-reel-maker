import { Router } from 'express'
import { Multer } from 'multer'
import { ReelService } from '../services/ReelService'
import { S3Service } from '../services/S3Service'

export function createReelRouter(upload: Multer) {
  const router = Router()
  const s3Service = new S3Service()
  const reelService = new ReelService(s3Service)

  router.post('/create-reel', upload.array('media', 20), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[]
      const location = req.body.location || 'Travel'

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' })
      }

      const result = await reelService.createReel(files, location)
      
      res.json({
        success: true,
        downloadUrl: result.downloadUrl,
        reelId: result.reelId
      })
    } catch (error) {
      console.error('Error creating reel:', error)
      res.status(500).json({ error: 'Failed to create reel' })
    }
  })

  router.get('/reel/:id/status', async (req, res) => {
    try {
      const { id } = req.params
      const status = await reelService.getProcessingStatus(id)
      res.json(status)
    } catch (error) {
      console.error('Error getting reel status:', error)
      res.status(500).json({ error: 'Failed to get reel status' })
    }
  })

  return router
}