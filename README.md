# Simple Travel Reel Maker

A web application that automatically creates 30-60 second travel video reels from uploaded photos and videos.

## Features

- Upload multiple travel photos and videos
- Automatic video stitching with transitions
- Default background music
- Auto-generated titles based on metadata
- Download completed reels

## Tech Stack

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- React Dropzone for file uploads
- Axios for API calls

### Backend
- Node.js with Express
- Multer for file uploads
- FFmpeg for video processing
- Firebase Admin SDK for storage

### Infrastructure
- Firebase Storage for file storage
- Vercel for frontend deployment
- Google Cloud Functions/Cloud Run for backend

## Project Structure

```
travel-reel-maker/
├── frontend/          # Next.js application
├── backend/           # Node.js API server
├── shared/            # Shared types and utilities
└── infrastructure/    # Deployment configs
```

## Getting Started

See individual README files in frontend/ and backend/ directories for setup instructions.

## Deployment Status
- ✅ Frontend: Deployed on Vercel - https://travel-reel-maker-hectyt1g2-veds-projects-2952b1ed.vercel.app/
- ✅ Backend: Deployed on Google Cloud Functions - https://us-central1-travel-reel-maker.cloudfunctions.net/travel-reel-api

## Live URLs
- **Frontend**: https://travel-reel-maker-hectyt1g2-veds-projects-2952b1ed.vercel.app/
- **Backend API**: https://us-central1-travel-reel-maker.cloudfunctions.net/travel-reel-api
- **Health Check**: https://us-central1-travel-reel-maker.cloudfunctions.net/travel-reel-api/health
