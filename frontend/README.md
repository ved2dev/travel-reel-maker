# Travel Reel Maker - Frontend

Next.js application for creating travel video reels.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm run test:watch
```

## Features

- Drag & drop file upload
- Real-time processing progress
- Video preview and download
- Responsive design
- TypeScript support

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
# Upload dist folder to your hosting provider
```

## Project Structure

```
frontend/
├── app/
│   ├── components/     # React components
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/             # Static assets
└── package.json        # Dependencies
```