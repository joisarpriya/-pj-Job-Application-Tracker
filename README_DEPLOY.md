Deploy guide — quick steps

1) Frontend (Vercel)
- Create a Vercel project and set `VITE_API_URL` to your backend base URL (e.g., https://api.example.com)
- Add `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID` to GitHub repo secrets
- Push to `main` — the GitHub Action will deploy frontend to Vercel

2) Backend (Render or Railway)
- Option A: Deploy Docker image on Render (recommended)
  - Create a Render Docker service using the image `ghcr.io/<owner>/<repo>/applyflow-backend:latest` (set `PORT` to 5000)
  - Set env vars: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `JWT_SECRET`

- Option B: Use Railway or Render direct Git deployment; set environment variables via their UI.

> GitHub Actions deploy (no GitHub App required)
>
> - Add `RAILWAY_API_KEY` to your GitHub repository Secrets (Settings → Security → Secrets and variables → Actions).
> - The CI will build and push the backend Docker image to GHCR and — if `RAILWAY_API_KEY` is set — run the Railway CLI to deploy the backend automatically on push to `main`.
> - If you prefer to use the Railway GitHub App instead of a token, that still works and is the recommended approach for long-term security.

3) Database
- Provision a managed MySQL instance and set credentials in the Render/Railway service.
- The server runs `setup/dbInit.js` on start to create tables.

4) Secrets
- Store DB credentials and `JWT_SECRET` securely in your provider UI or GitHub Secrets for container deploys.

If you want, provide me with Vercel and Render tokens and I can finish the deploy and return a public URL. Otherwise, follow these steps and I’ll help verify once you have a staging URL.
