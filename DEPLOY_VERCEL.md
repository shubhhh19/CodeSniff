# Deploy to Vercel

## Quick Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

## Environment Variables

Set these in Vercel dashboard:
- `CLAUDE_API_KEY` - Your Anthropic Claude API key
- `FLASK_ENV` - Set to `production`
- `SECRET_KEY` - A secure secret key
- `CORS_ORIGINS` - Set to `*` or your domain

## Manual Deployment

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository: `shubhhh19/CodeSniff`
4. Vercel will auto-detect it's a Python project
5. Add environment variables in the dashboard
6. Deploy!

## API Endpoints

- `/api/health` - Health check
- `/api/review` - Code review (POST)
- `/api/detect-language` - Language detection (POST)
- `/api/languages` - Supported languages (GET) 