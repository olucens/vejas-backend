# Vejas Backend

NestJS backend for **Vejas** — synchronized YouTube watching in shared rooms.
A room admin drives playback (play/pause/seek, playlist), viewers stay in sync
and chat in real time. Chat is ephemeral: messages are only broadcast over
WebSocket (the last 50 are kept in memory so newcomers see recent context).

## Stack

- NestJS 11 + Socket.IO gateway
- Auth: verification of **Supabase** JWT access tokens (`jose`) — the frontend
  keeps using Supabase Auth, this server only verifies tokens
- Storage: in-memory (`Map`), no database — rooms disappear on restart

## Run

```bash
npm install
cp .env.example .env   # adjust values
npm run start:dev      # http://localhost:3000
```

### Environment variables

| Variable | Description |
|---|---|
| `PORT` | HTTP/WS port (default `3000`) |
| `CORS_ORIGIN` | Allowed frontend origin (default `*`) |
| `SUPABASE_URL` | Supabase project URL — JWTs are verified via its JWKS endpoint |
| `SUPABASE_JWT_SECRET` | Optional legacy HS256 secret; takes precedence over JWKS |

## REST API

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | – | Health check |
| GET | `/rooms` | – | List rooms (newest first) |
| GET | `/rooms/:id` | – | Room with full state (404 if missing) |
| POST | `/rooms` | Bearer | Create a room; creator becomes admin |
| DELETE | `/rooms/:id` | Bearer | Delete a room (admin only) |

`POST /rooms` body: `{ "name": string (3–60), "description"?: string, "coverUrl"?: url }`

## WebSocket protocol (Socket.IO)

Connect with the Supabase access token:

```ts
io(SOCKET_URL, { auth: { token: session.access_token } });
```

Sockets without a valid token are disconnected.

### Client → server

| Event | Payload | Who |
|---|---|---|
| `joinRoom` | `{ roomId }` | anyone |
| `chatMessage` | `{ roomId, text }` | room members |
| `playbackUpdate` | `{ roomId, isPlaying, currentTime }` | admin only |
| `playlistAdd` | `{ roomId, videoId, url }` | admin only |
| `playlistSelect` | `{ roomId, index }` | admin only |
| `playlistRemove` | `{ roomId, id }` | admin only |

### Server → client

| Event | Payload |
|---|---|
| `roomState` | full room + state snapshot (sent after `joinRoom`) |
| `playbackUpdate` | `{ isPlaying, currentTime }` |
| `playlistUpdate` | room state (playlist + currentIndex) |
| `chatMessage` | `{ id, authorId, author, text, sentAt }` |
| `viewersCount` | `{ count }` |
| `exception` | `{ message }` — WsException errors |

## Tests

```bash
npm test        # unit (RoomsService)
npm run test:e2e
```
