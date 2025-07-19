# Deployment Guide

## Prerequisites

### Firebase Setup
1. Create Firebase project
2. Enable Firebase Storage
3. Generate service account key
4. Download service account JSON file

### Required Software
- Node.js 18+
- FFmpeg
- Git

## Frontend Deployment (Vercel)

### 1. Prepare Repository
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set framework preset to "Next.js"
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

### 3. Custom Domain (Optional)
1. Add domain in Vercel dashboard
2. Configure DNS records as instructed

## Backend Deployment Options

### Option 1: Google Cloud Functions (Serverless)

#### Setup
1. Install Google Cloud CLI:
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```
2. Enable required APIs:
   ```bash
   gcloud services enable cloudfunctions.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

#### Deploy
```bash
cd backend
npm run build
gcloud functions deploy travel-reel-api \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --source . \
  --entry-point app \
  --timeout 540s \
  --memory 1GB
```

#### Configuration
Create `package.json` script:
```json
{
  "scripts": {
    "deploy": "gcloud functions deploy travel-reel-api --runtime nodejs18 --trigger-http --allow-unauthenticated --source . --entry-point app"
  }
}
```

### Option 2: Google Cloud Run

#### Setup
1. Build and push container:
   ```bash
   cd backend
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/travel-reel-backend
   ```

#### Deploy
```bash
gcloud run deploy travel-reel-backend \
  --image gcr.io/YOUR_PROJECT_ID/travel-reel-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 900s
```

### Option 3: Google Compute Engine

#### 1. Create Compute Engine Instance
```bash
gcloud compute instances create travel-reel-backend \
  --image-family ubuntu-2204-lts \
  --image-project ubuntu-os-cloud \
  --machine-type e2-medium \
  --tags http-server,https-server \
  --metadata startup-script='#!/bin/bash
    apt update && apt upgrade -y
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs ffmpeg nginx
    npm install -g pm2'
```

#### 2. Server Setup
```bash
# Connect to instance
gcloud compute ssh travel-reel-backend

# If not using startup script, install manually:
# sudo apt update && sudo apt upgrade -y
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs ffmpeg nginx
# sudo npm install -g pm2
```

#### 3. Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/travel-reel-maker.git
cd travel-reel-maker/backend

# Install dependencies
npm install

# Build application
npm run build

# Create environment file
cp .env.example .env
# Edit .env with your values

# Start with PM2
pm2 start dist/server.js --name travel-reel-backend
pm2 startup
pm2 save
```

#### 4. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/travel-reel-backend
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/travel-reel-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 4: Docker Deployment

#### 1. Create Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### 2. Build and Run
```bash
cd backend
docker build -t travel-reel-backend .
docker run -p 3001:3001 --env-file .env travel-reel-backend
```

#### 3. Docker Compose (Full Stack)
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - FIREBASE_SERVICE_ACCOUNT_PATH=${FIREBASE_SERVICE_ACCOUNT_PATH}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/temp:/app/temp

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    depends_on:
      - backend
```

## SSL Certificate (Production)

### Using Certbot (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Maintenance

### Health Checks
- Frontend: Check if site loads
- Backend: GET /health endpoint
- Firebase Storage: Verify file uploads work

### Logs
```bash
# PM2 logs
pm2 logs travel-reel-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updates
```bash
# Pull latest code
git pull origin main

# Backend updates
cd backend
npm install
npm run build
pm2 restart travel-reel-backend

# Frontend updates (Vercel auto-deploys)
```

## Scaling Considerations

### High Traffic
- Use Google Cloud Load Balancer
- Multiple Compute Engine instances or Cloud Run with high concurrency
- Cloud Memorystore (Redis) for session management
- Cloud Tasks for video processing queue

### Cost Optimization
- Use Preemptible VM instances for processing
- Firebase Storage lifecycle rules for old files
- Cloud CDN for video delivery

## Troubleshooting

### Common Issues
1. **FFmpeg not found**: Ensure FFmpeg is in PATH
2. **Firebase permissions**: Check service account permissions
3. **File size limits**: Adjust Nginx and Express limits
4. **Memory issues**: Increase Compute Engine instance size or Cloud Run memory
5. **CORS errors**: Check backend CORS configuration
6. **Cloud Function timeout**: Increase timeout for video processing