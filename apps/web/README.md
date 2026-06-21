# 💻 jasBuilt — Web Frontend Client

This directory houses the user-facing web view application for **jasBuilt**. It is a modern, responsive Single Page Application (SPA) structured to stream project cards, track interactive upvote metrics optimistically, and manage authorization states.

## 🛠️ Technology Workspace

* **Framework Shell:** React 19 via Vite (for lightning-fast Hot Module Replacement)
* **Routing Architecture:** React Router v7 (handling global feed navigation, dynamic user profiles, and submission pages)
* **Design Systems:** Scoped Modular SCSS (`@import` architecture in `global.scss`) for custom high-tech dark theme layouts

---

## 🔒 Session Architecture (`useAuth`)

User sessions are secured globally via a custom React Context interface Hook (`useAuth()`). 

* **Token Handling:** Upon registration or login, an asymmetric JSON Web Token (JWT) is assigned by the server and cached securely inside the browser's `localStorage` API under the string key `'token'`.
* **State Verification:** Every cross-domain API network execution (e.g., uploading a project, upvoting a build, or leaving a comment) extracts this token to hydrate the request's structural bearer context:
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

---

## 🏗️ Folder Blueprint

```plaintext
apps/web/src/
├── components/
│   ├── layout/     # Persistent UI shells (Navbar, Footer)
│   └── ui/         # Reusable interactive components (UpvoteButton, ProjectModal)
├── hooks/          # Global application custom hooks (useAuth)
├── pages/          # Full page layout views (Home, Auth, Submit, Profile, Leaderboard)
└── styles/         # Organized stylesheet workspace (home.scss, auth.scss, submit.scss)
```
