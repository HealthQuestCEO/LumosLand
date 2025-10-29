# LumosLand Admin Dashboard Guide

Complete guide for accessing and using the LumosLand Admin Dashboard.

---

## 🔐 How to Access the Admin Page

### For Embedded HealthQuest Mode

The admin dashboard automatically uses HealthQuest authentication. No separate login needed!

**Access URL:**
```
https://your-lumos-domain.com/admin
```

**Requirements:**
Your HealthQuest user account must have one of these:
- `user.metadata.role === 'admin'`
- `user.role === 'admin'`
- `user.isAdmin === true`
- Email contains 'admin' or 'ceo' (temporary for testing)

**How HealthQuest sends admin access:**
```javascript
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: 'user123',
    email: 'admin@healthquest.com',
    displayName: 'Admin User',
    token: 'jwt-token',
    sessionId: 'session123',
    metadata: {
      role: 'admin'  // ← This grants admin access
    }
  }
}, 'https://your-lumos-domain.com');
```

### For Standalone Mode

If running outside HealthQuest, update `AdminDashboard.jsx` to allow your email:

```javascript
// In AdminDashboard.jsx, line ~35
const userIsAdmin =
  user.metadata?.role === 'admin' ||
  user.role === 'admin' ||
  user.isAdmin === true ||
  user.email === 'your-email@example.com'; // Add your email here
```

---

## 🎯 Admin Dashboard Features

### 1. NPC Character Management

**What you can do:**
- ✅ Add new NPC characters (Lumo, pets, etc.)
- ✅ Edit character properties
- ✅ Configure emotional states (happy, sad, angry, etc.)
- ✅ Map asset URLs to each state
- ✅ Set default states
- ✅ Delete characters

**How to use:**
1. Click "NPCs" tab
2. Click "+ Add Character"
3. Fill in:
   - Character Name (e.g., "Lumo")
   - Type (e.g., "lumo", "npc", "pet")
   - Description
   - Default State (e.g., "happy")
   - States & Asset URLs (map URLs to emotional states)
4. Click "Save Character"

**States & Asset URLs:**
For each emotional state (happy, sad, etc.), enter the image/animation URL:
```
happy    → https://cdn.example.com/lumo-happy.png
sad      → https://cdn.example.com/lumo-sad.png
angry    → https://cdn.example.com/lumo-angry.png
sleepy   → https://cdn.example.com/lumo-sleepy.png
...
```

**Data Storage:**
Stored in Firebase Firestore → `AssetMapping` collection

---

### 2. Asset Manager

**What you can do:**
- ✅ Upload images (PNG, JPG, GIF, WEBP)
- ✅ Upload videos (MP4, WEBM)
- ✅ Upload audio files
- ✅ Organize assets in folders
- ✅ View all uploaded assets
- ✅ Copy asset URLs
- ✅ Open assets in new tab

**How to upload:**
1. Click "Assets" tab
2. (Optional) Enter a folder path (e.g., "characters/lumo" or "backgrounds/winter")
3. Click "Choose File"
4. Select your file
5. Upload starts automatically
6. Copy the URL when done

**Folder Structure Examples:**
```
characters/lumo/
characters/pets/
backgrounds/seasons/
ui/icons/
audio/music/
video/cutscenes/
```

**Data Storage:**
Stored in Firebase Storage → visible in Firebase Console

**Asset URL Format:**
```
https://firebasestorage.googleapis.com/v0/b/healthquest-8e631.appspot.com/o/...
```

---

### 3. Shop & Nook Items

**What you can do:**
- ✅ Add new shop items
- ✅ Edit item properties
- ✅ Set prices (coins and/or XP)
- ✅ Configure rarity levels
- ✅ Toggle item availability
- ✅ Delete items

**How to add items:**
1. Click "Shop" tab
2. Click "+ Add Item"
3. Fill in:
   - **Item Name** (e.g., "Comfy Chair")
   - **Emoji** (e.g., "🪑")
   - **Image URL** (from Asset Manager)
   - **Type** (e.g., "decoration", "food", "toy")
   - **Category** (e.g., "furniture", "clothing", "accessories")
   - **Rarity** (e.g., "common", "rare", "legendary")
   - **Price (Coins)** (e.g., 100)
   - **Price (XP)** (optional, e.g., 50)
   - **Description** (what the item does)
   - **Available** (checkbox - show in shop?)
4. Click "Save Item"

**Item Properties:**

| Property | Description | Example |
|----------|-------------|---------|
| item_name | Display name | "Comfy Chair" |
| item_emoji | Icon/emoji | "🪑" |
| item_image | Image URL | "https://..." |
| item_type | Functional category | "decoration" |
| category | Grouping | "furniture" |
| rarity | How rare/valuable | "common" |
| price_coins | Cost in coins | 100 |
| price_xp | Cost in XP | 50 |
| description | What it does | "A cozy chair for Lumo's room" |
| available | Visible in shop? | true/false |

**Data Storage:**
Stored in Firebase Firestore → `ShopItems` collection

---

### 4. Lesson Management

**What you can do:**
- ✅ Import new lessons from JSON
- ✅ Export all lessons to JSON
- ✅ Batch import multiple lessons
- ✅ Validate lesson format

**How to import a lesson:**
1. Click "Lessons" tab
2. Paste your JSON into the text area
3. Click "Import Lesson"
4. Lesson ID will be shown on success

**Lesson JSON Format:**
```json
{
  "quest": "empathy",
  "number": 1,
  "name": "Understanding Emotions",
  "description": "Learn to recognize different emotions",
  "game_format": "mcq",
  "game_style": "bubble_pop",
  "xp_reward": 50,
  "coins_reward": 50,
  "questions": [
    {
      "question": "What emotion is this?",
      "options": ["Happy", "Sad", "Angry", "Surprised"],
      "answer": 0,
      "rationale": {
        "correct": "That's right! This person is smiling and looks happy.",
        "incorrect": {
          "1": "Not quite. Sad people usually frown or cry.",
          "2": "Not this time. Angry faces are usually red and frowning.",
          "3": "Almost! But this is a happy face, not surprised."
        }
      }
    }
  ]
}
```

**Matching Game Format:**
See `HEALTHQUEST_INTEGRATION.md` for all 5 supported matching formats.

**How to export lessons:**
1. Click "Lessons" tab
2. Click "Export All Lessons"
3. JSON file downloads automatically

**Data Storage:**
Stored in Firebase Firestore → `lessons` collection

---

### 5. Rewards & Progression

**What you can do:**
- ✅ Configure XP requirements per level
- ✅ Set level multiplier (difficulty curve)
- ✅ Set maximum level
- ✅ Configure daily coin/XP limits
- ✅ Create achievement badges
- ✅ Set badge rewards

**How to configure levels:**
1. Click "Rewards" tab
2. Edit:
   - **XP per Level** - Base XP needed for level 2 (e.g., 100)
   - **Level Multiplier** - How much harder each level gets (e.g., 1.5)
   - **Max Level** - Highest achievable level (e.g., 50)
3. Preview shows XP needed for levels 1-5
4. Click "Save Configuration"

**Level Calculation:**
```
Level 1 → Level 2: 100 XP
Level 2 → Level 3: 100 × 1.5 = 150 XP
Level 3 → Level 4: 150 × 1.5 = 225 XP
Level 4 → Level 5: 225 × 1.5 = 337 XP
...
```

**How to create badges:**
1. Scroll to "Badges" section
2. Fill in:
   - Badge Name
   - Icon (emoji)
   - Description
   - Requirement (what user must do)
   - XP Reward (bonus XP for earning badge)
3. Click "Add Badge"

**Badge Examples:**
| Name | Icon | Requirement | Reward |
|------|------|-------------|--------|
| First Steps | 👣 | Complete first lesson | +10 XP |
| Empathy Master | 💚 | Complete Empathy quest | +100 XP |
| Coin Collector | 🪙 | Earn 1000 coins | +50 XP |
| Daily Streak | 🔥 | 7 day login streak | +75 XP |

**Data Storage:**
Stored in Firebase Firestore → `SystemConfig` collection → `rewards` document

---

### 6. Data Export & Backup

**What you can do:**
- ✅ Export individual collections
- ✅ Export all data at once
- ✅ Create full system backup
- ✅ Download as JSON files
- ✅ GitHub sync (coming soon)

**How to export:**

**Option 1: Export Individual Collection**
1. Click "Export" tab
2. Click the collection you want (e.g., "Lessons", "Shop Items")
3. JSON file downloads

**Option 2: Export All Collections**
1. Click "Export" tab
2. Click "Export All" card
3. All collections download as separate JSON files

**Option 3: Full Backup**
1. Click "Export" tab
2. Click "Full Backup" card
3. One JSON file with all data downloads

**Available Collections:**
- `lessons` - All lesson content
- `AssetMapping` - NPC character data
- `ShopItems` - Shop inventory
- `LumoState` - User character states
- `InventoryItem` - User inventories
- `LessonCompletion` - Progress tracking
- `ActivityLog` - User activity
- `SystemConfig` - App configuration

**Backup File Structure:**
```json
{
  "lessons": [...],
  "AssetMapping": [...],
  "ShopItems": [...],
  "metadata": {
    "created_at": "2025-01-15T10:30:00Z",
    "version": "1.0",
    "platform": "LumosLand"
  }
}
```

**GitHub Sync (Coming Soon):**
Will allow automatic pushing of exports to your GitHub repository for version control.

---

## 📊 Quick Reference

### Access Requirements

| Access Level | Requirements |
|--------------|-------------|
| Regular User | Any authenticated user |
| Admin | `role: 'admin'` in metadata OR email contains 'admin'/'ceo' |

### Database Collections

| Collection | Purpose | Admin Tab |
|------------|---------|-----------|
| `AssetMapping` | NPC characters | NPCs |
| `ShopItems` | Shop inventory | Shop |
| `lessons` | Lesson content | Lessons |
| `SystemConfig` | App settings | Rewards |
| `LumoState` | User states | (auto) |
| `InventoryItem` | User items | (auto) |
| `LessonCompletion` | Progress | (auto) |
| `ActivityLog` | Activity tracking | (auto) |

### Firebase Storage

| Path | Contents |
|------|----------|
| `/characters/` | Character images/animations |
| `/backgrounds/` | Background images |
| `/ui/` | UI elements, icons |
| `/audio/` | Sound effects, music |
| `/video/` | Cutscenes, animations |
| `/ (root)` | Other assets |

---

## 🛠️ Setup Instructions

### Step 1: Add Admin Route

In your React Router setup (e.g., `App.jsx` or `routes.jsx`):

```javascript
import AdminDashboard from './AdminDashboard';

// Add route
<Route path="/admin" element={<AdminDashboard />} />
```

### Step 2: Configure Admin Access

Edit `AdminDashboard.jsx` to set who can access admin:

```javascript
// Line ~35
const userIsAdmin =
  user.metadata?.role === 'admin' ||  // HealthQuest role
  user.role === 'admin' ||            // Direct role
  user.isAdmin === true ||            // Boolean flag
  user.email === 'your-email@example.com'; // Hardcode (dev only)
```

### Step 3: Grant Admin Role in HealthQuest

In your HealthQuest platform, when sending auth:

```javascript
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    // ... other user data
    metadata: {
      role: 'admin'  // Grant admin access
    }
  }
}, 'https://your-lumos-domain.com');
```

### Step 4: Access Admin Dashboard

Navigate to:
```
https://your-lumos-domain.com/admin
```

---

## 🚨 Troubleshooting

### "Access Denied"

**Problem:** Can't access admin dashboard

**Solutions:**
1. ✅ Check user email in error message
2. ✅ Verify `metadata.role === 'admin'` in HealthQuest auth
3. ✅ Temporarily add your email to allowed list (see Step 2)
4. ✅ Check browser console for auth errors

### "No characters/items found"

**Problem:** Collections appear empty

**Solutions:**
1. ✅ Check Firebase Firestore in Firebase Console
2. ✅ Verify collection names are correct
3. ✅ Import sample data from "Lessons" tab
4. ✅ Check Firestore rules allow admin read/write

### Upload fails

**Problem:** Can't upload assets

**Solutions:**
1. ✅ Check Firebase Storage rules
2. ✅ Verify file size < 10MB
3. ✅ Check file format is supported
4. ✅ Look for errors in browser console

### Export downloads empty file

**Problem:** Exported JSON has no data

**Solutions:**
1. ✅ Collection may actually be empty
2. ✅ Check Firestore permissions
3. ✅ Try exporting different collection
4. ✅ Verify user has read access

---

## 🔒 Security Best Practices

1. **Never commit admin emails to Git** - Use environment variables
2. **Use proper role-based access** - Don't rely on email checking
3. **Audit admin actions** - Log who changed what
4. **Backup regularly** - Use Export feature weekly
5. **Restrict Firebase rules** - Only admins should write
6. **Use strong tokens** - Validate JWT tokens properly
7. **Monitor usage** - Check Firebase usage regularly

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify Firebase connection (see Overview tab status)
3. Test with sample data (use "Load Sample" in Lessons tab)
4. Check `HEALTHQUEST_INTEGRATION.md` for auth issues

---

## 🎉 Quick Start Checklist

- [ ] Add `/admin` route to React Router
- [ ] Configure admin access in `AdminDashboard.jsx`
- [ ] Test access at `/admin` URL
- [ ] Upload test assets in Asset Manager
- [ ] Create test NPC character
- [ ] Add test shop item
- [ ] Import sample lesson
- [ ] Configure rewards settings
- [ ] Create backup export

---

**Admin Dashboard Version:** 1.0
**Last Updated:** 2025-01-29
**Compatible with:** LumosLand + HealthQuest Platform
