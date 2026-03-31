# 🏥 Healix — Healthcare Intelligence Dashboard

A modern, production-grade healthcare dashboard with real-time interactivity, glassmorphic UI, and full CRUD appointment management.

---

## ✨ Features

### UI / UX
- **Glassmorphic design** with deep navy gradient background and subtle grid overlay
- **Syne + DM Sans** typography pairing — distinctive, clinical-modern aesthetic
- **Framer Motion** animations: staggered card entrances, hover lifts, slide-in panels, number countups
- **Ambient orb lighting** for depth and atmosphere
- **Micro-interactions** on every button, row, and input

### Authentication
- JWT-based login and signup
- Credentials stored in `db.json` (no hashing — demo-friendly)
- Token persisted in `localStorage`, auto-attached to all API requests
- Pre-seeded demo users for instant access

### Dashboard
| Feature | Detail |
|---|---|
| **KPI Cards** | Patients Today, Total Appointments, Unique Patients, Active Users — animated number countup |
| **Line Chart** | Patient visits over the last 7 days (Recharts) |
| **Bar Chart** | Appointment load by doctor — click a bar to filter the table |
| **Donut Chart** | Appointment status breakdown — click a slice to filter the table |
| **Appointments Table** | Search, multi-sort, filter by doctor/status, row click for detail view |
| **Activity Log** | Recent CRUD operations with timestamps |

### Appointments (CRUD)
- **Add** via floating side panel with animated slide-in
- **Edit** pre-filled form from table row or detail view
- **Delete** with single click (table action or detail panel)
- **View** full detail modal with formatted date, doctor, notes, status badge
- All changes instantly update KPIs, charts, and table — no page reload

### Chart → Table Interactivity
- Click a **doctor bar** → filters table to that doctor
- Click a **status donut slice** → filters table to that status
- Both filters stack; "Clear filters" resets everything

---

## 🗂 Project Structure

```
healthdash/
├── start.sh                    # One-command launcher (both services)
├── README.md
│
├── backend/
│   ├── server.js               # Express API (auth + CRUD)
│   ├── db.json                 # JSON flat-file database (seed data included)
│   └── package.json
│
└── frontend/
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx             # Auth-gated routing
        ├── api.js              # Axios instance with JWT interceptor
        ├── index.css           # Design tokens, glassmorphism, animations
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── LoginPage.jsx   # Sign in / Sign up with demo fill
        │   └── DashboardPage.jsx
        └── components/
            ├── Sidebar.jsx
            ├── KPICard.jsx
            ├── Charts.jsx      # Line, Bar, Donut
            ├── AppointmentsTable.jsx
            ├── AppointmentModal.jsx  # Add/Edit side panel
            ├── DetailPanel.jsx       # View modal
            └── ActivityLog.jsx
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start everything

```bash
# From the healthdash/ root:
./start.sh
```

Or manually in two terminals:

```bash
# Terminal 1 — Backend (port 3001)
cd backend && node server.js

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 3. Open the app

```
http://localhost:5173
```

---

## 🔑 Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@healix.com | admin123 | Admin |
| doctor@healix.com | doctor123 | Doctor |

Or click **"Fill Demo"** on the login page.

---

## 🔌 API Reference

All routes except `/api/login` and `/api/signup` require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Login, returns JWT |
| POST | `/api/signup` | Register, returns JWT |
| GET | `/api/dashboard` | KPIs, chart data, activity log |
| GET | `/api/appointments` | All appointments |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |
| GET | `/api/patients` | All patients |

---

## 🎨 Design Decisions

- **Color palette**: Deep navy `#060b14` base with cyan `#38bdf8` / teal `#2dd4bf` accents — clinical without being cold
- **Glassmorphism**: `backdrop-filter: blur(20px)` + semi-transparent backgrounds + subtle border glow on hover
- **Typography**: Syne for headings (geometric, medical-tech feel) + DM Sans for body (readable, professional)
- **Charts**: Recharts with custom tooltips, gradient fills, and invisible axes for a clean look
- **Animations**: Framer Motion with spring physics for natural, non-jarring motion

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | Framer Motion |
| Charts | Recharts |
| HTTP | Axios |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Auth | JWT (jsonwebtoken) |
| Database | JSON flat file (db.json) |
