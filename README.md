<div align="center">

<img src="https://raw.githubusercontent.com/YOUR_USERNAME/horizon-smp/main/assets/logo.png" width="160" alt="Horizon SMP Logo" />

# ⛏️ Horizon SMP — Official Website

**Tamil Minecraft Community · Semi-Vanilla · Economy · 24/7**

[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&style=flat-square)](https://vercel.com)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js&style=flat-square)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/Database-Aiven%20MySQL-4479A1?logo=mysql&style=flat-square)](https://aiven.io)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

</div>

---

## 🌐 What is Horizon SMP?

**Horizon SMP** is a Tamil Minecraft community server built on a semi-vanilla economy system. Players use **Shards** as currency, explore with `/rtp`, trade in the in-game shop, and enjoy 24/7 uptime. This repo contains the full source code for the public-facing website.

---

## 🏗️ How This Was Built

### Frontend
The entire website is a single hand-crafted `index.html` — no frameworks, no build step. Everything is vanilla HTML, CSS (with CSS variables + glassmorphism), and JavaScript.

- **Fonts** — Outfit, Space Grotesk, JetBrains Mono via Google Fonts
- **Animations** — Pure CSS keyframes: floating logo, animated orbs, scrolling grid background
- **UI** — Custom glass-card components, responsive mobile menu, star-rating widget
- **Feedback** — Dynamic review cards fetched live from the database on page load

### Backend
The backend runs as **Vercel Serverless Functions** (Node.js 18+), stored in the `api/` directory. Each file becomes its own endpoint automatically.

```
api/
├── _db.js        ← shared MySQL pool + response helpers (not exposed as a route)
├── feedback.js   ← GET /api/feedback  · POST /api/feedback
├── setup.js      ← GET /api/setup     (creates the DB table)
└── clean.js      ← GET /api/clean     (truncates reviews — admin use)
```

### Database
- **Provider** — [Aiven](https://aiven.io) managed MySQL (cloud-hosted, SSL enforced)
- **Schema** — Single `feedbacks` table:

```sql
CREATE TABLE feedbacks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(32)  NOT NULL,
  rating     INT          NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

- **Credentials** are stored as **Vercel Environment Variables** — never in code. The `.env.example` file shows which keys you need.

---

## 🚀 Deploy Your Own Copy

### 1 — Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/horizon-smp.git
cd horizon-smp
npm install
```

### 2 — Set Up Environment Variables

Copy the example file and fill in your real database credentials:

```bash
cp .env.example .env.local
# Edit .env.local with your Aiven (or any MySQL) credentials
```

| Variable      | Description                          |
|---------------|--------------------------------------|
| `DB_HOST`     | MySQL host (e.g. `xxx.aivencloud.com`) |
| `DB_PORT`     | MySQL port (Aiven default: `14031`)  |
| `DB_USER`     | Database username                    |
| `DB_PASSWORD` | Database password                    |
| `DB_NAME`     | Database name (e.g. `defaultdb`)     |

### 3 — Initialize the Database

Run this once after deploy to create the `feedbacks` table:

```
GET https://your-site.vercel.app/api/setup
```

### 4 — Run Locally

```bash
npm run dev
# → http://localhost:3000
```

### 5 — Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In **Settings → Environment Variables**, add all five `DB_*` variables
4. Click **Deploy** ✅

---

## 🔌 API Reference

| Method | Endpoint          | Description                            |
|--------|-------------------|----------------------------------------|
| `GET`  | `/api/feedback`   | Fetch all reviews (newest first)       |
| `POST` | `/api/feedback`   | Submit a new review                    |
| `GET`  | `/api/setup`      | Create the DB table (run once)         |
| `GET`  | `/api/clean`      | Delete all reviews (admin only)        |

### POST `/api/feedback` — Request Body

```json
{
  "username": "Steve",
  "rating": 5,
  "message": "Best Tamil Minecraft server ever!"
}
```

---

## 🔐 Security Notes

- ✅ Database credentials are **environment variables only** — never hardcoded
- ✅ `.env` / `.env.local` are in `.gitignore` — will never be committed
- ✅ All DB queries use **parameterised statements** — no SQL injection possible
- ✅ Aiven MySQL uses **SSL/TLS** encryption in transit
- ✅ CORS headers are set on every API response

---

## 🗂️ Project Structure

```
horizon-smp/
├── index.html          ← Full website (single file)
├── vercel.json         ← Vercel routing config
├── package.json        ← Node dependencies
├── .env.example        ← Environment variable template (safe to commit)
├── .gitignore          ← Keeps credentials out of git
└── api/
    ├── _db.js          ← MySQL pool + helpers
    ├── feedback.js     ← Review API
    ├── setup.js        ← DB init
    └── clean.js        ← DB reset
```

---

## 🤝 Contributing

Pull requests are welcome! If you find a bug or want to suggest a feature, open an issue.

---

<div align="center">

Made with ❤️ for the Tamil Minecraft community

**[▶ Join the Server](https://discord.gg/your-invite)** · **[🌐 Visit Website](https://horizon-smp.vercel.app)**

</div>
