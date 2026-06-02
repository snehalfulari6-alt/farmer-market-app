## 🚀 Installation & Setup

### Prerequisites

Before running the application, ensure the following software is installed on your system:

* Node.js
* Bun
* Expo Go (for mobile testing)
* PostgreSQL Database

### Clone the Repository

```bash
git clone https://github.com/snehalfulari6-alt/farmer-market-app.git
cd farmer-market-app
```

---

## ⚙️ Environment Configuration

This project uses local network communication between the mobile application and backend server. Therefore, you must update the IP address configuration based on your current Wi-Fi network before running the application.

### 1. Update Frontend API URL

Open:

```text
app-frontend/app.json
```

Replace:

```json
"apiUrl": "http://10.11.235.236:3000"
```

with your machine's local IP address:

```json
"apiUrl": "http://YOUR_LOCAL_IP:3000"
```

Example:

```json
"apiUrl": "http://192.168.1.50:3000"
```

---

### 2. Update Frontend Authentication Client

Open:

```text
app-frontend/lib/auth-client.ts
```

Replace:

```text
http://10.11.235.236:3000
```

with:

```text
http://YOUR_LOCAL_IP:3000
```

---

### 3. Update Expo Trusted Origin

Open:

```text
backend/src/lib/auth.ts
```

Replace:

```text
exp://10.11.235.236:8081
```

with your current Expo host address:

```text
exp://YOUR_LOCAL_IP:8081
```

Example:

```text
exp://192.168.1.50:8081
```

---

### 4. Configure Environment Variables

Create or update the `.env` file located in:

```text
backend/.env
```

Ensure the following variables contain valid values:

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

> **Note:** Keep `BETTER_AUTH_URL=http://localhost:3000` for local development unless the backend is intentionally exposed to external networks.

---

## ▶️ Running the Application

### Start the Backend Server

```bash
cd backend
bun install
bun run dev
```

### Start the Mobile Application

```bash
cd app-frontend
npm install
npx expo start
```

Scan the generated QR code using the Expo Go application on a mobile device connected to the same Wi-Fi network.

---

## 📌 Important Note

Whenever the project is executed on a different machine or network, the local IP address configuration must be updated in the files mentioned above. Failure to update these values may prevent communication between the mobile application and backend server.
