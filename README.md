# PokerJoker

PokerJoker is a real-time, browser-based Texas Hold'em game. Players can create a room or join an open lobby, then play together with live game updates, chat, and reactions.

## Features

- Create and join multiplayer poker rooms (up to 9 players per room).
- Play Texas Hold'em with server-managed game state and turn timers.
- Chat with other players and send reactions during a game.
- View a built-in poker guide with hand rankings and game basics.
- Reconnect to a room using the player and room information saved in the browser.

## Tech stack

- [Next.js](https://nextjs.org/) and React for the web app
- TypeScript and Tailwind CSS
- Express and Socket.IO for the real-time game server

## Requirements

- Node.js and npm

## Getting started

The web app and game server are separate Node projects. Install dependencies for both:

```bash
npm install
npm --prefix backend install
```

### Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

Create `backend/.env`:

```env
FRONTEND_URL=http://localhost:3000
```

`NEXT_PUBLIC_SOCKET_URL` is the Socket.IO server URL used by the browser. `FRONTEND_URL` is the web app origin allowed by the backend's CORS configuration. These values should match the URLs where each service is running.

### Run locally

Start the backend in one terminal:

```bash
npm --prefix backend run dev
```

Start the web app in another terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create a room and share it with other players; rooms in the lobby appear in the join list.

## Scripts

### Web app (project root)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the web app for production |
| `npm run start` | Start the production web app |
| `npm run lint` | Run ESLint |

### Backend (`backend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Run the backend with TypeScript watch mode |
| `npm run build` | Compile the backend into `backend/dist/` |
| `npm run start` | Start the compiled backend |

The backend listens on port `3001`. Its `GET /health` endpoint returns a basic health status.

## Project structure

```text
app/          Next.js routes and layouts
components/   Game UI, table, chat, guide, and shared components
lib/          Client-side game and player helpers
public/       Card art, images, fonts, and audio
backend/      Express, Socket.IO, and game logic
```

## Notes

- Room and game state are held in backend memory. Restarting the backend clears active rooms and games.
- The profile page is a placeholder for future profile and analytics features.
