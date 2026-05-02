<div align="center">

# 🔗 Tier.ly
**Enterprise-Grade URL Shortener & Analytics Pipeline**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-FF4081?style=for-the-badge)](https://docs.bullmq.io/)

A high-performance URL shortening service engineered to handle massive redirect volumes without dropping clicks or blocking the Node.js event loop.

</div>

---

## ✨ Core Features

* ⚡ **Instant Redirects:** Single-digit millisecond 302 redirects using Redis JSON caching.
* 📊 **Asynchronous Analytics:** High-volume click tracking offloaded to a background worker via BullMQ.
* 🌍 **Geo & Device Parsing:** Extracts User-Agent (OS/Browser/Device) and IP geolocation via `ua-parser-js` and `geoip-lite`.
* 🛡️ **Cache-Busting Dashboard:** Strict HTTP headers ensure the React UI never shows stale data.
* 🔗 **Custom Aliases:** Auto-generated Base62 short links or user-defined custom aliases.

---

## 🏗 System Architecture

The core engineering challenge of a URL shortener is that **redirects must be instantaneous**, but **analytics are computationally heavy**. Tier.ly solves this by decoupling the two.

### The Lifecycle of a Click
1. **The Intercept:** A user navigates to `tier.ly/d56baa4`.
2. **The Cache Hit (Redis):** The Express `urlController` checks Redis. It parses the cached JSON to instantly retrieve the original `long_url` and the exact database `uuid`.
3. **The Fire-and-Forget Queue (BullMQ):** Before sending the redirect, the controller fires an async job to the BullMQ producer with the `url_id`, IP, and User-Agent.
4. **The Redirect:** The server responds with a `302 Found`. The main event loop is completely freed up in milliseconds.
5. **The Background Worker:** In a separate terminal process, `analyticsWorker.js` detects the job, hashes a unique visitor ID, and executes the heavy `INSERT` into PostgreSQL.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Network:** Axios & React Router v6

### Backend & Infrastructure
* **API:** Node.js, Express.js
* **Database:** PostgreSQL 15 (Alpine)
* **Cache & Message Broker:** Redis 7 (Alpine)
* **Queue System:** BullMQ
* **Containerization:** Docker & Docker Compose

---

## 🚀 Local Setup & Installation

Because of the asynchronous architecture, this project requires **three separate processes** running simultaneously alongside Docker.

### 1. Boot Infrastructure
Start the database and cache in the background.
```bash
docker compose up -d

### 2. Boot the API Server
Handles incoming HTTP requests.
```bash
cd backend
npm install
npm run dev
```

### 3. Boot the Background Worker (CRITICAL)
If this is not running, clicks will queue up in Redis but will never be saved to PostgreSQL.
```bash
# Open a second terminal
cd backend
node services/analyticsWorker.js
```

### 4. Boot the Frontend React App
```bash
# Open a third terminal
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to view the dashboard!

---

## 🗄️ Database Schema

```sql
-- Users Table: Handles authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- URLs Table: Stores link mappings
CREATE TABLE urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    long_url TEXT NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL
);

-- Clicks Table: The Analytics Ledger
CREATE TABLE clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
    visitor_id VARCHAR(255) NOT NULL,
    device_type VARCHAR(50),          
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐛 Technical Challenges Conquered

* **BullMQ Connection Clashes:** Resolved `maxRetriesPerRequest must be null` crashes by creating a singleton centralized `ioredis` configuration shared by the Queue and Worker.
* **Cache Data Mismatches:** Evolved the Redis cache from storing plain-text URLs to `JSON.stringify` objects. This ensured the exact Postgres UUID is passed to the queue even on a cache hit, preventing orphaned clicks.
* **Aggressive Browser Caching:** Browsers defaulted to caching the `GET /api/analytics` requests, serving `304 Not Modified` on the frontend. Fixed by injecting strict `Cache-Control: no-store` HTTP headers at the router level.