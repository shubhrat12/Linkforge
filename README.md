# 🚀 LinkForge

### Scalable URL Shortener with Distributed Analytics Processing

LinkForge is a full-stack URL shortening platform designed to deliver fast redirects and detailed click analytics without sacrificing performance.

Built using React, Node.js, PostgreSQL, Redis, and BullMQ, the application leverages caching and background job processing to efficiently manage redirect traffic and analytics collection.

---

## Overview

Link shortening services must handle two important responsibilities:

* Redirect users as quickly as possible
* Record every click accurately for analytics

Performing analytics processing during the redirect request can introduce unnecessary latency. LinkForge avoids this by separating redirect execution from analytics tracking through a queue-driven architecture.

Redirects are served immediately while click events are processed asynchronously in the background.

---

## Features

### URL Management

* Generate shortened URLs from long links
* Create custom short aliases
* Store and manage URL mappings
* Prevent duplicate short codes

### High-Speed Redirects

* Redis-powered cache layer
* Reduced database lookups
* Low-latency URL resolution
* Optimized redirect workflow

### Analytics Engine

* Click tracking
* Device detection
* Browser identification
* Operating system analysis
* Geolocation tracking
* Unique visitor monitoring

### Dashboard

* Interactive analytics visualizations
* Link performance monitoring
* Usage statistics and trends
* Real-time reporting interface

### Infrastructure

* Dockerized environment
* Queue-based processing with BullMQ
* PostgreSQL persistent storage
* Redis caching and messaging

---

## Architecture

### Redirect Pipeline

1. User requests a shortened URL.
2. Backend checks Redis for cached URL data.
3. Original destination URL is retrieved.
4. Analytics event is added to a BullMQ queue.
5. HTTP redirect response is returned immediately.
6. Background worker processes analytics data.
7. Click information is stored in PostgreSQL.

This design ensures analytics operations never block redirect requests.

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* Recharts

### Backend

* Node.js
* Express.js
* PostgreSQL
* Redis
* BullMQ
* ioredis

### DevOps

* Docker
* Docker Compose

---

## Project Structure

```text
linkforge/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── utils/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── components/
│
├── docker-compose.yml
├── README.md
└── .gitattributes
```

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/yourusername/linkforge.git
cd linkforge
```

### Start Database & Redis

```bash
docker compose up -d
```

### Start Backend Server

```bash
cd backend
npm install
npm run dev
```

### Start Analytics Worker

Open a separate terminal window:

```bash
cd backend
node services/analyticsWorker.js
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Database Design

### Users

Stores account information and authentication credentials.

### URLs

Maintains mappings between shortened URLs and their original destinations.

### Clicks

Records visitor activity including:

* Visitor ID
* Device Type
* Browser Information
* Geographic Data
* Click Timestamp

---

## Engineering Challenges

### Queue Reliability

Configured a centralized Redis connection strategy to ensure stable communication between BullMQ producers and workers.

### Cache Consistency

Enhanced cached URL records to include both redirect information and associated database identifiers, ensuring analytics events remain correctly linked.

### Analytics Freshness

Implemented strict cache-control policies to prevent browsers from serving outdated analytics responses.

### Performance Optimization

Separated analytics ingestion from redirect processing to keep request latency low under increasing traffic volumes.

---

## Future Enhancements

* JWT Authentication
* QR Code Generation
* Link Expiration Support
* Team Workspaces
* Advanced Search
* Rate Limiting
* CI/CD Pipelines
* Kubernetes Deployment
* Redis Clustering
* Enhanced Analytics Reporting

---

## Skills Demonstrated

* Full-Stack Development
* REST API Design
* Redis Caching
* Background Job Processing
* Event-Driven Architecture
* PostgreSQL Database Design
* Docker Containerization
* System Scalability
* Analytics Pipeline Development
* Distributed Systems Fundamentals

---

## License

This project is licensed under the MIT License.

Feel free to fork, modify, and extend the project for learning or production use.
