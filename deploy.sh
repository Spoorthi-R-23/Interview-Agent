#!/bin/bash

# Interview Agent - Quick Deploy Script
# This script helps you deploy the application quickly

echo "🚀 Interview Agent Deployment Helper"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your actual values:"
    echo "   - JWT_SECRET (generate a random string)"
    echo "   - GEMINI_API_KEY (get from Google AI Studio)"
    echo "   - MONGO_URI (optional, from MongoDB Atlas)"
    echo ""
    echo "Press Enter when you've updated the .env file..."
    read
fi

echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo "✅ Frontend built successfully!"
echo ""

# Ask deployment method
echo "Choose deployment method:"
echo "1) Run locally (development)"
echo "2) Run with Docker"
echo "3) Deploy to Render (show instructions)"
echo "4) Deploy to Railway (show instructions)"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting local development servers..."
        echo ""
        echo "Backend will run on: http://localhost:5000"
        echo "Frontend will run on: http://localhost:5173"
        echo ""
        echo "Press Ctrl+C to stop the servers"
        echo ""
        
        # Start backend in background
        cd backend && npm run dev &
        BACKEND_PID=$!
        
        # Start frontend
        cd frontend && npm run dev &
        FRONTEND_PID=$!
        
        # Wait for Ctrl+C
        trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
        wait
        ;;
    
    2)
        echo ""
        echo "🐳 Building and running Docker container..."
        docker build -t interview-agent .
        docker run -p 5000:5000 --env-file .env interview-agent
        ;;
    
    3)
        echo ""
        echo "📋 Render Deployment Instructions:"
        echo "===================================="
        echo ""
        echo "1. Push your code to GitHub"
        echo "2. Go to https://dashboard.render.com/"
        echo "3. Create New Web Service for Backend:"
        echo "   - Build Command: cd backend && npm install"
        echo "   - Start Command: cd backend && npm start"
        echo "   - Add environment variables from .env"
        echo ""
        echo "4. Create New Static Site for Frontend:"
        echo "   - Build Command: cd frontend && npm install && npm run build"
        echo "   - Publish Directory: frontend/dist"
        echo "   - Add VITE_API_BASE and VITE_SOCKET_URL env vars"
        echo ""
        echo "See DEPLOYMENT.md for detailed instructions"
        ;;
    
    4)
        echo ""
        echo "📋 Railway Deployment Instructions:"
        echo "===================================="
        echo ""
        echo "1. Push your code to GitHub"
        echo "2. Go to https://railway.app/"
        echo "3. Create New Project from GitHub repo"
        echo "4. Railway will auto-detect and create services"
        echo "5. Add environment variables to each service"
        echo ""
        echo "See DEPLOYMENT.md for detailed instructions"
        ;;
    
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
