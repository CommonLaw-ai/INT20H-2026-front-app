# INT20H 2026 — Frontend

React + TypeScript frontend for the AI-powered customer support system.

## Stack

- React 19 + TypeScript
- Vite
- Material UI (MUI)
- React Router

## Pages

**Client**
- `/chat` — new chat form (enter email + initial message)
- `/chat/:id` — conversation view

**Back-office**
- `/bo/dashboard` — dashboard with chats, tickets, action requests, users
- `/bo/chats` — full chats list
- `/bo/chat/:id` — chat detail with conversation and action requests
- `/bo/settings` — manage available agent actions

## Setup

### Requirements

- Node.js 18+
- Backend (back-app) running — see [INT20H-2026-back-app](https://github.com/CommonLaw-ai/INT20H-2026-back-app)

### Install

```bash
npm install
```

### Configure API

The app proxies all `/api/*` requests to the backend. By default points to `http://localhost:8001`.

To change the backend URL, edit `vite.config.ts`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8001',  // change this
  }
}
```

Or set an environment variable in `.env.local`:

```
VITE_API_BASE_URL=http://localhost:8001
```

### Run

```bash
npm run dev
```

App will be available at `http://localhost:5173`.

### Build

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
