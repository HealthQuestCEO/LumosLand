# LumosLand Deployment Guide

## 🚀 Complete Deployment Instructions

---

## ⚠️ BEFORE YOU DEPLOY

**The app currently WILL NOT RUN** because:

1. ❌ UI components are missing (`src/components/ui/`)
2. ❌ Visual assets are missing (Lumo images, backgrounds)
3. ❌ Environment variables need configuration

**You MUST fix these first!** See `SETUP_MISSING_COMPONENTS.md`

---

## 📋 Pre-Deployment Checklist

### Step 1: Install UI Components
```bash
cd /home/user/LumosLand

# Option A: Use shadcn (recommended)
npx shadcn@latest add button card badge input textarea tabs alert table

# Option B: Copy components manually
# See SETUP_MISSING_COMPONENTS.md

# Verify:
ls src/components/ui/
# Should show: button.jsx, card.jsx, badge.jsx, etc.
```

### Step 2: Add Visual Assets
```bash
# Create assets directory
mkdir -p public/assets/characters/lumo

# Add Lumo character images (12 states):
# - happy.png, sad.png, angry.png, etc.

# OR use Firebase Storage
# Upload via Admin Dashboard → Assets tab
```

### Step 3: Configure Environment
```bash
# Create .env file
cat > .env << 'EOF'
VITE_API_SERVER_URL=https://api-dev.discoverhealthquest.com
VITE_FIREBASE_API_KEY=AIzaSyD3bQBANozGzirsNJsOpHYn0dED2kmNbss
VITE_FIREBASE_PROJECT_ID=healthquest-8e631
VITE_ENABLE_FAMILY_HUB=true
EOF
```

### Step 4: Test Locally
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
open http://localhost:5173

# Verify:
# ✅ Home page loads
# ✅ No console errors
# ✅ Buttons/cards render
# ✅ Can navigate to /admin and /family-hub
```

---

## 🔨 Building for Production

### Option 1: GitHub Pages (Static Site)

**Step 1: Build**
```bash
cd /home/user/LumosLand

# Build for GitHub Pages
npm run build

# Output will be in dist/ folder
```

**Step 2: Deploy to GitHub Pages**

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
# (Add this to "scripts" section)
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**OR manually:**
```bash
# 1. Build
npm run build

# 2. Push dist folder to gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# 3. Go back to main branch
git checkout claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx
```

**Step 3: Enable GitHub Pages**
1. Go to https://github.com/HealthQuestCEO/LumosLand/settings/pages
2. Source: Deploy from branch
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Click Save

**Your site will be at:**
```
https://healthquestceo.github.io/LumosLand/
```

### Option 2: Vercel (Recommended for React Apps)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then:
vercel --prod
```

**Configure Vercel:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: `Vite`

### Option 3: Netlify

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Build directory: dist
```

**Via Netlify UI:**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Option 4: Custom Server/VPS

**Build:**
```bash
npm run build
```

**Upload `dist/` folder** to your server:
```bash
# Via SCP
scp -r dist/* user@yourserver.com:/var/www/lumosland/

# Or use FTP/SFTP client
```

**Configure Nginx:**
```nginx
server {
    listen 80;
    server_name lumosland.yourdo main.com;
    root /var/www/lumosland;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Environment Variables for Production

### GitHub Pages
Create `.env.production`:
```env
VITE_API_SERVER_URL=https://api.discoverhealthquest.com
VITE_FIREBASE_API_KEY=AIzaSyD3bQBANozGzirsNJsOpHYn0dED2kmNbss
VITE_FIREBASE_PROJECT_ID=healthquest-8e631
```

### Vercel/Netlify
Add in dashboard:
```
VITE_API_SERVER_URL=https://api.discoverhealthquest.com
VITE_FIREBASE_API_KEY=AIzaSyD3bQBANozGzirsNJsOpHYn0dED2kmNbss
VITE_FIREBASE_PROJECT_ID=healthquest-8e631
```

---

## 📦 Package.json Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod --dir=dist"
  }
}
```

---

## 🔍 Post-Deployment Verification

### Check These URLs:

**Home Page:**
```
https://your-domain.com/LumosLand/
```

**Admin Dashboard:**
```
https://your-domain.com/LumosLand/admin
```

**Family Hub:**
```
https://your-domain.com/LumosLand/family-hub
```

### Verify Functionality:

- [ ] Home page loads
- [ ] Navigation cards work
- [ ] Admin dashboard accessible (with admin role)
- [ ] Family Hub shows subscription gate
- [ ] Firebase connection works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All images load

---

## 🚨 Common Deployment Issues

### Issue 1: Blank Page After Deploy

**Cause:** Base path incorrect

**Fix:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/LumosLand/',  // Must match your repo name!
})
```

### Issue 2: 404 on Page Refresh

**Cause:** SPA routing not configured

**Fix for GitHub Pages:**
Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/LumosLand/'">
  </head>
</html>
```

Add to `index.html` (in `<head>`):
```html
<script>
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

### Issue 3: Environment Variables Not Working

**Cause:** Not prefixed with `VITE_`

**Fix:** All env vars MUST start with `VITE_`:
```env
# ❌ Wrong
API_URL=https://api.example.com

# ✅ Correct
VITE_API_URL=https://api.example.com
```

### Issue 4: Firebase Errors

**Cause:** API keys not set or Firebase rules

**Fix:**
1. Check `.env` has correct Firebase config
2. Verify Firebase Console → Firestore Rules allow read/write
3. Check Firebase Console → Authentication enabled

### Issue 5: Images Not Loading

**Cause:** Wrong path or missing assets

**Fix:**
```javascript
// ❌ Wrong
<img src="/assets/lumo.png" />

// ✅ Correct (with base path)
<img src={`${import.meta.env.BASE_URL}assets/lumo.png`} />

// OR use absolute URL
<img src="https://your-cdn.com/assets/lumo.png" />
```

---

## 🔒 Security Before Deploy

### 1. Check Firebase Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /LumoState/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
    }

    // Allow anyone to read shop items
    match /ShopItems/{itemId} {
      allow read: if true;
      allow write: if request.auth != null; // Admins only
    }

    // Admins can access everything
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read, authenticated write
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Secure API Keys

**In production `.env`:**
- Use production Firebase project
- Use production HealthQuest API URL
- Rotate API keys if exposed

### 3. Enable CORS

**HealthQuest API must allow:**
```
Access-Control-Allow-Origin: https://healthquestceo.github.io
```

---

## 📊 Monitoring After Deploy

### Analytics

Add Google Analytics or similar:
```javascript
// In index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
```

### Error Tracking

Add Sentry or similar:
```bash
npm install @sentry/react
```

```javascript
// In src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_SERVER_URL: ${{ secrets.VITE_API_SERVER_URL }}
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Add secrets** in GitHub:
Repository Settings → Secrets → Actions → New repository secret

---

## ✅ Final Deployment Checklist

Before going live:

- [ ] UI components installed and working
- [ ] Visual assets added (Lumo, backgrounds)
- [ ] Environment variables configured
- [ ] Firebase rules set up
- [ ] Local testing passed
- [ ] Build completes without errors
- [ ] Deployed to hosting platform
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS enabled
- [ ] All routes work (home, admin, family-hub)
- [ ] HealthQuest integration tested
- [ ] Mobile responsive checked
- [ ] Performance optimized
- [ ] Analytics/monitoring set up
- [ ] Error tracking configured
- [ ] Documentation updated

---

## 🆘 Need Help?

**Build errors:**
- Check `npm install` ran successfully
- Verify all dependencies in `package.json`
- Check Node version (need 16+)

**Runtime errors:**
- Check browser console
- Verify Firebase config
- Check network tab for failed requests

**Integration issues:**
- See `HEALTHQUEST_INTEGRATION.md`
- Test with `test-healthquest-embed.html`
- Verify postMessage protocol

---

**Current Status:** ⚠️ Not ready for deployment until UI components installed

**Branch:** `claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx`

**Next Steps:**
1. Install UI components (see `SETUP_MISSING_COMPONENTS.md`)
2. Add visual assets
3. Test locally
4. Deploy!
