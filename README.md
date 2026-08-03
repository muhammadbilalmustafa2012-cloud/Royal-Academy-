# 🎓 Royal Academy – Official Website

A full-stack web application for **Royal Academy**, Faisalabad — featuring course listings, teacher profiles, online admissions, results, and an admin dashboard.

## 🚀 Live Demo

> Deploy to Vercel: see instructions below.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (Prisma 7) / JSON fallback |
| Auth | JWT + bcrypt |
| Deployment | Vercel (serverless) / Docker |

---

## 📦 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Start dev server (uses JSON file fallback — no DB needed)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy to Vercel

### Step 1 – Push to GitHub
This repo is already connected. Any push to `main` triggers a Vercel deployment.

### Step 2 – Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import this GitHub repo
3. Vercel auto-detects `vercel.json` — no extra config needed

### Step 3 – Set Environment Variables
In Vercel dashboard → **Settings → Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. from Neon, Supabase, Railway) |
| `JWT_SECRET` | Random secret string (min 32 chars) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `PRIMARY_DOMAIN` | Your domain e.g. `https://www.royalacademy.pk` |
| `GOOGLE_SHEETS_WEBHOOK_URL` | *(Optional)* Google Apps Script webhook |

> **Tip:** If `DATABASE_URL` is not set, the app uses a JSON file fallback automatically.

### Step 4 – Deploy
Click **Deploy**. Vercel runs `npm install` → `prisma generate` → `npm run build` automatically.

---

## 🗄️ Database (PostgreSQL)

**Free options:**
- [Neon](https://neon.tech) — free PostgreSQL, serverless
- [Supabase](https://supabase.com) — free tier
- [Railway](https://railway.app) — free trial

After creating a DB, copy the connection string to `DATABASE_URL` in Vercel.

---

## 🐳 Docker (Self-hosted)

```bash
# Start full stack (app + PostgreSQL)
docker-compose up -d
```

App runs on http://localhost:3000

---

## 📁 Project Structure

```
royal-academy/
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── pages/            # Page components
│   └── data/             # Initial seed data
├── server/               # Express backend modules
│   ├── db.ts             # DB controller (Prisma + JSON fallback)
│   ├── routes.ts         # API routes
│   └── auth.ts           # JWT authentication
├── server.ts             # Main Express server entry
├── prisma/               # Prisma schema
├── public/               # Static assets
├── vercel.json           # Vercel deployment config
├── Dockerfile            # Docker production image
└── docker-compose.yml    # Full local stack
```

---

## 👨‍💼 Admin Panel

Access at `/admin` — log in with the credentials set in your `.env` file.

---

## 📞 Contact

**Royal Academy** | Faisalabad, Mansoorabad, Farooqabad Street 14  
📱 WhatsApp: +92 329 0247580
