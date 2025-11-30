# Interview Agent - Deployment Guide

This guide covers multiple deployment options for the Interview Agent application.

## Prerequisites

Before deploying, ensure you have:

1. **Google Gemini API Key** - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **JWT Secret** - Generate a random secure string
3. **MongoDB URI** (Optional) - Get free tier from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or use in-memory storage

## Environment Variables

All deployments require these environment variables:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
GEMINI_API_KEY=your-gemini-api-key-here
CLIENT_URL=https://your-frontend-url.com
MONGO_URI=mongodb+srv://... (optional)
```

Frontend environment variables:

```env
VITE_API_BASE=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## Option 1: Deploy to Render (Recommended - Easiest)

### Backend Deployment on Render:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `interview-agent-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Add Environment Variables** (from above)
5. Click **"Create Web Service"**

### Frontend Deployment on Render:

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `interview-agent-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Add Environment Variables**:
     - `VITE_API_BASE`: `https://your-backend-url.onrender.com/api`
     - `VITE_SOCKET_URL`: `https://your-backend-url.onrender.com`
4. Click **"Create Static Site"**

---

## Option 2: Deploy to Railway

### Full Stack Deployment:

1. Go to [Railway](https://railway.app/)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect and create two services

### Backend Service:

- **Root Directory**: `/backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Add environment variables

### Frontend Service:

- **Root Directory**: `/frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- Add environment variables

---

## Option 3: Deploy to Vercel

### Prerequisites:

Install Vercel CLI:

```bash
npm install -g vercel
```

### Deploy:

1. Update `backend/src/server.js` to export the app for serverless:
   Add at the end:

   ```javascript
   export default app;
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy:

   ```bash
   vercel
   ```

4. Add environment variables in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add all required variables

**Note**: Vercel has limitations with WebSocket (Socket.io). Consider using Render or Railway for better WebSocket support.

---

## Option 4: Deploy with Docker

### Build and Run Locally:

```bash
# Build the Docker image
docker build -t interview-agent .

# Run the container
docker run -p 5000:5000 \
  -e JWT_SECRET=your-secret \
  -e GEMINI_API_KEY=your-api-key \
  -e CLIENT_URL=http://localhost:5000 \
  interview-agent
```

### Deploy with Docker Compose:

1. Create `.env` file with your variables
2. Run:
   ```bash
   docker-compose up -d
   ```

### Deploy to Cloud Providers:

#### AWS ECS/Fargate:

- Push image to ECR
- Create ECS task definition
- Deploy service

#### Google Cloud Run:

```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/interview-agent
gcloud run deploy --image gcr.io/PROJECT-ID/interview-agent --platform managed
```

#### Azure Container Instances:

```bash
az container create --resource-group myResourceGroup \
  --name interview-agent \
  --image your-docker-image \
  --dns-name-label interview-agent \
  --ports 5000
```

---

## Option 5: Traditional VPS (DigitalOcean, AWS EC2, etc.)

### Setup:

1. **SSH into your server**

2. **Install Node.js and npm:**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone your repository:**

   ```bash
   git clone https://github.com/yourusername/interview-agent.git
   cd interview-agent
   ```

4. **Install dependencies:**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install && npm run build
   cd ..
   ```

5. **Create `.env` file** in the root directory with your variables

6. **Serve frontend from backend:**
   Update `backend/src/app.js` to serve static files:

   ```javascript
   import path from "path";
   import { fileURLToPath } from "url";

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   // Serve static frontend files
   app.use(express.static(path.join(__dirname, "../../frontend/dist")));

   app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
   });
   ```

7. **Install PM2 for process management:**

   ```bash
   sudo npm install -g pm2
   ```

8. **Start the application:**

   ```bash
   cd backend
   pm2 start src/server.js --name interview-agent
   pm2 save
   pm2 startup
   ```

9. **Setup Nginx as reverse proxy:**

   ```bash
   sudo apt install nginx
   ```

   Create `/etc/nginx/sites-available/interview-agent`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/interview-agent /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

---

## Post-Deployment Checklist

- [ ] Test API endpoints: `https://your-backend-url.com/api/health`
- [ ] Test WebSocket connection
- [ ] Verify environment variables are set correctly
- [ ] Test authentication (register/login)
- [ ] Start an interview session and verify it works
- [ ] Check browser console for errors
- [ ] Monitor logs for any issues
- [ ] Setup monitoring (e.g., Sentry, LogRocket)
- [ ] Configure CORS properly for production domains
- [ ] Setup database backups (if using MongoDB)

---

## Troubleshooting

### WebSocket Connection Issues:

- Ensure your hosting provider supports WebSockets
- Check CORS settings in backend
- Verify `VITE_SOCKET_URL` points to correct backend URL

### API Connection Issues:

- Verify `VITE_API_BASE` is correct
- Check CORS configuration
- Ensure all environment variables are set

### Gemini API Errors:

- Verify API key is valid
- Check API quota/limits
- Review error logs

### MongoDB Connection Issues:

- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

---

## Monitoring and Maintenance

### View Logs:

**Render**: Dashboard → Service → Logs

**Railway**: Project → Service → Deployments → Logs

**PM2** (VPS):

```bash
pm2 logs interview-agent
```

**Docker**:

```bash
docker logs <container-id>
```

### Update Application:

**Cloud Platforms**: Push to GitHub, auto-deploys

**VPS with PM2**:

```bash
git pull
cd backend && npm install
cd ../frontend && npm install && npm run build
pm2 restart interview-agent
```

---

## Cost Optimization

- Use **Render/Railway free tier** for testing
- Optimize Docker image size
- Use CDN for static assets
- Implement caching strategies
- Monitor API usage to stay within free tiers

---

## Security Best Practices

1. Never commit `.env` files
2. Use strong JWT secrets (minimum 32 characters)
3. Enable HTTPS/SSL
4. Set appropriate CORS origins
5. Implement rate limiting
6. Keep dependencies updated
7. Use MongoDB Atlas network access controls
8. Regularly rotate API keys

---

## Need Help?

- Check application logs first
- Review environment variable configuration
- Ensure all services can communicate
- Test locally with production environment variables
