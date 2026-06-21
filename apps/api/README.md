# ⚙️ jasBuilt — API Server Engine

This directory drives the unified backend engine for the **jasBuilt** ecosystem. It maps relational database rules, manages multipart form streams via middleware pipelines, and serves structural JSON responses to the frontend view layer.

## 🛠️ System Dependencies

* **Runtime Host:** Node.js with Express framework routing
* **Database Mapping:** PostgreSQL managed via Prisma Client ORM
* **Multipart Stream Handling:** Multer + Cloudinary Storage API integration
* **Security Middleware Suite:** Helmet (headers), XSS-Clean (input sanitization), and Express-Rate-Limit (anti-spam)

---

## 🛣️ API Endpoint Directory Matrix

| Method | Endpoint | Access Rule | Payload Structure / Intent |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | `{ "name": "...", "username": "...", "email": "...", "password": "...", "school": "UG" }` |
| **POST** | `/api/auth/login` | Public | `{ "email": "...", "password": "..." }` |
| **GET** | `/api/projects` | Public | Streams all projects populated by filter queries |
| **GET** | `/api/projects/leaderboard` | Public | Streams top 20 builds ranked dynamically by upvote volume |
| **GET** | `/api/projects/:id` | Public | Streams individual project profile with associated comment streams |
| **POST** | `/api/projects` | 🔒 Private | **Multipart Form Data:** Text fields + `image` file |
| **POST** | `/api/projects/:id/upvote`| 🔒 Private | Alternates authenticated upvote stream (Toggles 1 / 0) |
| **POST** | `/api/projects/:id/comments`| 🔒 Private | `{ "content": "Great UI implementation!" }` |
| **GET** | `/api/users/profile/:username`| Public | Fetches targeted user info and all their associated builds |

---

## 🛡️ Input Validation & Middleware Order

All private communication avenues are shielded behind the `protect` verification gate. It verifies that incoming HTTP headers supply a functional, authenticated token:

```text
Incoming Request ──> Helmet Security ──> Body Parser / XSS Clean ──> Route Matching ──> [protect Middleware] ──> Cloudinary Upload ──> Prisma DB Write ──> JSON Response
```
