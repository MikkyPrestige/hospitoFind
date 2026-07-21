# Staging Environment

The staging environment lets you test changes end‑to‑end before releasing to production. It has its own databases, services, and URLs — completely isolated from production.

## URLs

| Service      | URL                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Frontend** | [https://hospitofind-staging.vercel.app](https://hospitofind-staging.vercel.app)                   |
| **Backend**  | [https://hospitofind-server-staging.onrender.com](https://hospitofind-server-staging.onrender.com) |

## Branches

- **Backend repo** → `staging` branch deploys to Render
- **Frontend repo** → `staging` branch deploys to Vercel

To bring production changes into staging, merge `main` into `staging` on each repo.

```bash
git checkout staging
git pull origin staging
git merge main
# resolve conflicts if any
git push origin staging
```

## Backend (Render)

The backend is deployed as a separate Render web service from the `staging` branch.

- **Service name**: `hospitofind-server-staging`
- **Database**: Uses a dedicated MongoDB Atlas database `hospitofind-staging`

### Seeding the staging database

```bash
MONGODB_URI="mongodb+srv://staging-user:DB_PASSWORD@cluster0.mqvrcxt.mongodb.net/hospitofind-staging?retryWrites=true&w=majority&appName=Cluster0" MAPBOX_TOKEN="MAPBOX_TOKEN" node scripts/seedHospitals.js
```

Then mark all hospitals as verified (one‑off):

```bash
node -e "import('mongoose').then(async (mongoose) => { const uri='mongodb+srv://staging-user:DB_PASSWORD@cluster0.mqvrcxt.mongodb.net/hospitofind-staging?retryWrites=true&w=majority&appName=Cluster0'; await mongoose.connect(uri); const Hospital=mongoose.model('Hospital', new mongoose.Schema({}, { strict: false, collection: 'hospitals' })); const r=await Hospital.updateMany({}, { \$set: { verified: true } }); console.log(\`Set \${r.modifiedCount} hospitals to verified.\`); await mongoose.disconnect(); })"
```

### Environment variables

All variables are set in Render under the `hospitofind-server-staging` service → Environment tab. The key ones:

| Variable        | Value                                                    |
| --------------- | -------------------------------------------------------- |
| `MONGODB_URI`   | `mongodb+srv://staging-user:.../hospitofind-staging?...` |
| `FRONTEND_URL`  | `https://hospitofind-staging.vercel.app`                 |
| `BACKEND_URL`   | `https://hospitofind-server-staging.onrender.com`        |
| `COOKIE_DOMAIN` | `.vercel.app`                                            |

## Frontend (Vercel)

The frontend is deployed as a separate Vercel project from the `staging` branch.

- **Project name**: `hospitofind-staging`
- **Production branch**: `staging` (set in Settings → Git)

### Environment variables

All variables are managed via Vercel CLI or the dashboard.

| Variable        | Value                                             |
| --------------- | ------------------------------------------------- |
| `VITE_BASE_URL` | `https://hospitofind-server-staging.onrender.com` |

Add or update a variable:

```bash
vercel env add VITE_BASE_URL production
```

Then redeploy:

```bash
vercel --prod
```

## Auth0

Staging uses a separate Auth0 application (**HospitoFind Staging**) to avoid affecting production logins. Relevant environment variables on the backend:

- `AUTH0_AUDIENCE`
- `AUTH0_ISSUER`
- `AUTH0_CLIENT_ID`
- `AUTH0_MGMT_CLIENT_ID`
- `AUTH0_MGMT_CLIENT_SECRET`
- `JWKSURI`
