# LumosLand - Source of Truth

## 📊 Data Flow Architecture

This document defines the complete data architecture, sources of truth, sync patterns, and required endpoints for LumosLand + HealthQuest integration.

---

## 🎯 Primary Data Sources

### 1. HealthQuest Backend (Primary Source)
**Authority:** User authentication, subscriptions, lesson content
**Location:** `https://api-dev.discoverhealthquest.com`
**Owned By:** HealthQuest Team

### 2. Firebase Firestore (LumosLand State)
**Authority:** User progress, Lumo state, inventory, activity logs
**Location:** Firebase Project `healthquest-8e631`
**Owned By:** LumosLand / HealthQuest

### 3. Firebase Storage (Assets)
**Authority:** Images, videos, character animations
**Location:** Firebase Storage `healthquest-8e631`
**Owned By:** LumosLand Admin

---

## 🔄 Data Sync Patterns

### Pattern 1: HealthQuest → LumosLand (One-Way)
**What:** User authentication, subscription status, lesson content
**When:** On app load, on subscription change
**How:** PostMessage API (iframe embedding)

```
HealthQuest Parent Window
    ↓ (postMessage)
LumosLand Iframe
    ↓ (stores in React state)
Application Components
```

### Pattern 2: LumosLand → Firebase (Write)
**What:** User progress, XP, coins, inventory, activity
**When:** Real-time as user plays
**How:** Firebase SDK direct write

```
User Action (completes lesson)
    ↓
React Component
    ↓
Firebase SDK
    ↓
Firestore Database
```

### Pattern 3: LumosLand → HealthQuest (Notify)
**What:** Lesson completion, rewards earned, progress updates
**When:** After important events
**How:** PostMessage API back to parent

```
User Completes Lesson
    ↓
LumosLand
    ↓ (postMessage)
HealthQuest Parent
    ↓ (updates backend)
HealthQuest Database
```

### Pattern 4: Bi-Directional Sync
**What:** Subscription status changes
**When:** User subscribes/unsubscribes
**How:** HealthQuest updates, then sends new auth to LumosLand

```
User Subscribes on HealthQuest
    ↓
HealthQuest Backend Updates
    ↓
HealthQuest sends HEALTHQUEST_AUTH message
    ↓
LumosLand updates subscription state
```

---

## 📦 Data Ownership Map

| Data Type | Source of Truth | Where It Lives | Who Can Write |
|-----------|-----------------|----------------|---------------|
| **User Authentication** | HealthQuest | HealthQuest DB | HealthQuest Backend |
| **Subscription Status** | HealthQuest | HealthQuest DB | HealthQuest Backend |
| **Lesson Content** | HealthQuest | HealthQuest DB + Firestore | HealthQuest Team |
| **User XP** | LumosLand | Firestore: `LumoState` | LumosLand |
| **User Coins** | LumosLand | Firestore: `LumoState` | LumosLand |
| **Lesson Completion** | LumosLand | Firestore: `LessonCompletion` | LumosLand |
| **Inventory Items** | LumosLand | Firestore: `InventoryItem` | LumosLand |
| **Lumo Emotional State** | LumosLand | Firestore: `LumoState` | LumosLand |
| **Shop Items** | LumosLand Admin | Firestore: `ShopItems` | LumosLand Admin |
| **NPC Characters** | LumosLand Admin | Firestore: `AssetMapping` | LumosLand Admin |
| **Asset Files** | LumosLand Admin | Firebase Storage | LumosLand Admin |
| **Family Subscriptions** | HealthQuest | HealthQuest DB | HealthQuest Backend |
| **Family Members** | LumosLand | Firestore: `FamilySubscriptions` | LumosLand |

---

## 🔌 Required Endpoints

### HealthQuest Backend Endpoints (Need to Exist)

#### 1. User Authentication
```
GET /api/v1/users/{userId}
Response:
{
  "userId": "string",
  "email": "string",
  "displayName": "string",
  "role": "user" | "admin" | "ceo",
  "subscription": {
    "active": boolean,
    "tier": "free" | "basic" | "plus" | "premium",
    "startDate": "ISO date",
    "expiresAt": "ISO date"
  }
}
```

#### 2. Subscription Management
```
POST /api/v1/subscriptions/subscribe
Body: { userId, tier, paymentMethodId }
Response: { success, subscriptionId }

POST /api/v1/subscriptions/cancel
Body: { userId, subscriptionId }
Response: { success }

GET /api/v1/subscriptions/{userId}
Response: { active, tier, expiresAt }
```

#### 3. Lesson Content
```
GET /api/v1/quests/{questId}
Response: { quest data }

GET /api/v1/quests/{questId}/lessons/{lessonNumber}
Response: { lesson data with questions }

GET /api/v1/lessons/{lessonId}
Response: { complete lesson object }
```

#### 4. Progress Sync (Optional)
```
POST /api/v1/users/{userId}/progress
Body: {
  lessonId, score, completedAt, timeSpent,
  coinsEarned, xpEarned
}
Response: { success }

GET /api/v1/users/{userId}/progress
Response: { lessons: [], totalXP, totalCoins }
```

### Firebase Endpoints (Already Exist via SDK)

#### Firestore Collections
```
/LumoState/{userId}
/LessonCompletion/{completionId}
/InventoryItem/{itemId}
/ActivityLog/{logId}
/AssetMapping/{assetId}
/ShopItems/{itemId}
/FamilySubscriptions/{familyId}
/SystemConfig/rewards
```

#### Firebase Storage
```
/characters/{character}/{state}.png
/backgrounds/{season}/{name}.jpg
/ui/icons/{icon}.svg
/audio/music/{track}.mp3
/video/cutscenes/{scene}.mp4
```

---

## 🔄 Complete Data Flow Examples

### Example 1: User Logs In

```mermaid
sequenceDiagram
    User->>HealthQuest: Logs in
    HealthQuest->>HealthQuest DB: Verify credentials
    HealthQuest DB-->>HealthQuest: User data + subscription
    HealthQuest->>LumosLand Iframe: postMessage(HEALTHQUEST_AUTH)
    LumosLand Iframe->>React State: Store user + subscription
    LumosLand Iframe->>Firestore: Load user's LumoState
    Firestore-->>LumosLand Iframe: XP, coins, inventory
    LumosLand Iframe->>User: Show personalized UI
```

### Example 2: User Completes Lesson

```mermaid
sequenceDiagram
    User->>LumosLand: Completes lesson
    LumosLand->>Firestore: Save LessonCompletion
    LumosLand->>Firestore: Update LumoState (XP +50, Coins +50)
    LumosLand->>HealthQuest: postMessage(LUMOS_LESSON_COMPLETE)
    HealthQuest->>HealthQuest DB: Update progress
    HealthQuest->>HealthQuest DB: Award achievements
    HealthQuest-->>LumosLand: postMessage(HEALTHQUEST_ACHIEVEMENT)
    LumosLand->>User: Show rewards screen
```

### Example 3: User Subscribes to Family Hub

```mermaid
sequenceDiagram
    User->>LumosLand: Clicks "Subscribe Now"
    LumosLand->>HealthQuest: postMessage(LUMOS_REQUEST_SUBSCRIPTION)
    HealthQuest->>User: Redirect to /subscribe
    User->>HealthQuest: Completes payment
    HealthQuest->>HealthQuest DB: Create subscription
    HealthQuest->>Stripe/Payment: Process payment
    Stripe-->>HealthQuest: Payment successful
    HealthQuest->>LumosLand: postMessage(HEALTHQUEST_AUTH) [updated]
    LumosLand->>React State: Update subscription.active = true
    LumosLand->>User: Show Family Hub
```

### Example 4: Admin Uploads Asset

```mermaid
sequenceDiagram
    Admin->>LumosLand Admin: Uploads image
    LumosLand Admin->>Firebase Storage: Upload file
    Firebase Storage-->>LumosLand Admin: URL
    LumosLand Admin->>Firestore: Save AssetMapping
    LumosLand Admin->>User: Show success + URL
```

---

## 📝 Firestore Data Models

### LumoState
```javascript
{
  user_email: "user@example.com",
  coins: 150,
  xp: 350,
  level: 3,
  hunger: 50,      // 0-100
  thirst: 80,      // 0-100
  cleanliness: 60, // 0-100
  emotion: "happy", // current emotion
  last_updated: Timestamp,
  last_fed: Timestamp,
  last_watered: Timestamp,
  last_bath: Timestamp
}
```

### LessonCompletion
```javascript
{
  user_email: "user@example.com",
  lesson_id: "empathy-1",
  quest: "empathy",
  lesson_number: 1,
  score: 100,
  correct_answers: 5,
  total_questions: 5,
  completed_at: Timestamp,
  time_spent: 180, // seconds
  coins_earned: 50,
  xp_earned: 50,
  game_style: "bubble_pop"
}
```

### InventoryItem
```javascript
{
  user_email: "user@example.com",
  item_name: "Comfy Chair",
  item_emoji: "🪑",
  item_image: "https://...",
  item_type: "decoration",
  room_location: "bedroom",
  position_x: 100,
  position_y: 150,
  purchased_at: Timestamp,
  price_paid: 100
}
```

### ShopItems
```javascript
{
  item_name: "Comfy Chair",
  item_emoji: "🪑",
  item_image: "https://...",
  item_type: "decoration",
  category: "furniture",
  rarity: "common",
  price_coins: 100,
  price_xp: 0,
  description: "A cozy chair for Lumo",
  available: true
}
```

### FamilySubscriptions
```javascript
{
  email: "family@example.com",
  familyName: "The Smith Family",
  subscription: {
    active: true,
    tier: "plus",
    startDate: Timestamp,
    expiresAt: Timestamp
  },
  members: [
    {
      id: "member1",
      name: "Child 1",
      age: 8,
      role: "child",
      avatar: "https://..."
    }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔐 Authentication Flow

### Embedded Mode (Production)
```
1. User logs into HealthQuest platform
2. HealthQuest generates JWT token
3. HealthQuest embeds LumosLand in iframe
4. HealthQuest sends HEALTHQUEST_AUTH via postMessage:
   {
     type: 'HEALTHQUEST_AUTH',
     payload: {
       userId: string,
       email: string,
       displayName: string,
       photoURL: string,
       token: string (JWT),
       sessionId: string,
       role: 'user' | 'admin' | 'ceo',
       subscription: {
         active: boolean,
         tier: string
       },
       metadata: object
     }
   }
5. LumosLand stores in React context via HealthQuestEmbedProvider
6. All components access via useHealthQuestIntegration()
```

### Standalone Mode (Development/Fallback)
```
1. User visits LumosLand directly
2. LumosLand detects not in iframe
3. Falls back to Firebase Auth (if configured)
4. OR shows "Must be accessed via HealthQuest" message
```

---

## 🔄 Sync Triggers

### Real-Time Sync (Immediate)
- ✅ Lesson completion → Firestore + HealthQuest
- ✅ XP/Coins earned → Firestore + HealthQuest
- ✅ Inventory purchase → Firestore
- ✅ Lumo state change → Firestore

### Periodic Sync (Every 5 minutes)
- ⏰ Activity heartbeat → Firestore
- ⏰ Session duration → Firestore

### On-Demand Sync (User-triggered)
- 👆 Refresh subscription status → HealthQuest
- 👆 Export data → Download from Firestore
- 👆 Family member add → Firestore + HealthQuest

---

## 📍 PostMessage Protocol

### From HealthQuest → LumosLand

| Message Type | When Sent | Data |
|--------------|-----------|------|
| `HEALTHQUEST_AUTH` | On load, on login, on subscription change | Full user object with subscription |
| `HEALTHQUEST_USER_UPDATE` | When user profile changes | Updated user fields |
| `HEALTHQUEST_LOGOUT` | When user logs out | Empty |
| `HEALTHQUEST_PING` | Health check (every 30s) | Empty |
| `HEALTHQUEST_ACHIEVEMENT` | When achievement unlocked | Achievement data |

### From LumosLand → HealthQuest

| Message Type | When Sent | Data |
|--------------|-----------|------|
| `LUMOS_REQUEST_AUTH` | On iframe load | Empty (requests auth) |
| `LUMOS_AUTH_ACK` | After receiving auth | Success confirmation |
| `LUMOS_LESSON_COMPLETE` | Lesson finished | Lesson data + score |
| `LUMOS_REWARDS_EARNED` | XP/coins earned | Reward amounts |
| `LUMOS_PROGRESS_UPDATE` | Progress milestone | Progress data |
| `LUMOS_REQUEST_SUBSCRIPTION` | "Subscribe Now" clicked | Feature name |
| `LUMOS_FAMILY_MEMBER_ADDED` | Family member added | Member data |
| `LUMOS_PONG` | Response to ping | Status |

---

## 🎨 Design System (Missing - Needs Creation)

### Colors (Need to Define)
```css
/* Primary Colors */
--primary-green: #10b981;
--secondary-green: #66bfad;
--primary-orange: #ffa400;
--secondary-orange: #ff8c00;
--primary-blue: #1165b3;

/* UI Colors */
--purple-primary: #8b5cf6;
--pink-primary: #ec4899;
--background: #f9fafb;
```

### Typography (Need to Define)
```css
/* Fonts */
--font-main: 'Inter', sans-serif;
--font-headings: 'Poppins', sans-serif;
```

### Assets Needed
```
❌ Lumo character states (12 emotions)
❌ Background images (5 rooms + seasons)
❌ UI icons and buttons
❌ Shop item images
❌ Badge/achievement graphics
❌ Loading animations
```

---

## ⚠️ Critical Missing Pieces

### 1. UI Component Library
**Status:** ❌ MISSING
**Location:** `src/components/ui/`
**Files Needed:** button.jsx, card.jsx, input.jsx, etc. (20+ files)
**Solution:** Install shadcn/ui components

### 2. Visual Assets
**Status:** ❌ MISSING
**What's Needed:**
- Lumo character images (12 emotional states)
- Room backgrounds (5 rooms × 4 seasons)
- UI elements (buttons, borders, decorations)
- Shop item images
- Icons and badges

### 3. CSS/Styling
**Status:** ⚠️ PARTIAL
**What Exists:** Basic Tailwind setup
**What's Needed:**
- Custom component styles
- Animation definitions
- Responsive breakpoints

### 4. Environment Configuration
**Status:** ⚠️ NEEDS UPDATE
**File:** `.env`
**Required Variables:**
```env
VITE_API_SERVER_URL=https://api-dev.discoverhealthquest.com
VITE_FIREBASE_API_KEY=AIzaSyD3bQBANozGzirsNJsOpHYn0dED2kmNbss
VITE_FIREBASE_PROJECT_ID=healthquest-8e631
```

---

## ✅ Next Steps to Make It Work

### Phase 1: Install UI Components
1. Install shadcn/ui CLI
2. Add all required components
3. Configure paths in vite.config.js

### Phase 2: Add Visual Assets
1. Create/acquire Lumo character images
2. Add background images
3. Add UI icons and decorations
4. Upload to Firebase Storage

### Phase 3: Configure Endpoints
1. Set up HealthQuest API endpoints
2. Configure Firebase
3. Test authentication flow

### Phase 4: Test Data Flow
1. Test HealthQuest → LumosLand auth
2. Test lesson completion sync
3. Test subscription flow
4. Test admin operations

---

## 📞 Integration Checklist for HealthQuest Team

- [ ] Create subscription API endpoints
- [ ] Add subscription field to user model
- [ ] Implement JWT token generation
- [ ] Set up iframe embedding
- [ ] Configure postMessage listeners
- [ ] Test authentication flow
- [ ] Test subscription updates
- [ ] Configure CORS for API
- [ ] Set up webhook for subscription changes
- [ ] Document API for LumosLand team

---

**This document is the SOURCE OF TRUTH for LumosLand data architecture.**

Last Updated: 2025-01-29
Branch: claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx
