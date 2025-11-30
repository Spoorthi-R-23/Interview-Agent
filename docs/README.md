# Interview Agent Project Guide

## 1. Quick Start

### Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill secrets
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run dev`

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.

## 2. Environment Variables

See `backend/.env.example` and `frontend/.env.example` for full lists. Key values:

- MongoDB Atlas string (`MONGO_URI`)
- JWT secret (`JWT_SECRET`)
- OpenAI key (`OPENAI_API_KEY`)
- Google service account credentials (`GOOGLE_*`)
- Client URL (`CLIENT_URL`) and upload directory (`UPLOAD_DIR`)
- Socket URL (`VITE_SOCKET_URL`) and API base (`VITE_API_BASE`)

## 3. REST Endpoints

### Auth (`/api/auth`)

- `POST /register` → `{ name, email, password }`
- `POST /login` → `{ email, password }`
- `GET /me` (Bearer token)

### Interview (`/api/interview`)

- `POST /start` → begin session, returns `sessionId`, first question
- `POST /respond` → send text reply
- `POST /respond-audio` → multipart `{ audio, sessionId }`
- `POST /complete` → finalize scoring summary
- `POST /feedback` → save structured feedback items
- `GET /sessions` → list candidate sessions
- `GET /:sessionId` → single session detail

### Calendar (`/api/calendar`)

- `POST /schedule` → create Google Calendar event
- `DELETE /schedule/:eventId` → remove event

### Sheets (`/api/sheets`)

- `POST /publish` → append summary row to Google Sheets

## 4. Socket Events

- Client emits `interview:join` `{ sessionId }`
- Client emits `interview:message` `{ sessionId, message }`
- Server broadcasts `interview:update` `{ question, feedback, score, maxScore, overallSummary, difficulty }`
- Server emits `interview:error` on failures

## 5. AI Agent Prompt

Located in `backend/src/services/gptService.js` (`INTERVIEW_AGENT_SYSTEM_PROMPT`).

## 6. Deployment Guide

### Render (Backend)

1. Create new Web Service, connect repo, select `backend/`
2. Build command: `npm install && npm run build` (not needed for pure JS) or `npm install`
3. Start command: `npm run start`
4. Set environment variables (Render dashboard)
5. Add MongoDB Atlas connection string; enable Redis/socket adapter if scaling horizontally
6. Add persistent disk or S3 if storing audio longer than transient processing

### Vercel (Frontend)

1. Import repo, set root to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_SOCKET_URL` to Render backend URL and `VITE_API_BASE` to same `/api`

### MongoDB Atlas

1. Create free cluster, load sample dataset if desired
2. Create database user and IP whitelist (Render/Vercel IPs)
3. Update `MONGO_URI`

### Google APIs

1. Generate service account with Calendar + Sheets scopes
2. Share target calendar and sheet with service account email
3. Paste private key into `.env` (escaped newlines)
4. Populate `GOOGLE_*` values

## 7. Improvements Backlog

1. Add request validation (Zod/Joi) and stricter rate limiting per route
2. Persist Socket.io sessions via Redis for horizontal scaling
3. Implement interviewer tone presets and auto-scheduling workflows (calendar invites)
4. Granular analytics dashboards (per competency heatmaps)
5. Integrate email notifications via SendGrid/Postmark for summaries

## 8. Testing

- Unit test GPT orchestration and scoring logic (Jest)
- Integration test auth and interview endpoints (Supertest)
- Component tests for chat UI (Vitest + React Testing Library)
- Manual QA: login, start session, send socket message, upload audio stub
