# KarmSetu

KarmSetu is a full-stack job portal application connecting candidates and employers. The backend API handles user authentication, profiles, job postings, and applications.

## Features
- User registration/login with JWT authentication
- Role-based access (Candidate/Employer)
- Candidate and Employer profile management (with Cloudinary image uploads)
- Job posting and management by employers
- Job applications by candidates
- MongoDB data persistence

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ODM)
- **Auth**: JWT, bcryptjs
- **File Upload**: Multer + Cloudinary
- **Other**: CORS, dotenv

## Prerequisites
- Node.js (v18+)
- MongoDB (Atlas recommended for URI)
- Cloudinary account (for uploads)

## Quick Start

1. Clone the repository (if not already):
   ```
   git clone <repo-url>
   cd "Stage 3 (medium)"
   ```

2. Install backend dependencies:
   ```
   cd Backend
   npm install
   ```

3. Create `.env` file in `Backend/` with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the server:
   ```
   node server.js
   ```
   Server runs on `http://localhost:${PORT}` (default 5000).

## Project Structure
```
.
├── Backend/
│   ├── server.js (entry)
│   ├── src/
│   │   ├── app.js
│   │   ├── config/db.js
│   │   ├── controllers/ (auth, profile, job, application)
│   │   ├── middleware/ (auth, role)
│   │   ├── models/ (User, CandidateProfile, EmployerProfile, Job, Application)
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env
├── Frontend/ (WIP - to be implemented)
├── README.md
└── TODO.md
```

## API Endpoints (High-level)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Profiles**: `GET/POST/PUT /api/profiles`
- **Jobs**: `GET/POST /api/jobs`
- **Applications**: `POST /api/applications/apply/:jobId`

All protected routes require JWT token in `Authorization: Bearer <token>`.

## Frontend
Frontend directory is currently empty. Planned: React/Vue app consuming the API.

## Deployment
- Backend: Render/Heroku/Vercel (set env vars)
- Database: MongoDB Atlas
- Static files: Cloudinary



---
*Built with ❤️ for job seekers and employers*

