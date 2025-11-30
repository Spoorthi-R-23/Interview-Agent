# Interview Agent - AI-Powered Mock Interview Platform

## 📋 What the Agent Does

Interview Agent is an AI-powered mock interview platform that conducts adaptive, real-time interviews across three modes. The HR Round tests communication skills, motivations, and culture fit, while the Technical Round deep dives into algorithms, system design, and problem-solving capabilities. The MCQ Round provides multiple choice questions to quickly assess knowledge with a fixed set of 10 questions per session. The agent acts as an intelligent interviewer that asks relevant questions based on the interview mode, adapts difficulty dynamically based on candidate responses, provides real-time feedback after each answer, scores responses on a scale of -5 to +5, never repeats the same question twice, and generates comprehensive performance summaries at the end of each session.

---

## ✨ Features

The Interview Agent offers comprehensive features including multi-mode interviews with HR Round for soft skills assessment, Technical Round for coding and system design evaluation, and MCQ Round for rapid knowledge testing. It has a real-time scoring system with dynamic scoring ranging from -5 to +5 per response, adaptive difficulty adjustment across easy, medium, and hard levels, live score tracking during interviews, and final percentage calculation. The platform provides AI-powered feedback with immediate feedback after each response, highlights strengths and improvement areas, and delivers an overall performance summary at the end. User authentication is secured through JWT-based authentication with user registration, login, and session management capabilities.

The interview dashboard allows users to track past interview sessions, view scores and feedback history, and monitor progress over time. Real-time communication is enabled through WebSocket-based live messaging with instant question-answer flow and audio transcription support for voice responses. The system supports persistent storage with MongoDB integration for data persistence, an in-memory storage fallback option, and session history tracking. For MCQ mode specifically, the platform offers fixed 10 questions per session with 4 options (A, B, C, D) per question, immediate feedback with correct answer explanations, scores calculated out of 50 points (5 points per question), and displays the score only after completing all questions.

---

## 🚧 Limitations

### Current Limitations

1. **No Voice Input/Output**: Audio transcription is configured but Whisper API integration needs OpenAI API key
2. **No Resume Analysis**: Cannot analyze uploaded resumes yet
3. **No Calendar Integration**: Scheduling features are stubbed but not fully functional
4. **No Google Sheets Export**: Data export feature is configured but not active
5. **Single Language**: English only, no multi-language support
6. **No Video**: Text-based only, no video interview capability
7. **Limited Question Bank**: Questions are generated on-the-fly, not from a curated database
8. **No Interview Recording**: Cannot save/replay interview sessions
9. **Basic Analytics**: Limited insights and performance tracking
10. **Free Tier Limitations**:
    - Render free tier: Services spin down after 15 minutes of inactivity
    - Cold starts can take 30-60 seconds
    - Railway: $5 free credit (usage-based)

### Technical Limitations

- **No Rate Limiting**: API endpoints not rate-limited yet
- **Basic Error Handling**: Could be more robust
- **No Admin Panel**: No administrative interface for managing users/sessions
- **No Email Notifications**: No email confirmations or reminders
- **Session Timeout**: Sessions don't auto-complete after inactivity

---

## 🛠️ Tools Used

The Interview Agent project utilizes a comprehensive set of development tools including Git and GitHub for version control, VS Code as the primary code editor, npm for package management, and ES Modules (import/export) as the module system. The frontend is built using Vite as the build tool, Tailwind CSS for styling, Zustand for state management, Axios as the HTTP client, and Socket.io-client for WebSocket communication. The backend infrastructure runs on Node.js runtime with Express.js as the web framework, Socket.io for WebSocket server functionality, Multer for file uploads, Winston for logging, and uses Nodemon for development process management and PM2 for production. DevOps and deployment are handled through Docker and Docker Compose for containerization, cloud platforms including Render, Railway, and Vercel, and dotenv for environment management.

**MongoDB Atlas**

- **Purpose**: User data, interview sessions, feedback storage
- **Fallback**: In-memory storage (Map) if MongoDB not configured
- **ODM**: Mongoose

### Authentication

**JSON Web Tokens (JWT)**

- **Library**: jsonwebtoken
- **Algorithm**: HS256
- **Expiration**: 7 days (configurable)
- **Password Hashing**: bcryptjs

### APIs (Configured but Not Active)

1. **OpenAI Whisper** - For audio transcription (requires OPENAI_API_KEY)
2. **Google Calendar API** - For scheduling interviews (requires OAuth setup)
3. **Google Sheets API** - For exporting interview data (requires OAuth setup)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))
- Git installed

## 🔌 APIs & Models Used

The primary AI model powering the Interview Agent is Google Gemini Flash (gemini-flash-latest) provided by Google AI Generative AI platform, accessible through the API endpoint at https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent. This model generates interview questions, evaluates candidate responses, and provides detailed feedback, configured with a temperature of 0.9 for creative responses, Top K value of 40, Top P of 0.95, and a maximum output token limit of 1024.

The database infrastructure uses MongoDB Atlas for storing user data, interview sessions, and feedback, with Mongoose as the ODM (Object Document Mapper), and includes an in-memory storage fallback using JavaScript Map if MongoDB is not configured. Authentication is handled through JSON Web Tokens (JWT) using the jsonwebtoken library with HS256 algorithm, a configurable 7-day expiration period, and bcryptjs for secure password hashing. Additionally, several APIs are configured but not currently active, including OpenAI Whisper for audio transcription (requires OPENAI_API_KEY), Google Calendar API for scheduling interviews (requires OAuth setup), and Google Sheets API for exporting interview data (requires OAuth setup).

# Start backend

npm run dev

````

Backend runs on: `http://localhost:5001`

#### 3. Setup Frontend

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
## 🚀 Setup Instructions

To set up the Interview Agent, you need Node.js version 18 or higher installed on your system, a Google Gemini API Key which can be obtained from https://makersuite.google.com/app/apikey, Git installed for version control, and optionally a MongoDB Atlas account (though the system uses in-memory storage if MongoDB is not provided).

```bash
# Start frontend
npm run dev
````

Frontend runs on: `http://localhost:5173`

#### 4. Access the Application

Open browser: `http://localhost:5173`

---

### Production Deployment

#### Option 1: Render (Recommended)

**Backend:**

1. Go to https://dashboard.render.com/
2. New → Web Service
3. Connect GitHub repo: `Spoorthi-R-23/Interview-Agent`
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables
5. Deploy

**Frontend:**

1. New → Static Site
2. Connect same repo
3. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variables:
     - `VITE_API_BASE`: `https://your-backend-url.onrender.com/api`
     - `VITE_SOCKET_URL`: `https://your-backend-url.onrender.com`
4. Deploy

See `RENDER_DEPLOY.md` for detailed steps.

#### Option 2: Railway

1. Go to https://railway.app/
2. New Project → Deploy from GitHub
3. Select repository
4. Add environment variables to both services
5. Deploy automatically

See `RAILWAY_DEPLOY.md` for detailed steps.

#### Option 3: Docker

```bash
# Build image
docker build -t interview-agent .

# Run container
docker run -p 5000:5000 --env-file .env interview-agent
```

Or use Docker Compose:

```bash
docker-compose up -d
```

---

## 📊 Environment Variables Reference

### Required Variables

- `JWT_SECRET`: Secret key for JWT tokens (32+ characters)
- `GEMINI_API_KEY`: Google Gemini API key

### Optional Variables

- `MONGO_URI`: MongoDB connection string (falls back to in-memory storage)
- `NODE_ENV`: `development` or `production`
- `PORT`: Backend port (default: 5000)
- `CLIENT_URL`: Frontend URL for CORS
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)

---

## 🧪 Testing the Application

### 1. Register/Login

- Create a new account
- Login with credentials

### 2. Start Interview

- Choose interview mode (HR/Technical/MCQ)
- Click "Launch Interview"

### 3. Answer Questions

- For HR/Technical: Type responses
- For MCQ: Select from 4 options

### 4. Complete Session

- Click "Complete Session" button
- View final score and feedback

### 5. Check Dashboard

- View past interview sessions
- See scores and feedback history

---

## 📚 Project Structure

```
Interview-Agent/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── uploads/             # File uploads directory
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   └── utils/           # Utility functions
│   └── package.json
├── docs/                    # Documentation
├── DEPLOYMENT.md            # Full deployment guide
├── RENDER_DEPLOY.md         # Render-specific guide
├── RAILWAY_DEPLOY.md        # Railway-specific guide
├── QUICKSTART.md            # Quick start guide
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose config
└── README.md                # This file
```

---

## 🔗 Useful Links

- **Live Demo**: https://interview-agent-mpa8.onrender.com
- **GitHub Repository**: https://github.com/Spoorthi-R-23/Interview-Agent
- **Google Gemini API**: https://makersuite.google.com/app/apikey
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Render**: https://render.com
- **Railway**: https://railway.app

---

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your own use.

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🆘 Support

For issues or questions:

1. Check the deployment guides in the `docs/` folder
2. Review error logs in your deployment platform
3. Verify all environment variables are set correctly
4. Test the backend health endpoint: `/health`

---

**Built with ❤️ using React, Node.js, and Google Gemini AI**
