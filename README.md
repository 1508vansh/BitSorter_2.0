# BitSorter 🧠

Live demo: https://bitsorter.vercel.app/  
Repo: https://github.com/1508vansh/BitSorter_2.0

BitSorter is a full‑stack, real‑time competitive coding & learning platform that blends DSA visualizers, AI assistance, live code execution, and 1v1 multiplayer rooms into a single polished experience. Built with the MERN stack and production‑grade pieces (Redis, Cloudinary, Judge0, Google Gemini, Socket.IO), BitSorter is designed to showcase end‑to‑end engineering: from UI/UX to low‑latency systems and sandboxed code execution.

Why this project gets noticed (recruiter‑friendly)
- End‑to‑end ownership: frontend, backend, realtime, caching, and deployment.
- Real‑time engineering: Socket.IO + Redis adapter for cross‑instance, low‑latency multiplayer.
- Practical infra: Judge0 for secure sandboxed code execution and Google Gemini for contextual AI help.
- Learning focus: animated DSA visualizers + an AI assistant per problem to speed learning and debugging.
- Product polish: Tailwind CSS + DaisyUI, subtle micro‑animations, and Cloudinary CDN for media.

Badges
[![Live](https://img.shields.io/website?label=Live&url=https%3A%2F%2Fbitsorter.vercel.app)](https://bitsorter.vercel.app/) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Table of contents
- About
- Core features
- Tech stack
- Architecture overview
- Resume-ready bullets
- Screenshots & micro‑animations
- Quick local setup (with Redis, Judge0 & Gemini)
- Environment variables
- API & WebSocket quick reference
- How to demo BitSorter to recruiters (30–60s)
- Testing, linting & CI
- Deployment notes
- Contributing / License / Contact
- Roadmap

About
BitSorter lets users solve problems, visualize algorithms with animated DSA visualizers, get AI help inline (Google Gemini), execute code in a secure sandbox (Judge0), and create private 1v1 rooms to compete with friends — winner declared instantly. The focus is teaching-through-practice and real‑time competitive ergonomics.

Core features
- Real‑time 1v1 competitive rooms
  - Create/join private rooms, live code execution, synchronized state and instant winner declaration.
  - Low latency using Socket.IO and Redis adapter for pub/sub across instances.
- Live code execution (Judge0)
  - Send code to Judge0 API for secure sandboxed execution across multiple languages.
- AI assistant per problem (Google Gemini)
  - Contextual chat/help that explains problem statements, gives hints, and helps debug solutions.
- DSA Visualizers
  - Animated visualizations for algorithms (sorting, trees, graphs) with play/pause/step controls.
- Media & profiles
  - Users can upload profile images and assets to Cloudinary (fast CDN delivery).
- Clean frontend & UX
  - React + Tailwind CSS + DaisyUI for a responsive, recruiter‑friendly interface.

Tech stack
- Frontend: React, Tailwind CSS, DaisyUI, Axios, Socket.IO (client)
- Backend: Node.js, Express, Socket.IO (server), Redis (adapter & cache), Mongoose (MongoDB)
- Database: MongoDB (Atlas recommended)
- Media & CDN: Cloudinary
- Code Execution: Judge0 API (sandboxed)
- AI: Google Gemini API
- Dev tooling: dotenv, nodemon (dev), ESLint, Prettier

Architecture overview
- client/ — React SPA (pages, components, hooks, services)
- server/ — Express API + Socket.IO server (controllers, routes, models, services)
- Redis — Socket.IO adapter for pub/sub; ephemeral match/session cache and leaderboards
- Cloudinary — media uploads & CDN
- Judge0 — remote sandbox to execute user-submitted code safely
- Google Gemini — AI assistant for problem context and hints

Resume‑ready bullets
- Built a scalable real‑time multiplayer platform using Socket.IO with Redis adapter to synchronize events across instances.
- Integrated Judge0 for secure multi‑language code execution and Google Gemini for problem-specific AI assistance.
- Implemented interactive DSA visualizers to improve learning outcomes and built a responsive React UI with Tailwind + DaisyUI.

Screenshots & micro‑animations (polish, not flash)
- Recommended images: Home/dashboard, problem page with visualizer, match lobby, live match.
- Micro‑animations:
  - "Match found" card: gentle scale + fade (0.12s ease-out).
  - Winner confetti: lightweight Lottie or CSS particles (trigger only on match end).
- Icon set: Heroicons / Feather (SVG) for crisp, minimal visuals.
- Tip: keep animations on major state changes only to avoid distraction.

Quick local setup — includes Redis, Judge0 & Google Gemini
Prereqs
- Node.js >= 16
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Redis server (local or hosted)
- Cloudinary account
- Judge0 API endpoint / key (or use public Judge0 with rate limits)
- Google Cloud project / Gemini API key (or equivalent access)

Clone
git clone https://github.com/1508vansh/BitSorter_2.0.git
cd BitSorter_2.0

Install
# Server
cd server
npm install

# Client
cd ../client
npm install

Environment variables (server/.env)
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret           # if auth is used
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret
- REDIS_URL=redis://[:password@]host:port
- JUDGE0_URL=https://judge0.example.com
- JUDGE0_API_KEY=your_judge0_key      # if using a private/paid Judge0 instance
- GEMINI_API_KEY=your_google_gemini_api_key
- CLIENT_URL=http://localhost:3000
- PORT=5000

Run (dev)
# Start Redis (local): e.g., `redis-server`
# Server
cd server
npm run dev        # typically starts nodemon on PORT

# Client
cd ../client
npm run start      # React dev server (http://localhost:3000)

Run judge/execution flow (high level)
1. Client sends code + language to backend.
2. Server forwards to Judge0 (JUDGE0_URL) with any required options.
3. Judge0 executes code in sandbox and returns stdout/stderr/status.
4. Server relays results back to clients in match or problem view.

Redis & Socket.IO notes
- Use Redis adapter to enable horizontal scaling:
  - Example: io.adapter(createAdapter(pubClient, subClient))
- Store ephemeral match state/leaderboard counters in Redis to avoid DB hot paths.

API & WebSocket quick reference
HTTP (examples)
- POST /api/upload — upload media metadata (server uses Cloudinary)
- POST /api/matches — create a match
- GET /api/matches/:id — get match data
- POST /api/execute — send code to Judge0 and get result

Socket events (examples)
- connection / disconnect
- join-room { roomId, user }
- player-code { codeSnapshot }
- player-move { action }
- sync-state { fullState }
- match-end { result }

How to demo BitSorter to recruiters (30–60s)
1. Live demo: Open the live link and show problem list and DSA visualizer animation.
2. Open two tabs, create/join the same private room — run a live code execution and show instant sync and winner flow.
3. Point to the server code snippet that wires Socket.IO with Redis and show Judge0 integration for execution.
4. Briefly mention Gemini AI integration: how it provides hints and debugging advice per problem.

Testing, linting & CI
- Testing: Jest + React Testing Library (frontend), Supertest (API)
- Lint/Format: ESLint + Prettier
- CI: add GitHub Actions to run lint/test on PRs

Deployment notes
- Frontend: Vercel (connected to repo) for automatic builds & CDN
- Backend: Render / Railway / Heroku / DigitalOcean App Platform
- Redis: Managed Redis (Upstash, Redis Cloud) for reliability
- Judge0: use a hosted/managed Judge0 or self‑host (beware resources and security)
- Google Gemini: ensure production credentials and quotas are set in Google Cloud

Contributing
- Fork → create feature branch → open PR with screenshots & description.
- Add .env.example documenting required environment variables.
- Keep PRs small and include tests for new server logic.

Security & best practices
- Never commit .env or keys. Add .env to .gitignore.
- Validate all inputs server-side before sending to Judge0.
- Rate limit code execution and file uploads to avoid abuse.
- Use Helmet and CORS for production safety headers.

Small UX code snippets (suggested)
- Tailwind micro-animation for match card:
```css
/* add to your css or tailwind utilities */
.match-card {
  @apply transform transition duration-150 ease-out;
}
.match-card:hover { transform: translateY(-4px) scale(1.01); }
```
- Simple Lottie integration idea (React):
```jsx
import Lottie from 'react-lottie';
import confettiData from './animations/confetti.json';

<Lottie options={{ animationData: confettiData, loop: false, autoplay: true }} />
```

Roadmap & ideas
- Ladder matchmaking / ELO ranking
- Spectator mode & replay playback
- Auto-hints from Gemini with code trace integration
- Expand visualizers: dynamic graph algorithms, DP state trees

License
MIT — see LICENSE

Contact
Author: 1508vansh  
GitHub: https://github.com/1508vansh  
Live demo: https://bitsorter.vercel.app/  
Email: (add your preferred contact email)
