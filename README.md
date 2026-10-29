# Farmer Market App

A React Native mobile app that gives farmers direct market access, so they can reach buyers without middlemen. It has an Expo mobile frontend and a Bun backend with authentication, a PostgreSQL database and image uploads.

## Features

<!-- TODO: replace with your real feature list -->
- Sign in with Google or email (Better Auth)
- Farmer product listings with image uploads (Cloudinary)
- _Add your other features here (browse/search products, orders, profiles, etc.)_

## Tech stack

| Layer | Technology |
|---|---|
| Mobile app | React Native, Expo (Expo Go for testing), TypeScript |
| Backend | Bun, TypeScript |
| Database | PostgreSQL |
| Authentication | Better Auth, Google OAuth |
| Image storage | Cloudinary |

## Project structure

```
farmer-market-app/
├── app-frontend/   # Expo / React Native app
└── backend/        # Bun API server
```

## Installation & setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [Expo Go](https://expo.dev/go) on your phone
- PostgreSQL

### Clone the repository

```bash
git clone https://github.com/snehalfulari6-alt/farmer-market-app.git
cd farmer-market-app
```

### Environment configuration

The phone talks to the backend over your local network, so the IP address must match your current Wi-Fi network. Find your machine's local IP (`ipconfig` on Windows, `ifconfig` / `ip a` on macOS/Linux) and update the following.

1. **Frontend API URL**: in `app-frontend/app.json`, set
   ```json
   "apiUrl": "http://YOUR_LOCAL_IP:3000"
   ```
2. **Auth client**: in `app-frontend/lib/auth-client.ts`, replace the base URL with
   ```
   http://YOUR_LOCAL_IP:3000
   ```
3. **Expo trusted origin**: in `backend/src/lib/auth.ts`, replace the Expo origin with
   ```
   exp://YOUR_LOCAL_IP:8081
   ```
4. **Environment variables**: create `backend/.env`:
   ```env
   DATABASE_URL=
   BETTER_AUTH_SECRET=
   BETTER_AUTH_URL=http://localhost:3000

   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=

   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
   Keep `BETTER_AUTH_URL=http://localhost:3000` for local development unless you intentionally expose the backend to other networks.

> Repeat the IP changes whenever you switch machines or Wi-Fi networks, otherwise the app cannot reach the backend.

## Running the app

**Backend**

```bash
cd backend
bun install
bun run dev
```

**Mobile app**

```bash
cd app-frontend
npm install
npx expo start
```

Scan the QR code with Expo Go on a phone connected to the same Wi-Fi network.

## API endpoints

Base URL: `http://YOUR_LOCAL_IP:3000`

<!-- TODO: fill in from your backend routes. Replace the examples below. -->

| Method | Endpoint | Description |
|---|---|---|
| `*` | `/api/auth/*` | Authentication (sign-in, sign-up, session, Google OAuth), handled by Better Auth |
| GET | `/api/...` | _Describe_ |
| POST | `/api/...` | _Describe_ |

## Contributing / commit style

Commits follow a short `type: message` format, for example `feat: add product listing screen`, `fix: correct API URL in auth client` or `docs: update README`.

## Author

Snehal Fulari
