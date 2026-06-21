# 🚀 jasBuilt

---

<div align="center">
  <!-- Dynamic Status Badges -->
  <img src="https://img.shields.io/badge/Platform-React_v19-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React View" />
  <img src="https://img.shields.io/badge/Backend-Express_Node-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Express Server" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" alt="Database" />
  <img src="https://img.shields.io/badge/Storage-Cloudinary-F5C842?style=for-the-badge&logo=cloudinary&logoColor=black" alt="Cloudinary Storage" />
  <img src="https://img.shields.io/badge/Workspace-PNPM_Monorepo-F68712?style=for-the-badge&logo=pnpm&logoColor=white" alt="PNPM Monorepo" />
</div>

<br />

<div align="center">
  <h3>⚡ The Product Hunt for Ghanaian Student Developers ⚡</h3>
  <p>Discover, explore, upvote, and discuss software applications built entirely across local university campuses.</p>
  <a href="#-getting-started">Explore the Docs</a> •
  <a href="#-key-features">View Features</a>
</div>

---

## 📸 Interface Preview

<div align="center">
  <img width="1341" height="618" alt="Feed" src="https://github.com/user-attachments/assets/c50e6b17-8d19-4ed5-a53b-f27fad0730c1" />
  <img width="1341" height="622" alt="Leaderboard Page" src="https://github.com/user-attachments/assets/a211ec50-b5d1-4311-811e-f7982443a28b" />
  <img width="1346" height="613" alt="User Page" src="https://github.com/user-attachments/assets/1cd6ad5a-d627-4a79-8655-1cf62348c7c9" />
</div>

---

## ✨ Key Features

* **📦 Monorepo Architecture:** Driven by `pnpm workspaces` separating shared logic packages completely from isolated UI and server deployment bundles.
* **🔍 Instant Discovery Engine:** In-memory client-side filters allowing users to search by text, filter by institution, or sort dynamically by technology stack with zero latency.
* **🔺 Optimistic UI Upvote Loop:** Real-time feedback upvote counters that instantly increment visually while executing atomic background transactions against the database.
* **💬 Rich Feedback Stream:** High-velocity comment overlays attached directly to individual build profiles mapping custom schemas flawlessly.
* **🥇 Dynamic Leaderboard:** Real-time standing tables grouping database aggregates by upvote counts using custom Prisma validation tracking.
* **🛡️ Hardened API Security:** Shielded against core entry vectors via robust input sanitization, strict body parser constraints (`10kb`), and XSS middleware bindings.

---

## 🏗️ Architecture Blueprint

The project follows a strictly typed, unified monorepo system pattern:

| Directory Path | Focus Layer | Core Dependency Stack |
| :--- | :--- | :--- |
| **`apps/web`** | Frontend / View Shell | React 19, Vite, SCSS Layouts, React Router v7 |
| **`apps/api`** | Backend Server Engine | Node.js, Express, Prisma ORM, Helmet, Multer |
| **`packages/shared`** | Shared Utilities | Cross-workspace validation arrays (`GH_SCHOOLS`, `TECH_TAGS`) |

---

## 🚦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) and [PNPM](https://pnpm.io) globally operational on your computer.

### 1. Setup Local Repositories
Clone the project space and enter the directory layout root:
```bash
git clone https://github.com
cd jasbuilt
```

### 2. Install Workspace Monorepo Dependencies
Run the global structural bootstrap command via pnpm:
```bash
pnpm install
```

### 3. Configure Your Environment Keys
Create an `.env` file inside `apps/api/`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/jasbuilt_db?schema=public"
JWT_SECRET="your_ultra_secure_dev_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Create an `.env` file inside `apps/web/`:
```env
VITE_API_URL="http://localhost:5000"
```

### 4. Seed and Sync Your Database Schema
Push your database mapping rules up to your local PostgreSQL instance:
```bash
pnpm --filter api prisma db push
```

### 5. Fire Up the Development Workspace
Boot the entire engine (both frontend dashboard and server endpoints simultaneously):
```bash
pnpm dev
```
Your frontend layer will immediately launch at 🌐 http://localhost:5173!

---

## 📄 License
Distributed under the MIT License. See LICENSE for details.
