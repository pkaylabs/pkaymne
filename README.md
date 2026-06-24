# PKay M&E Frontend

React and Vite frontend for the PKay Monitoring & Evaluation SaaS platform.

## Local development

```powershell
yarn install --frozen-lockfile
Copy-Item .env.example .env
yarn dev
```

Set `VITE_API_BASE_URL` to the FastAPI `/api/v1` URL. The production build is:

```powershell
yarn lint
yarn build
```

Vercel SPA rewrites are configured in `vercel.json`.
