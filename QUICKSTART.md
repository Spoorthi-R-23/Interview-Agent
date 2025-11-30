# Quick Start Guide - Interview Agent

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

## Local Development (5 Minutes Setup)

### Step 1: Clone and Install

```bash
# Navigate to project
cd "c:\Users\HP\Desktop\Interview Agent"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Setup Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-super-secret-jwt-key-here
GEMINI_API_KEY=your-gemini-api-key-here
CLIENT_URL=http://localhost:5173
```

Update `frontend/.env`:

```env
VITE_API_BASE=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Run the Application

**Option A: Using PowerShell Script (Recommended)**

```powershell
.\deploy.ps1
# Choose option 1 for local development
```

**Option B: Manual Start**

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## Deployment (Choose One)

### 🌟 Render (Recommended - Free Tier Available)

**Backend:**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Build: `cd backend && npm install`
   - Start: `cd backend && npm start`
   - Add environment variables
5. Deploy

**Frontend:**

1. New → Static Site
2. Settings:
   - Build: `cd frontend && npm install && npm run build`
   - Publish: `frontend/dist`
   - Add `VITE_API_BASE` and `VITE_SOCKET_URL`
3. Deploy

Cost: **FREE** (with limitations)

---

### 🚂 Railway (Easiest Auto-Deploy)

1. Go to [Railway](https://railway.app/)
2. New Project → Deploy from GitHub
3. Select repository
4. Add environment variables
5. Deploy automatically

Cost: **$5/month** after free trial

---

### ⚡ Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**

```bash
cd frontend
npx vercel
```

**Backend on Render:**
Follow Render backend steps above

Cost: **FREE**

---

### 🐳 Docker (Any Cloud Provider)

```bash
# Build
docker build -t interview-agent .

# Run
docker run -p 5000:5000 --env-file .env interview-agent
```

Deploy to:

- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

### 🖥️ VPS (Full Control)

For DigitalOcean, AWS EC2, or any VPS:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone <your-repo-url>
cd interview-agent

# Setup
npm install -g pm2
cd backend && npm install
cd ../frontend && npm install && npm run build

# Start
cd backend
pm2 start src/server.js --name interview-agent
pm2 save
pm2 startup

# Setup Nginx (optional but recommended)
# See DEPLOYMENT.md for full Nginx config
```

Cost: **$5-10/month**

---

## Environment Variables Reference

### Backend (.env in project root)

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-random-string>
GEMINI_API_KEY=<from-google-ai-studio>
CLIENT_URL=<your-frontend-url>
MONGO_URI=<optional-mongodb-connection>
```

### Frontend (frontend/.env)

```env
VITE_API_BASE=<your-backend-url>/api
VITE_SOCKET_URL=<your-backend-url>
```

---

## Testing Your Deployment

1. **Health Check**: Visit `https://your-backend-url.com/health`

   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: Visit your frontend URL

   - Should load the landing page

3. **API Test**: Try registering and logging in

4. **Interview Test**: Start an interview session

5. **WebSocket Test**: Send messages during interview

---

## Common Issues

### "API Connection Failed"

- Check `VITE_API_BASE` is correct
- Verify CORS settings in backend
- Check backend is running

### "WebSocket Connection Failed"

- Ensure hosting supports WebSockets
- Verify `VITE_SOCKET_URL` is correct
- Check firewall settings

### "Gemini API Error"

- Verify API key is valid
- Check API quota limits
- Review backend logs

---

## Next Steps

1. ✅ Get your Gemini API key
2. ✅ Choose a deployment platform
3. ✅ Set environment variables
4. ✅ Deploy and test
5. 🎉 Share your application!

---

## Support

For detailed deployment instructions, see:

- **DEPLOYMENT.md** - Complete deployment guide
- **README.md** - Project documentation

Need help? Check the logs:

- Render/Railway: Dashboard → Logs
- Docker: `docker logs <container>`
- PM2: `pm2 logs interview-agent`
