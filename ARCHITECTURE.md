# Interview Agent - System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Vite)                              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Landing   │  │    Auth    │  │ Dashboard  │  │ Interview  │    │  │
│  │  │    Page    │  │    Page    │  │    Page    │  │    Page    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │  │
│  │         │               │               │               │             │  │
│  │         └───────────────┴───────────────┴───────────────┘             │  │
│  │                             │                                          │  │
│  │         ┌───────────────────┴──────────────────┐                      │  │
│  │         │                                       │                      │  │
│  │    ┌────▼────┐                          ┌──────▼──────┐              │  │
│  │    │ Zustand │                          │ Socket.io   │              │  │
│  │    │  State  │                          │   Client    │              │  │
│  │    │ Manager │                          └─────────────┘              │  │
│  │    └─────────┘                                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│                      │                              │                        │
│                      │ HTTP/HTTPS                   │ WebSocket              │
│                      │ (REST API)                   │ (Real-time)            │
└──────────────────────┼──────────────────────────────┼────────────────────────┘
                       │                              │
                       ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Node.js Backend (Express.js)                       │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    API Routes Layer                             │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │  │
│  │  │  │   Auth   │ │Interview │ │ Calendar │ │  Sheets  │          │  │  │
│  │  │  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │          │  │  │
│  │  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │  │  │
│  │  └───────┼────────────┼────────────┼────────────┼─────────────────┘  │  │
│  │          │            │            │            │                     │  │
│  │  ┌───────▼────────────▼────────────▼────────────▼─────────────────┐  │  │
│  │  │                   Middleware Layer                              │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │  │  │
│  │  │  │     Auth     │  │    Error     │  │    CORS      │         │  │  │
│  │  │  │  Middleware  │  │   Handler    │  │   Helmet     │         │  │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘         │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │                   Controllers Layer                             │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │  │
│  │  │  │   Auth   │ │Interview │ │ Calendar │ │  Sheets  │          │  │  │
│  │  │  │Controller│ │Controller│ │Controller│ │Controller│          │  │  │
│  │  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │  │  │
│  │  └───────┼────────────┼────────────┼────────────┼─────────────────┘  │  │
│  │          │            │            │            │                     │  │
│  │  ┌───────▼────────────▼────────────▼────────────▼─────────────────┐  │  │
│  │  │                   Services Layer                                │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │  │
│  │  │  │   Auth   │ │Interview │ │   GPT    │ │ Scoring  │          │  │  │
│  │  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │          │  │  │
│  │  │  └──────────┘ └──────────┘ └────┬─────┘ └──────────┘          │  │  │
│  │  │  ┌──────────┐ ┌──────────┐      │                              │  │  │
│  │  │  │ Calendar │ │  Sheets  │      │                              │  │  │
│  │  │  │ Service  │ │ Service  │      │                              │  │  │
│  │  │  └──────────┘ └──────────┘      │                              │  │  │
│  │  └─────────────────────────────────┼──────────────────────────────┘  │  │
│  │                                     │                                 │  │
│  │  ┌──────────────────────────────────────────────────────────────┐   │  │
│  │  │                   WebSocket Layer (Socket.io)                 │   │  │
│  │  │  • Real-time interview messaging                              │   │  │
│  │  │  • Live score updates                                         │   │  │
│  │  │  • Instant feedback delivery                                  │   │  │
│  │  └──────────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└───────────────────────┬──────────────────────┬────────────────────┬─────────┘
                        │                      │                    │
                        ▼                      ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────┐   ┌──────────────────────────────┐       │
│  │     Google Gemini API         │   │       MongoDB Atlas          │       │
│  │  ┌────────────────────────┐   │   │  ┌────────────────────────┐ │       │
│  │  │  • Question Generation │   │   │  │  • Users Collection    │ │       │
│  │  │  • Response Evaluation │   │   │  │  • Sessions Collection │ │       │
│  │  │  • Feedback Generation │   │   │  │  • Feedback Collection │ │       │
│  │  │  • Difficulty Adaption │   │   │  │  • Questions Collection│ │       │
│  │  └────────────────────────┘   │   │  └────────────────────────┘ │       │
│  │                                │   │                              │       │
│  │  Model: gemini-flash-latest   │   │  Fallback: In-Memory Store  │       │
│  └──────────────────────────────┘   └──────────────────────────────┘       │
│                                                                               │
│  ┌──────────────────────────────┐   ┌──────────────────────────────┐       │
│  │    OpenAI Whisper API         │   │    Google Calendar API       │       │
│  │      (Not Active)             │   │      (Not Active)            │       │
│  │  • Audio Transcription        │   │  • Interview Scheduling      │       │
│  └──────────────────────────────┘   └──────────────────────────────┘       │
│                                                                               │
│  ┌──────────────────────────────┐                                           │
│  │    Google Sheets API          │                                           │
│  │      (Not Active)             │                                           │
│  │  • Data Export                │                                           │
│  └──────────────────────────────┘                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ 1. Opens Application
       ▼
┌──────────────────────────────────────────┐
│         Landing Page                      │
│  • View Features                          │
│  • Navigate to Auth/Dashboard             │
└──────┬───────────────────────────────────┘
       │
       │ 2. Register/Login
       ▼
┌──────────────────────────────────────────┐
│         Authentication Flow               │
│  Frontend                    Backend      │
│  ┌──────────┐               ┌──────────┐ │
│  │ Submit   │──HTTP POST──▶ │  Auth    │ │
│  │Credentials               │Controller │ │
│  └──────────┘               └────┬─────┘ │
│       ▲                          │        │
│       │                          ▼        │
│       │                    ┌──────────┐  │
│       │                    │   Auth   │  │
│       │                    │ Service  │  │
│       │                    └────┬─────┘  │
│       │                         │        │
│       │                         ▼        │
│       │                    ┌──────────┐  │
│       │                    │ MongoDB  │  │
│       │                    │   User   │  │
│       │◀────JWT Token──────┤   Data   │  │
│       │                    └──────────┘  │
└───────┼──────────────────────────────────┘
        │
        │ 3. Access Dashboard
        ▼
┌──────────────────────────────────────────┐
│         Dashboard Page                    │
│  • View past sessions                     │
│  • View scores & feedback                 │
│  • Start new interview                    │
└──────┬───────────────────────────────────┘
       │
       │ 4. Start Interview
       ▼
┌──────────────────────────────────────────────────────────────┐
│              Interview Flow (Real-time)                       │
│                                                                │
│  Frontend              WebSocket           Backend            │
│  ┌──────────┐         Connection          ┌──────────┐       │
│  │Interview │◀────────────────────────────▶│ Socket   │       │
│  │   Page   │                              │   IO     │       │
│  └────┬─────┘                              └────┬─────┘       │
│       │                                         │             │
│       │ 5. Send Answer                          │             │
│       │────────────────────────────────────────▶│             │
│       │                                         ▼             │
│       │                                   ┌──────────┐       │
│       │                                   │Interview │       │
│       │                                   │ Service  │       │
│       │                                   └────┬─────┘       │
│       │                                        │             │
│       │                                        ▼             │
│       │                                   ┌──────────┐       │
│       │                                   │   GPT    │       │
│       │                                   │ Service  │       │
│       │                                   └────┬─────┘       │
│       │                                        │             │
│       │                                        ▼             │
│       │                                   ┌──────────┐       │
│       │                                   │  Gemini  │       │
│       │                                   │   API    │       │
│       │                                   └────┬─────┘       │
│       │                                        │             │
│       │                         Returns:       │             │
│       │                         • Next Question              │
│       │                         • Feedback                   │
│       │                         • Score Delta                │
│       │                                        │             │
│       │                                        ▼             │
│       │                                   ┌──────────┐       │
│       │                                   │ Scoring  │       │
│       │                                   │ Service  │       │
│       │                                   └────┬─────┘       │
│       │                                        │             │
│       │                                        ▼             │
│       │                                   ┌──────────┐       │
│       │                                   │ MongoDB  │       │
│       │                                   │ Session  │       │
│       │                                   │   Save   │       │
│       │                                   └────┬─────┘       │
│       │                                        │             │
│       │ 6. Receive Response                    │             │
│       │◀───────────────────────────────────────┘             │
│       │   • Question                                         │
│       │   • Feedback                                         │
│       │   • Updated Score                                    │
│       │                                                      │
│       │ 7. Repeat until Complete                            │
│       │                                                      │
└───────┴──────────────────────────────────────────────────────┘
       │
       │ 8. Complete Session
       ▼
┌──────────────────────────────────────────┐
│      Final Results Display                │
│  • Total Score & Percentage               │
│  • Comprehensive Feedback                 │
│  • Performance Summary                    │
└───────────────────────────────────────────┘
```

## Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Input                                                      │
│      ↓                                                           │
│  AuthPage Component                                              │
│      ↓                                                           │
│  apiClient.login()                                               │
│      ↓                                                           │
│  Backend: /api/auth/login                                        │
│      ↓                                                           │
│  authController.login()                                          │
│      ↓                                                           │
│  authService.validateCredentials()                               │
│      ↓                                                           │
│  MongoDB: Find User                                              │
│      ↓                                                           │
│  bcrypt: Verify Password                                         │
│      ↓                                                           │
│  jwt: Generate Token                                             │
│      ↓                                                           │
│  Return: { token, user }                                         │
│      ↓                                                           │
│  Frontend: Store in Zustand                                      │
│      ↓                                                           │
│  Navigate to Dashboard                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Interview Flow                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Start Interview                                                 │
│      ↓                                                           │
│  InterviewPage: handleStart()                                    │
│      ↓                                                           │
│  API: POST /api/interview/start                                  │
│      ↓                                                           │
│  interviewController.startSession()                              │
│      ↓                                                           │
│  interviewService.startInterviewSession()                        │
│      ↓                                                           │
│  gptService.runInterviewAgent()                                  │
│      ↓                                                           │
│  Gemini API: Generate first question                             │
│      ↓                                                           │
│  Return: { sessionId, question, difficulty }                     │
│      ↓                                                           │
│  Frontend: Display Question                                      │
│      ↓                                                           │
│  User: Submit Answer                                             │
│      ↓                                                           │
│  WebSocket: emit('interview:message')                            │
│      ↓                                                           │
│  Backend: socket.on('interview:message')                         │
│      ↓                                                           │
│  interviewService.processCandidateMessage()                      │
│      ↓                                                           │
│  gptService: Evaluate + Generate Next                            │
│      ↓                                                           │
│  scoringService.updateScores()                                   │
│      ↓                                                           │
│  Save to MongoDB / In-Memory                                     │
│      ↓                                                           │
│  WebSocket: emit('interview:update')                             │
│      ↓                                                           │
│  Frontend: Update UI                                             │
│      ↓                                                           │
│  Repeat until Complete                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌────────────────────────────────────────────────────────────┐
│                    Frontend Stack                           │
├────────────────────────────────────────────────────────────┤
│  • React 18                    (UI Library)                │
│  • Vite                        (Build Tool)                │
│  • Tailwind CSS                (Styling)                   │
│  • Zustand                     (State Management)          │
│  • React Router                (Routing)                   │
│  • Axios                       (HTTP Client)               │
│  • Socket.io Client            (WebSocket)                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    Backend Stack                            │
├────────────────────────────────────────────────────────────┤
│  • Node.js 18+                 (Runtime)                   │
│  • Express.js                  (Web Framework)             │
│  • Socket.io                   (WebSocket Server)          │
│  • Mongoose                    (MongoDB ODM)               │
│  • JWT (jsonwebtoken)          (Authentication)            │
│  • bcryptjs                    (Password Hashing)          │
│  • Winston                     (Logging)                   │
│  • Multer                      (File Upload)               │
│  • Helmet                      (Security)                  │
│  • CORS                        (Cross-Origin)              │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  External Services                          │
├────────────────────────────────────────────────────────────┤
│  • Google Gemini Flash         (AI Model)                  │
│  • MongoDB Atlas               (Database)                  │
│  • OpenAI Whisper              (Audio - Inactive)          │
│  • Google Calendar API         (Scheduling - Inactive)     │
│  • Google Sheets API           (Export - Inactive)         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  Deployment Stack                           │
├────────────────────────────────────────────────────────────┤
│  • Docker                      (Containerization)          │
│  • Render                      (Cloud Platform)            │
│  • Railway                     (Cloud Platform)            │
│  • Vercel                      (Frontend Hosting)          │
│  • GitHub                      (Version Control)           │
└────────────────────────────────────────────────────────────┘
```

---

**Built with ❤️ using React, Node.js, and Google Gemini AI**
