# LumosLand Setup Guide

## Branch Information

**Current Branch:** `claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx`

This branch contains:
- ✅ HealthQuest embedding system (no separate login)
- ✅ Universal JSON data adapter (5+ formats)
- ✅ Complete admin dashboard
- ✅ Main navigation page

---

## Quick Setup (3 Steps)

### Step 1: Use the Main App Component

In your entry file (e.g., `main.jsx` or `index.jsx`), use the new `MainApp`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
```

### Step 2: Start Development Server

```bash
npm install
npm run dev
```

### Step 3: Access the Application

Open your browser to:
- **Home:** `http://localhost:5173/`
- **Admin:** `http://localhost:5173/admin`

---

## What You Get

### Home Page (`/`)
Beautiful landing page with:
- Navigation to Admin Dashboard
- Navigation to Play/Learn section
- Links to documentation
- Feature showcase
- System status display

### Admin Dashboard (`/admin`)
Complete management interface with:
- NPC Character Management
- Asset Manager (upload files)
- Shop/Nook Item Editor
- Lesson Import/Export
- Rewards Configuration
- Data Export & Backup

### Routes Available

```
/           → Home page
/admin      → Admin dashboard
/play       → Game/lesson area (add your components)
```

---

## File Structure

```
LumosLand/
├── MainApp.jsx                      ← NEW: Main app with routing
├── AdminDashboard.jsx               ← Admin interface
├── AdminPanels.jsx                  ← NPC, Asset, Shop panels
├── AdminExportPanels.jsx            ← Lesson, Rewards, Export panels
├── LumosEmbeddedApp.jsx            ← Embedding wrapper
├── HealthQuestEmbedBridge.jsx      ← Auth bridge
├── HealthQuestIntegration.jsx      ← Integration hooks
├── MatchGameDataAdapter.jsx        ← Universal JSON adapter
├── ConnectDotsMatchGame.jsx        ← Updated match game
├── test-healthquest-embed.html     ← Test page
├── ADMIN_GUIDE.md                  ← Admin documentation
├── HEALTHQUEST_INTEGRATION.md      ← Integration guide
├── README-EMBEDDING.md             ← Quick start
└── SETUP.md                        ← This file
```

---

## Adding Your Existing Components

### Option 1: Add Routes to MainApp.jsx

Edit `MainApp.jsx` and add your lesson/game routes:

```javascript
import YourLessonComponent from './YourLessonComponent';
import YourGameComponent from './YourGameComponent';

// In the Routes section:
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/lesson/:id" element={<YourLessonComponent />} />
  <Route path="/game/:type" element={<YourGameComponent />} />
</Routes>
```

### Option 2: Use MainApp as a Wrapper

Keep your existing app structure and wrap it:

```javascript
import { LumosEmbeddedApp } from './LumosEmbeddedApp';
import YourExistingApp from './YourExistingApp';

function App() {
  return (
    <LumosEmbeddedApp>
      <YourExistingApp />
    </LumosEmbeddedApp>
  );
}
```

---

## Accessing Admin Dashboard

### For HealthQuest Embedding:

The admin dashboard checks if the authenticated user has admin role:

```javascript
// HealthQuest sends this when embedding:
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: 'user123',
    email: 'admin@healthquest.com',
    // ... other user data
    metadata: {
      role: 'admin'  // ← Grants admin access
    }
  }
}, 'https://your-domain.com');
```

### For Local Development:

Temporarily add your email to the admin check in `AdminDashboard.jsx`:

```javascript
// Line ~35 in AdminDashboard.jsx
const userIsAdmin =
  user.metadata?.role === 'admin' ||
  user.role === 'admin' ||
  user.isAdmin === true ||
  user.email === 'your-email@example.com'; // ← Add your email
```

---

## Testing the Embedding

### Step 1: Start Your App
```bash
npm run dev
# Runs on http://localhost:5173
```

### Step 2: Open Test Page
Open `test-healthquest-embed.html` in your browser, or serve it:
```bash
python -m http.server 8000
# Then open http://localhost:8000/test-healthquest-embed.html
```

### Step 3: Test Authentication
1. Click "Send Authentication" button
2. Watch connection status turn green
3. Interact with the embedded app
4. Check message log for sync events

---

## Using the Admin Dashboard

### 1. Upload Assets
- Go to `/admin` → Assets tab
- Enter folder path (optional): `characters/lumo`
- Click "Choose File"
- Select image/video
- Copy the URL when done

### 2. Create NPC Character
- Go to `/admin` → NPCs tab
- Click "+ Add Character"
- Enter name: "Lumo"
- For each state (happy, sad, etc.), paste asset URL
- Click "Save Character"

### 3. Add Shop Items
- Go to `/admin` → Shop tab
- Click "+ Add Item"
- Fill in name, emoji, price
- Paste image URL from Assets
- Click "Save Item"

### 4. Import Lessons
- Go to `/admin` → Lessons tab
- Click "Load Sample" to see format
- Paste your lesson JSON
- Click "Import Lesson"

### 5. Configure Rewards
- Go to `/admin` → Rewards tab
- Set XP per level, multiplier, max level
- Create badges with rewards
- Click "Save Configuration"

### 6. Export Data
- Go to `/admin` → Export tab
- Click "Export All" for all collections
- Or click individual collection buttons
- JSON files download automatically

---

## Environment Variables

Create a `.env` file:

```env
# Firebase (already configured in firebase.jsx)
VITE_FIREBASE_API_KEY=AIzaSyD3bQBANozGzirsNJsOpHYn0dED2kmNbss
VITE_FIREBASE_PROJECT_ID=healthquest-8e631

# HealthQuest API
VITE_API_SERVER_URL=https://api-dev.discoverhealthquest.com

# Embedding (optional)
VITE_ENABLE_EMBEDDED_MODE=true
```

---

## Common Tasks

### Change Home Page
Edit `MainApp.jsx` → `HomePage` component

### Add New Route
Edit `MainApp.jsx` → `Routes` section

### Customize Admin Dashboard
Edit `AdminDashboard.jsx`

### Add Admin Panel
Edit `AdminPanels.jsx` or `AdminExportPanels.jsx`

### Update Embedding Logic
Edit `HealthQuestEmbedBridge.jsx`

---

## Troubleshooting

### "Access Denied" on Admin Dashboard
**Solution:** Add your email to the allowed list or set `metadata.role = 'admin'` in auth

### Assets Won't Upload
**Solution:** Check Firebase Storage rules in Firebase Console

### Can't Import Lessons
**Solution:** Validate JSON format, check Firestore permissions

### Embedding Not Working
**Solution:** Check `test-healthquest-embed.html` for proper message format

---

## Documentation

Full documentation available:

1. **ADMIN_GUIDE.md** - Complete admin dashboard guide
2. **HEALTHQUEST_INTEGRATION.md** - Embedding integration
3. **README-EMBEDDING.md** - Quick start guide

---

## Need Help?

1. Check browser console for errors
2. Read the documentation files
3. Test with `test-healthquest-embed.html`
4. Verify Firebase connection in admin dashboard

---

## Branch Command

To switch to this branch:
```bash
git checkout claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx
```

To pull latest changes:
```bash
git pull origin claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx
```

---

**Current Status:** ✅ All features complete and pushed to GitHub

**Ready to use:** Yes! Just run `npm run dev` and navigate to `http://localhost:5173`
