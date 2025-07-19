# Travel Reel Maker - Backend

Node.js API server for video processing and file management.

## Getting Started

### Prerequisites
- Node.js 18+
- FFmpeg installed on system
- Firebase project with Storage enabled

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your Firebase project ID and service account path
3. Ensure FFmpeg is installed and accessible

#### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

### Development

```bash
npm run dev
```

Server runs on [http://localhost:3001](http://localhost:3001)

### Build & Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm run test:watch
```

## API Endpoints

### POST /api/create-reel
Create a new travel reel from uploaded media files.

**Request:**
- Content-Type: multipart/form-data
- Files: media[] (images/videos)
- Body: location (optional string)

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/project-id.appspot.com/o/reels%2Fuuid.mp4",
  "reelId": "uuid"
}
```

### GET /api/reel/:id/status
Get processing status of a reel.

**Response:**
```json
{
  "reelId": "uuid",
  "status": "processing|completed|failed",
  "progress": 75
}
```

## Deployment

### AWS Lambda (Recommended)
1. Build the project: `npm run build`
2. Package with dependencies
3. Deploy to Lambda with appropriate timeout (5+ minutes)
4. Configure API Gateway

### AWS EC2
1. Launch EC2 instance
2. Install Node.js and FFmpeg
3. Clone repository and install dependencies
4. Use PM2 for process management
5. Configure nginx as reverse proxy

### Docker
```bash
docker build -t travel-reel-backend .
docker run -p 3001:3001 travel-reel-backend
```

## Project Structure

```
backend/
├── src/
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helper utilities
│   └── server.ts       # Entry point
├── uploads/            # Temporary file storage
└── temp/               # Processing workspace
```