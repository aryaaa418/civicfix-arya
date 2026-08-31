# Smart Civic Complaint API

Node.js + Express + PostgreSQL backend for CivicFix.

## Requirements
- Node.js 18+
- PostgreSQL 14+

## Setup
1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your PostgreSQL database.
3. Create the database, then run `schema.sql`.
4. Install dependencies:
   `npm install`
5. Start:
   `npm start`

## Health check
GET `/api/health`

## APIs
- POST `/api/complaints` — multipart/form-data; fields: `photo` (optional), `category`, `title`, `description`, `priority`, `latitude`, `longitude`, `address`, `user_id`.
- GET `/api/complaints`
- GET `/api/complaints/:id`
- GET `/api/complaints/public/:publicId`
- PATCH `/api/complaints/:id/status`
- GET `/api/admin/stats`
- GET `/api/admin/complaints`
- PATCH `/api/admin/complaints/:id/status`
- GET `/api/departments`
- POST `/api/ai/predict` — enabled only after `AI_API_URL` is configured.

## AI note
The backend does not fake AI results. Until a real AI service is deployed, `/api/ai/predict` returns a clear 503 response. This prevents demo values from being mistaken for real predictions.
