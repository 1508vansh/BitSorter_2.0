# BitSorter 🧠

Live demo: https://bitsorter.vercel.app/  
Repo: https://github.com/1508vansh/BitSorter_2.0

BitSorter is a full‑stack, real‑time competitive coding & learning platform that blends DSA visualizers, AI assistance, live code execution, and 1v1 multiplayer rooms into a single polished experience. Built with the MERN stack and production‑grade pieces (Redis, Cloudinary, Judge0, Google Gemini, Socket.IO, Redux (State Management), BitSorter is designed to showcase end‑to‑end engineering: from UI/UX to low‑latency systems and sandboxed code execution, as well as user & admin login.

What makes this project cool - 
- End‑to‑end ownership: frontend, backend, realtime, caching, and deployment.
- Real‑time engineering: Socket.IO + Redis adapter for cross‑instance, low‑latency multiplayer.
- Practical infra: Judge0 for secure sandboxed code execution and Google Gemini for contextual AI help.
- Learning focus: animated DSA visualizers + an AI assistant per problem to speed learning and debugging.
- Product polish: Tailwind CSS + DaisyUI, subtle micro‑animations, and Cloudinary CDN for media.

Badges
[![Live](https://img.shields.io/website?label=Live&url=https%3A%2F%2Fbitsorter.vercel.app)](https://bitsorter.vercel.app/) 

Table of contents
- About
- Core features
- Tech stack
- Architecture overview
- Quick local setup (with Redis, Judge0 & Gemini)
- Environment variables
- API & WebSocket quick reference
- How to demo BitSorter to recruiters (30–60s)
- Deployment notes
- Contribution & Security
- Contact

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
### 👑 Admin Features

BitSorter includes a dedicated **Admin Panel** for managing coding problems efficiently. Admins have full control over the platform’s problem database with the following capabilities:

- **Create New Problems** – Add new coding problems with details like title, description, difficulty, tags, test cases, and starter code.  
- **Update Existing Problems** – Edit problem details, modify test cases, or improve problem statements without affecting existing submissions.  
- **Delete Problems** – Safely remove outdated or duplicate problems from the platform.  
- **Real-Time Sync** – All changes reflect instantly across the platform, ensuring users always access the most updated problems.

> These features ensure a seamless workflow for maintaining high-quality, diverse, and well-structured coding challenges.


Tech stack
- Frontend: React, Tailwind CSS, DaisyUI, Axios, Redux, Socket.IO (client)
- Backend: Node.js, Express, Socket.IO (server), Redis (adapter & cache), Mongoose (MongoDB)
- Database: MongoDB & (mongodb atlas)
- Media & CDN: Cloudinary
- Code Execution: Judge0 API 
- AI: Google Gemini API
- Dev tooling: dotenv, nodemon (dev), Vs Code, Prettier
  
Architecture overview
- client/ — React SPA (pages, components, hooks, services)
- server/ — Express API + Socket.IO server (controllers, routes, models, services)
- Redis — Socket.IO adapter for pub/sub; ephemeral match/session cache and leaderboards
- Cloudinary — media uploads & CDN
- Judge0 — remote sandbox to execute user-submitted code safely
- Google Gemini — AI assistant for problem context and hints

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
## Backend variables - 
PORT = 5000
DB_CONNECTION_STRING 
JWT_SECRET_KEY 
REDIS_PASS 
GOOGLE_API_KEY 
GOOGLE_CLIENT_ID 
GOOGLE_CLIENT_SECRET
CLOUD_NAME 
CLOUD_KEY 
CLOUD_SECRET 

## Frontend variables - 
GOOGLE_CLIENT_ID

# Server
cd "BitSorter Backend"
node src/index.js

# Client
cd "BitSorter Frontend"
npm run start      # React dev server (http://localhost:3000 or http://localhost:1234)

Run judge/execution flow (high level)
1. Client sends code + language to backend.
2. Server forwards to Judge0 (JUDGE0_URL) with any required options.
3. Judge0 executes code in backend and returns stdout/stderr/status.
4. Server relays results back to clients in match or problem view.

Redis & Socket.IO notes
- Used Redis to store blocked tokens and Room Data (1v1 Arena)
- On the backend, **Socket.IO** is used to manage real-time communication for the 1v1 Arena — handling room creation, player connections, live updates, and winner broadcasts seamlessly through event-driven architecture.

API & WebSocket quick reference
HTTP (examples) (You can take a look at backend apis in project)
- POST /api/upload — upload media metadata (server uses Cloudinary)
- POST /api/createProblem — create a match
- GET /api/matches/:id — get match data
- POST /api/execute — send code to Judge0 and get result

Socket events (examples)
- connection / disconnect
- join-room { roomId, user }
- player-code { codeSnapshot }
- player-move { action }
- sync-state { fullState }
- startCompetition
- endCompetition { result }

How to demo BitSorter to recruiters (30–60s)
1. Live demo: Open the live link and show problem list and DSA visualizer animation.
2. Open two tabs, create/join the same private room — run a live code execution and show instant sync and winner flow.
3. Point to the server code snippet that wires Socket.IO with Redis and show Judge0 integration for execution.
4. Briefly mention Gemini AI integration: how it provides hints and debugging advice per problem.

Deployment notes
- Frontend: Vercel (connected to repo) for automatic builds & CDN
- Backend: AWS / Railway / Heroku / DigitalOcean App Platform
- Redis: Managed Redis for reliability
- Judge0: use a hosted/managed Judge0 or self‑host (beware resources and security)
- Google Gemini: ensure production credentials and quotas are set in Google Cloud

Contributing
- Fork → create feature branch → open PR with screenshots & description.
- Add .env.example documenting required environment variables.
- Keep PRs small for new server logic.

Security & best practices
- Never commit .env or keys. Add .env to .gitignore.
- Validate all inputs server-side before sending to Judge0.
- Rate limit code execution and file uploads to avoid abuse.
- Use CORS for production safety headers.

License
MIT — see LICENSE

Contact
Author: 1508vansh  
GitHub: https://github.com/1508vansh  
Live demo: https://bitsorter.vercel.app/  
Email: vanshsoni13062005@gmail.com
