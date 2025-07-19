# Travel Reel Maker - Technical Architecture

## System Overview

The Travel Reel Maker is a full-stack web application that automatically creates video reels from user-uploaded photos and videos.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │ Firebase Storage│
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Storage)     │
│                 │    │                 │    │                 │
│ - File Upload   │    │ - API Routes    │    │ - Media Files   │
│ - Progress UI   │    │ - Video Proc.   │    │ - Output Reels  │
│ - Preview       │    │ - FFmpeg        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend (Next.js)
- **FileUpload**: Drag & drop interface with file validation
- **ProcessingStatus**: Real-time progress indicator
- **ReelPreview**: Video player and download functionality

### Backend (Node.js/Express)
- **ReelService**: Core video processing logic
- **FirebaseStorageService**: Firebase Storage integration for file storage
- **MetadataExtractor**: EXIF data extraction for smart sorting

### Video Processing Pipeline
1. **File Upload**: Multer handles multipart uploads
2. **Metadata Extraction**: Extract creation dates and GPS data
3. **File Sorting**: Chronological ordering of media
4. **Video Processing**: FFmpeg stitches media with transitions
5. **Title Generation**: Overlay auto-generated titles
6. **Background Music**: Add default soundtrack
7. **Firebase Storage Upload**: Store final reel in cloud storage

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first styling
- **React Dropzone**: File upload handling
- **Axios**: HTTP client for API calls
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **Multer**: File upload middleware
- **FFmpeg**: Video processing
- **Firebase Admin SDK**: Storage integration
- **EXIFR**: Metadata extraction

### Infrastructure
- **Firebase Storage**: File storage
- **Vercel**: Frontend deployment
- **AWS Lambda/EC2**: Backend deployment

## Data Flow

1. User uploads media files via drag & drop
2. Files are sent to backend via multipart form
3. Backend extracts metadata and sorts files
4. FFmpeg processes video with transitions and music
5. Generated reel is uploaded to Firebase Storage
6. Download URL is returned to frontend
7. User can preview and download the reel

## Security Considerations

- File type validation on both client and server
- File size limits (100MB per file)
- Firebase Storage security rules
- Input sanitization for user-provided location
- CORS configuration for cross-origin requests

## Performance Optimizations

- Chunked file uploads for large files
- Progress tracking during processing
- Temporary file cleanup after processing
- Firebase Storage CDN for fast video delivery
- Lazy loading of video previews

## Scalability Considerations

- Horizontal scaling with load balancers
- Queue system for video processing (Redis/SQS)
- Database for job tracking and user sessions
- CDN for static assets and video delivery
- Auto-scaling based on processing load