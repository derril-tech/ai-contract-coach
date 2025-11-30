# Vercel Deployment Guide 2025 - DocuSummarize Pro

**Complete step-by-step guide for deploying the Next.js frontend to Vercel**

---

## Overview

This guide covers deploying **only the Web service** (Next.js frontend) to Vercel, while the API service remains on Railway.

**Architecture:**
- **Frontend (Web):** Vercel - `https://your-app.vercel.app`
- **Backend (API):** Railway - `https://api-production-c2ed.up.railway.app`

---

## Prerequisites

Before starting, ensure you have:
- ✅ Vercel account created (https://vercel.com)
- ✅ GitHub repository: `ai-document-summarizer-pro`
- ✅ Railway API service deployed and running
- ✅ API public domain generated on Railway
- ✅ Environment variables ready (see below)

---

## STEP 1: Import Project to Vercel

### 1.1 Connect GitHub Repository

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click "Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Select **GitHub** as the provider
   - Find and select your repository: `ai-document-summarizer-pro`
   - Click **"Import"**

### 1.2 Configure Project Settings

**Framework Preset:**
- **Select:** Next.js
- Vercel will auto-detect this

**Root Directory:**
- **Set to:** `web`
- Click **"Edit"** next to Root Directory
- Enter: `web`
- This tells Vercel where your Next.js app lives in the monorepo

**Build and Output Settings:**
- Leave these as default (Vercel auto-configures for Next.js)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

---

## STEP 2: Add Environment Variables

Before deploying, add all required environment variables:

### 2.1 Access Environment Variables

1. **In the import screen, expand "Environment Variables"** section
2. **OR** click **"Configure Project"** → **"Environment Variables"**

### 2.2 Add Each Variable

Add the following variables one by one:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_API_URL` | Your Railway API service URL | `https://api-production-c2ed.up.railway.app` |
| `NEXT_PUBLIC_API_BASE` | Your API server link with https:// in front of it |


**For each variable:**
1. **Key:** Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value:** Enter the actual value
3. **Environment:** Select **Production**, **Preview**, and **Development** (all three)
4. Click **"Add"**

### 2.3 Important Notes

⚠️ **Critical:**
- `NEXT_PUBLIC_API_URL` must include `https://` prefix
- Example: `https://api-production-c2ed.up.railway.app`
- NOT just: `api-production-c2ed.up.railway.app`

📝 **Why NEXT_PUBLIC_?**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Required for client-side API calls and Supabase connection

🔒 **Backend Variables:**
- Do NOT add `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE`, etc.
- These stay on Railway with the API service
- Never expose secret keys to the frontend

---

## STEP 3: Deploy

1. **Click "Deploy"**
2. **Wait for the build to complete** (typically 2-3 minutes)
3. **Watch the build logs** for any errors

**Expected Success:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

## STEP 4: Verify Deployment

### 4.1 Access Your Application

1. **Once deployed, Vercel will show your URL:**
   - Example: `https://ai-document-summarizer-pro.vercel.app`
   - Or: `https://your-project-name-username.vercel.app`

2. **Click "Visit"** to open your application

### 4.2 Check for Errors

1. **Open Browser Console** (F12 or Right-click → Inspect)
2. **Check for errors:**
   - ✅ No errors = Perfect!
   - ❌ API errors = Check `NEXT_PUBLIC_API_URL` is correct
   - ❌ Supabase errors = Check Supabase credentials

### 4.3 Test API Connection

1. **Navigate to the Playground page**
2. **Try to interact with features**
3. **Verify API calls work** (check Network tab in browser console)

---

## STEP 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain

1. **Go to your Vercel project**
2. **Click "Settings"** → **"Domains"**
3. **Click "Add"**
4. **Enter your domain:** `yourdomain.com`
5. **Follow Vercel's DNS instructions**

### 5.2 Update DNS Records

Add these records to your domain provider:

**For root domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

---

## STEP 6: Enable Automatic Deployments

Vercel automatically deploys when you push to GitHub:

**Production Deployments:**
- Triggered by pushes to `main` branch
- Uses Production environment variables

**Preview Deployments:**
- Triggered by pushes to any other branch or PRs
- Uses Preview environment variables
- Great for testing before merging

**To disable auto-deploy:**
1. Go to **Settings** → **Git**
2. Toggle **"Automatically deploy"** off

---

## Environment Variables Reference

### Required Variables

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Connect to Supabase database | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | Railway API service public domain |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Drive Picker | Google Cloud Console → Credentials |

### How to Get Each Value

#### **NEXT_PUBLIC_SUPABASE_URL**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy **Project URL**
5. Example: `https://abc123def456.supabase.co`

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
1. Same location as above (Settings → API)
2. Copy **anon/public** key (NOT the service_role key!)
3. Starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **NEXT_PUBLIC_API_URL**
1. Go to Railway dashboard
2. Click on your **api** service
3. Go to **Settings** → **Networking**
4. Copy the **Public Domain**
5. Add `https://` prefix
6. Example: `https://api-production-c2ed.up.railway.app`

#### **NEXT_PUBLIC_GOOGLE_CLIENT_ID**
1. Go to https://console.cloud.google.com
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** (if not exists)
5. Copy the **Client ID**
6. Example: `123456789-abc.apps.googleusercontent.com`

---

## Troubleshooting

### Build Fails with "Cannot find module"

**Error:** `Module not found: Can't resolve 'xyz'`

**Fix:**
1. Ensure `web/package.json` has all dependencies
2. Run locally: `cd web && npm install && npm run build`
3. If it works locally, check Vercel build logs
4. Verify Root Directory is set to `web`

---

### API Calls Fail (CORS Errors)

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Fix:**
1. Check Railway API service has CORS configured in `api/main.py`
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Ensure API service is running on Railway

**Expected CORS config in `api/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Environment Variables Not Working

**Error:** `process.env.NEXT_PUBLIC_API_URL is undefined`

**Fix:**
1. Verify variable names start with `NEXT_PUBLIC_`
2. Check variables are added in Vercel dashboard
3. Redeploy after adding variables (Settings → Deployments → Redeploy)
4. Check browser console: `console.log(process.env.NEXT_PUBLIC_API_URL)`

---

### Page Loads but Features Don't Work

**Possible Causes:**
1. ❌ API service is down on Railway
2. ❌ Wrong API URL in environment variables
3. ❌ Missing environment variables

**Debug Steps:**
1. Open browser console (F12)
2. Go to **Network** tab
3. Try using a feature
4. Check if API calls are being made
5. Check response status codes

---

## Monitoring & Logs

### View Deployment Logs

1. **Go to Vercel Dashboard**
2. **Click your project**
3. **Click "Deployments"**
4. **Click on a deployment** to see logs

### View Runtime Logs

1. **In your deployment**
2. **Click "Functions"** tab
3. **Click "View Logs"** on any function
4. See real-time logs from your app

### Analytics (Optional)

Vercel offers built-in analytics:
1. **Go to your project**
2. **Click "Analytics"** tab
3. View:
   - Page views
   - Top pages
   - Top referrers
   - Real User Monitoring

---

## Performance Optimization

### Enable Edge Functions (Optional)

Vercel can deploy your Next.js app to the edge for faster global response times:

1. **In `web/next.config.ts`, add:**
```typescript
export const runtime = 'edge';
```

2. **Or per-page/route:**
```typescript
// In any page/route file
export const runtime = 'edge';
```

### Image Optimization

Vercel automatically optimizes images with Next.js Image component:
```tsx
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

---

## Continuous Deployment Workflow

### Recommended Git Flow

1. **Feature Branch:**
   ```bash
   git checkout -b feature/new-feature
   git push origin feature/new-feature
   ```
   - Creates Preview Deployment on Vercel
   - Test at: `https://ai-document-summarizer-pro-git-feature-new-feature.vercel.app`

2. **Merge to Main:**
   ```bash
   git checkout main
   git merge feature/new-feature
   git push origin main
   ```
   - Triggers Production Deployment
   - Live at: `https://ai-document-summarizer-pro.vercel.app`

---

## 🎉 SUCCESS!

Your Next.js frontend is now deployed on Vercel with:
- ✅ Automatic deployments from GitHub
- ✅ Environment variables configured
- ✅ Connected to Railway API backend
- ✅ Preview deployments for branches
- ✅ Custom domain support (optional)

**Your app is live at:** `https://your-project.vercel.app`

---

**Last Updated:** 2025-11-02  
**Status:** Production Ready

