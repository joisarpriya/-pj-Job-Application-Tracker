# Production Deployment Guide for Job Application Tracker

## Prerequisites
- Node.js (v18+ recommended)
- npm
- MySQL server (production-ready, not XAMPP for production)
- (Optional) Docker & Docker Compose

## 1. Environment Variables
Create a `.env` file in the `backend/` directory with your production values:

```
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=applyflow
DB_PORT=3306
```

## 2. Build Frontend
From the root directory:

```
cd job-application-tracker
npm install
npm run build
```

## 3. Install Backend Dependencies
```
cd backend
npm install
```

## 4. Start Backend Server
```
cd backend
npm start
```

## 5. Serve Frontend (Production)
- Use a static server (e.g., Nginx, serve, or your backend if configured) to serve the `dist/` folder.
- Example with `serve`:
  ```
  npm install -g serve
  serve -s dist
  ```

## 6. Docker Deployment (Optional)
- Use the provided `frontend.Dockerfile` and `backend/Dockerfile` for containerized deployment.
- Create a `docker-compose.yml` for orchestration.

## 7. Health Check
- Backend: `GET http://your-domain:5000/api/health`
- Frontend: Open your deployed site in a browser.

---

For further customization, CI/CD, or cloud deployment, see the README.md or contact the maintainer.
