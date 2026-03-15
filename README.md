# INT20H 2026 — Frontend

> Part of the **AI Support Agent** system built for the INT20H 2026 hackathon.

## What is this project?

Modern subscription services generate thousands of user events every day — failed logins, duplicate charges, suspicious activity. Investigating each one manually is slow and expensive.

This project automates that process with an AI agent that:

1. **Monitors logs** — scans user activity every 60 seconds looking for anomalies (duplicate charges, multiple failed logins, etc.)
2. **Initiates conversations** — when an anomaly is detected, automatically opens a support chat and sends the user a first message explaining the situation
3. **Conducts interviews** — an LLM-powered agent talks to the user in their language, asks clarifying questions, and decides what to do
4. **Takes action** — depending on the user's response, the agent either resolves the issue automatically (issues a refund, resets a password) or escalates to a human operator
5. **Back-office dashboard** — human operators can monitor all chats, review AI decisions, approve or reject action requests, and manage the agent's available actions

## System Architecture

```
┌─────────────┐     messages      ┌─────────────────┐
│   Frontend  │ ───────────────►  │    Back App      │
│  (React)    │ ◄───────────────  │   (port 8001)    │
└─────────────┘    chat replies   └────────┬─────────┘
                                           │ delegates to
                                           ▼
                                  ┌─────────────────┐
                                  │   Agent API      │
                                  │   (port 8000)    │
                                  │                  │
                                  │  ┌─────────────┐ │
                                  │  │  Analyzer   │ │  ◄── runs every 60s
                                  │  └─────────────┘ │
                                  │  ┌─────────────┐ │
                                  │  │ Chat Agent  │ │  ◄── LLM + RAG
                                  │  └─────────────┘ │
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   PostgreSQL     │
                                  │   + pgvector     │
                                  └─────────────────┘
                                           │
                                  ┌─────────────────┐
                                  │     Ollama       │
                                  │  llama3.1:8b     │
                                  └─────────────────┘
```

## Repos

| Repo | Description |
|------|-------------|
| [INT20H-2026-back-app](https://github.com/CommonLaw-ai/INT20H-2026-back-app) | Main backend — chats, users, anomalies, back-office API |
| [INT20H-2026-agent-api](https://github.com/CommonLaw-ai/INT20H-2026-agent-api) | AI service — anomaly detection, LLM agent, RAG |
| [INT20H-2026-front-app](https://github.com/CommonLaw-ai/INT20H-2026-front-app) | Frontend — client chat UI + back-office dashboard |

---

## Frontend

React + TypeScript frontend with two sides: a client chat interface for end users, and a back-office dashboard for human operators.

### Stack

- React 19 + TypeScript
- Vite
- Material UI (MUI)
- React Router

### Pages

**Client**
- `/chat` — new chat form (enter email + initial message)
- `/chat/:id` — conversation view

**Back-office**
- `/bo/dashboard` — dashboard with chats, tickets, action requests, users
- `/bo/chats` — full chats list
- `/bo/chat/:id` — chat detail with conversation and action requests
- `/bo/settings` — manage available agent actions

### Setup

#### Requirements

- Node.js 18+
- Backend (back-app) running — see [INT20H-2026-back-app](https://github.com/CommonLaw-ai/INT20H-2026-back-app)

#### Install

```bash
npm install
```

#### Configure API

The app proxies all `/api/*` requests to the backend. By default points to `http://localhost:8001`.

To change the backend URL, edit `vite.config.ts`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8001',  // change this
  }
}
```

#### Run

```bash
npm run dev
```

App will be available at `http://localhost:5173`.

#### Build

```bash
npm run build
```

## API

All requests go through `/api` prefix which is stripped before forwarding to the backend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Create chat (`{ email, text }`) |
| GET | `/api/chat/:id` | Get chat with messages |
| POST | `/api/chat/:id` | Send message (`{ text }`) |
| GET | `/api/bo/chats` | List all chats |
| GET | `/api/bo/chat/:id` | Chat detail |
| PATCH | `/api/bo/chat/:id` | Escalate chat |
| GET | `/api/bo/actions` | List actions |
| POST | `/api/bo/action` | Create action |
| PATCH | `/api/bo/action` | Update action |
| GET | `/api/bo/tickets` | List tickets |
| GET | `/api/bo/users` | List users |
| GET | `/api/bo/action_requests` | List action requests |
| PATCH | `/api/bo/action_request/:id` | Approve/reject action request |
