# Vercel Deployment Checklist - ContractCoach MVP

> **Status:** ✅ Ready for Deployment  
> **Last Updated:** 2025-11-30

---

## ✅ Pre-Deployment Verification Complete

### Build Status
- ✅ `npm run build` completed successfully
- ✅ All pages generated correctly
- ✅ No build errors
- ✅ Static assets optimized

### Asset Verification

#### Video Files (Hero Backgrounds)
- ✅ `web/public/hero-bg-dark.mp4` - Tracked by Git
- ✅ `web/public/hero-bg-light.mp4` - Tracked by Git
- ✅ Poster images available:
  - ✅ `web/public/Screenshot-dark.png`
  - ✅ `web/public/Screenshot-light.png`

#### Image Files
- ✅ `web/public/logo.png` - Tracked by Git
- ✅ `web/app/opengraph-image.png` - For social media
- ✅ `web/app/twitter-image.png` - For Twitter cards
- ✅ `web/public/favicon.ico` - Favicon

### Git Tracking Status

**Important:** `.cursorignore-largefiles` does NOT affect Git or deployment!

- ✅ `.gitignore` does NOT block `.mp4` or `.png` files
- ✅ All media files are tracked by Git
- ✅ Files will be included in Vercel deployment

**Note:** `.cursorignore-largefiles` only prevents Cursor AI from loading large files into its context to save tokens. It has NO impact on:
- Git tracking
- Vercel deployment
- Build process
- Runtime accessibility

---

## 📋 Files Ready for Deployment

### Static Assets (web/public/)
```
web/public/
├── hero-bg-dark.mp4          ✅ Tracked
├── hero-bg-light.mp4         ✅ Tracked
├── Screenshot-dark.png       ✅ Tracked
├── Screenshot-light.png      ✅ Tracked
├── logo.png                  ✅ Tracked
└── favicon.ico               ✅ Tracked
```

### Metadata Images (web/app/)
```
web/app/
├── opengraph-image.png       ✅ For social sharing
└── twitter-image.png         ✅ For Twitter cards
```

---

## 🔧 Configuration Updates

### Layout.tsx - Metadata Base
- ✅ Added `metadataBase` to fix social image warnings
- ✅ Uses environment variable for Vercel URL
- ✅ Falls back to Railway URL if Vercel URL not set

### Build Configuration
- ✅ Next.js 15 (App Router) configured
- ✅ Static pages generated successfully
- ✅ All routes working:
  - `/` - Landing page
  - `/dashboard` - Dashboard
  - `/playground` - Main app
  - `/auth/google/callback` - OAuth callback

---

## 🚀 Vercel Deployment Steps

### 1. Environment Variables
Add these to Vercel (Settings → Environment Variables):

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_API_URL` - Your Railway API URL (with https://)

**Optional but Recommended:**
- `NEXT_PUBLIC_VERCEL_URL` - Auto-set by Vercel, but can override
- `NEXT_PUBLIC_WEB_URL` - Custom domain URL if applicable

### 2. Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `web`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3. Deployment
1. Connect GitHub repository to Vercel
2. Set Root Directory to `web`
3. Add environment variables
4. Deploy!

---

## ✅ Verification After Deployment

### Checklist:
- ⬜ Visit homepage - hero video should play
- ⬜ Check theme switching - videos should switch (dark/light)
- ⬜ Verify logo displays in navbar
- ⬜ Check social media preview (OpenGraph/Twitter images)
- ⬜ Test all routes:
  - `/` - Landing page
  - `/dashboard` - Dashboard
  - `/playground` - Playground
- ⬜ Verify API connection to Railway backend
- ⬜ Test contract analysis flow
- ⬜ Check responsive design on mobile

---

## 🐛 Known Issues / Notes

### Build Warnings (Non-Critical)
1. ⚠️ `baseline-browser-mapping` data is 2+ months old
   - **Impact:** Low - doesn't affect functionality
   - **Fix:** Run `npm i baseline-browser-mapping@latest -D` (can do later)

### Asset Handling
- ✅ All assets in `web/public/` are automatically served by Next.js
- ✅ Videos will be served from Vercel's CDN
- ✅ Images will be optimized by Next.js Image Optimization

---

## 📦 File Size Considerations

### Large Files
- `hero-bg-dark.mp4` - Should be optimized for web (< 5MB recommended)
- `hero-bg-light.mp4` - Should be optimized for web (< 5MB recommended)

**If files are too large:**
- Consider compressing videos further
- Or use external CDN (e.g., Cloudinary, Vercel Blob)
- Or convert to WebM format for better compression

**Current Status:** ✅ Files are tracked and will deploy (size not checked)

---

## 🔍 Troubleshooting

### If videos don't load after deployment:
1. Check file paths in code (should be `/hero-bg-dark.mp4`)
2. Verify files are in `web/public/` directory
3. Check browser console for 404 errors
4. Verify file sizes aren't too large (Vercel has limits)

### If images don't display:
1. Check paths in components
2. Verify Next.js Image component usage
3. Check Next.js config for image domains if needed

---

## ✅ Final Pre-Deployment Checklist

- ✅ Build succeeds locally
- ✅ All assets tracked by Git
- ✅ Environment variables documented
- ✅ Metadata base configured
- ✅ All routes working
- ⬜ Test deployment on Vercel

---

**Ready for Deployment! 🚀**

*All assets are properly configured and will be included in the Vercel deployment.*

