# Deploy Interview Agent to Render - Step by Step

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Google Gemini API Key (get from https://makersuite.google.com/app/apikey)

---

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/interview-agent.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Required Files

Make sure these files exist in your repo:
- ✅ `backend/package.json`
- ✅ `frontend/package.json`
- ✅ `.env.example`

---

## Step 2: Deploy Backend on Render

### 2.1 Create Web Service

1. Go to https://dashboard.render.com/
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### 2.2 Connect Repository

1. Click **"Connect a repository"** or **"Configure account"**
2. Grant Render access to your GitHub repositories
3. Find and select your `interview-agent` repository
4. Click **"Connect"**

### 2.3 Configure Backend Service

Fill in the following details:

**Basic Settings:**
- **Name**: `interview-agent-backend` (or any name you prefer)
- **Region**: Select closest to your location
- **Branch**: `main`
- **Root Directory**: `backend`

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install
  ```
- **Start Command**: 
  ```
  npm start
  ```

**Instance Type:**
- Select **"Free"** (or paid plan if you prefer)

### 2.4 Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**

Add these variables one by one:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `5000` | `5000` |
| `JWT_SECRET` | Generate a random string | `my-super-secret-jwt-key-12345` |
| `GEMINI_API_KEY` | Your Gemini API key | `AIzaSyC...` |
| `JWT_EXPIRES_IN` | `7d` | `7d` |
| `CLIENT_URL` | Leave empty for now, will update after frontend | |
| `MONGO_URI` | Leave empty (optional) | |

**How to generate JWT_SECRET:**
- Use a password generator to create a 32+ character random string
- Or run in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 2.5 Deploy Backend

1. Click **"Create Web Service"** at the bottom
2. Wait for deployment (2-5 minutes)
3. Watch the logs - should see "Server running on port 5000"
4. Once deployed, copy the **service URL** (e.g., `https://interview-agent-backend.onrender.com`)

### 2.6 Test Backend

Open in browser:
```
https://your-backend-url.onrender.com/health
```

Should see:
```json
{"status":"ok","timestamp":"2025-11-30T..."}
```

---

## Step 3: Deploy Frontend on Render

### 3.1 Create Static Site

1. Go back to Render Dashboard
2. Click **"New +"** button
3. Select **"Static Site"**

### 3.2 Connect Same Repository

1. Select your `interview-agent` repository again
2. Click **"Connect"**

### 3.3 Configure Frontend Service

**Basic Settings:**
- **Name**: `interview-agent-frontend` (or any name)
- **Branch**: `main`
- **Root Directory**: `frontend`

**Build & Deploy:**
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  dist
  ```

### 3.4 Add Frontend Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `VITE_API_BASE` | `https://your-backend-url.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://your-backend-url.onrender.com` |

**Replace** `your-backend-url` with the actual backend URL from Step 2.5

Example:
```
VITE_API_BASE=https://interview-agent-backend.onrender.com/api
VITE_SOCKET_URL=https://interview-agent-backend.onrender.com
```

### 3.5 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for build and deployment (2-5 minutes)
3. Once deployed, copy the **site URL** (e.g., `https://interview-agent-frontend.onrender.com`)

---

## Step 4: Update Backend with Frontend URL

### 4.1 Add CLIENT_URL to Backend

1. Go to your **backend service** in Render Dashboard
2. Click on **"Environment"** in the left sidebar
3. Find `CLIENT_URL` variable (or add new one)
4. Set value to your frontend URL: `https://interview-agent-frontend.onrender.com`
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## Step 5: Test Your Deployment

### 5.1 Open Your App

Visit your frontend URL: `https://interview-agent-frontend.onrender.com`

### 5.2 Test Features

1. **Register/Login**
   - Create a new account
   - Verify you can log in

2. **Start Interview**
   - Click "Launch Interview"
   - Select a mode (Technical, HR, or MCQ)
   - Start the interview

3. **Chat & Score**
   - Send messages
   - Verify responses come back
   - Check score updates (for non-MCQ modes)

4. **Complete Session**
   - Click "Complete Session"
   - Verify final score displays

### 5.3 Check Logs (If Issues)

**Backend Logs:**
1. Go to Render Dashboard → Backend Service
2. Click **"Logs"** tab
3. Look for errors

**Frontend Logs:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

---

## Step 6: Optional - Custom Domain

### 6.1 Add Custom Domain to Frontend

1. In Frontend service, click **"Settings"**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `interview.yourdomain.com`)
5. Follow DNS configuration instructions

### 6.2 Update Backend CLIENT_URL

After adding custom domain:
1. Update `CLIENT_URL` in backend environment variables
2. Set to your custom domain

---

## Troubleshooting

### Backend Issues

**Error: "Missing GEMINI_API_KEY"**
- Verify you added `GEMINI_API_KEY` in environment variables
- Check the key is valid at https://makersuite.google.com/app/apikey

**Error: "Port already in use"**
- Ensure `PORT` is set to `5000` in environment variables
- Render automatically handles port binding

**Build Fails**
- Check **"Logs"** tab for specific errors
- Verify `backend/package.json` exists
- Try deploying again (click **"Manual Deploy"** → **"Clear build cache & deploy"**)

### Frontend Issues

**"API Connection Failed"**
- Verify `VITE_API_BASE` is correct (include `/api` at the end)
- Check backend is running and healthy
- Open DevTools → Network tab to see failed requests

**Blank Page**
- Check `VITE_API_BASE` and `VITE_SOCKET_URL` are set
- Check browser console for errors
- Verify build command includes `npm install && npm run build`

**WebSocket Connection Failed**
- Ensure `VITE_SOCKET_URL` points to backend (no `/api` suffix)
- Render supports WebSockets on all plans

### General Tips

1. **Free Tier Spin Down**: Render free tier services spin down after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

2. **View Logs**: Always check logs first when debugging issues

3. **Environment Variables**: After changing environment variables, the service automatically redeploys

4. **Manual Redeploy**: Go to service → Click **"Manual Deploy"** → **"Deploy latest commit"**

5. **Build Cache**: If builds are failing mysteriously, try **"Clear build cache & deploy"**

---

## Costs

**Free Tier:**
- ✅ 750 hours/month for web services
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ⚠️ Services spin down after 15 min inactivity
- ⚠️ 512 MB RAM

**Paid Plans** (Starting at $7/month):
- ✅ No spin down
- ✅ More RAM & CPU
- ✅ Priority support

---

## Next Steps

1. ✅ Test all features thoroughly
2. ✅ Share your app URL with others
3. ✅ Monitor usage and logs
4. ✅ Consider upgrading to paid plan for production use
5. ✅ Setup monitoring (Sentry, LogRocket, etc.)

---

## Quick Reference

**Your URLs:**
- Backend: `https://interview-agent-backend.onrender.com`
- Frontend: `https://interview-agent-frontend.onrender.com`
- Health Check: `https://interview-agent-backend.onrender.com/health`

**Important Commands:**
- Redeploy: Manual Deploy button in dashboard
- View Logs: Logs tab in service
- Update Env: Environment tab in service

---

## Support

**Render Documentation:**
- https://render.com/docs
- https://render.com/docs/web-services
- https://render.com/docs/static-sites

**Having Issues?**
1. Check logs in Render Dashboard
2. Verify all environment variables are set correctly
3. Test backend health endpoint
4. Check browser console for frontend errors

---

**🎉 Congratulations! Your Interview Agent is now live on Render!**
