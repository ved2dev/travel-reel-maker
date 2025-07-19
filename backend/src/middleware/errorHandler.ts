import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error)

  if (error.name === 'MulterError') {
    if (error.message.includes('File too large')) {
      return res.status(413).json({ error: 'File too large' })
    }
    return res.status(400).json({ error: 'File upload error' })
  }

  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
}