# Interview Agent - Quick Deploy Script for Windows
# Run this in PowerShell

Write-Host "🚀 Interview Agent Deployment Helper" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  No .env file found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file. Please edit it with your actual values:" -ForegroundColor Green
    Write-Host "   - JWT_SECRET (generate a random string)"
    Write-Host "   - GEMINI_API_KEY (get from Google AI Studio)"
    Write-Host "   - MONGO_URI (optional, from MongoDB Atlas)"
    Write-Host ""
    Write-Host "Press Enter when you've updated the .env file..."
    Read-Host
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..."
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Install frontend dependencies
Write-Host "Installing frontend dependencies..."
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Build frontend
Write-Host "🏗️  Building frontend..." -ForegroundColor Cyan
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "✅ Frontend built successfully!" -ForegroundColor Green
Write-Host ""

# Ask deployment method
Write-Host "Choose deployment method:"
Write-Host "1) Run locally (development)"
Write-Host "2) Run with Docker"
Write-Host "3) Deploy to Render (show instructions)"
Write-Host "4) Deploy to Railway (show instructions)"
Write-Host "5) Exit"
Write-Host ""
$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting local development servers..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend will run on: http://localhost:5000"
        Write-Host "Frontend will run on: http://localhost:5173"
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
        Write-Host ""
        
        # Start backend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
        
        # Start frontend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
        
        Write-Host "✅ Servers started in separate windows" -ForegroundColor Green
    }
    
    "2" {
        Write-Host ""
        Write-Host "🐳 Building and running Docker container..." -ForegroundColor Cyan
        docker build -t interview-agent .
        docker run -p 5000:5000 --env-file .env interview-agent
    }
    
    "3" {
        Write-Host ""
        Write-Host "📋 Render Deployment Instructions:" -ForegroundColor Cyan
        Write-Host "===================================="
        Write-Host ""
        Write-Host "1. Push your code to GitHub"
        Write-Host "2. Go to https://dashboard.render.com/"
        Write-Host "3. Create New Web Service for Backend:"
        Write-Host "   - Build Command: cd backend && npm install"
        Write-Host "   - Start Command: cd backend && npm start"
        Write-Host "   - Add environment variables from .env"
        Write-Host ""
        Write-Host "4. Create New Static Site for Frontend:"
        Write-Host "   - Build Command: cd frontend && npm install && npm run build"
        Write-Host "   - Publish Directory: frontend/dist"
        Write-Host "   - Add VITE_API_BASE and VITE_SOCKET_URL env vars"
        Write-Host ""
        Write-Host "See DEPLOYMENT.md for detailed instructions" -ForegroundColor Yellow
    }
    
    "4" {
        Write-Host ""
        Write-Host "📋 Railway Deployment Instructions:" -ForegroundColor Cyan
        Write-Host "===================================="
        Write-Host ""
        Write-Host "1. Push your code to GitHub"
        Write-Host "2. Go to https://railway.app/"
        Write-Host "3. Create New Project from GitHub repo"
        Write-Host "4. Railway will auto-detect and create services"
        Write-Host "5. Add environment variables to each service"
        Write-Host ""
        Write-Host "See DEPLOYMENT.md for detailed instructions" -ForegroundColor Yellow
    }
    
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}
