# LumosLand HealthQuest Integration Guide

Complete guide for embedding LumosLand into the HealthQuest platform without separate authentication or backend changes.

## Overview

LumosLand now supports **seamless embedding** into HealthQuest with:
- ✅ No separate login screen
- ✅ Auto-authentication from HealthQuest
- ✅ Universal JSON format adapter (no backend changes needed)
- ✅ Bi-directional communication via postMessage
- ✅ Progress and reward syncing

---

## Quick Start

### 1. Embed LumosLand in HealthQuest

```html
<!-- In your HealthQuest HTML -->
<iframe
  id="lumos-iframe"
  src="https://your-lumos-domain.com/embed"
  width="100%"
  height="100%"
  allow="autoplay; fullscreen"
  sandbox="allow-scripts allow-same-origin allow-forms"
></iframe>
```

### 2. Send Authentication

```javascript
// In your HealthQuest JavaScript
const iframe = document.getElementById('lumos-iframe');

// Wait for iframe to load
iframe.addEventListener('load', () => {
  // Send user authentication
  iframe.contentWindow.postMessage({
    type: 'HEALTHQUEST_AUTH',
    payload: {
      userId: currentUser.id,
      email: currentUser.email,
      displayName: currentUser.name,
      photoURL: currentUser.avatar,
      token: currentUser.jwt_token,
      sessionId: session.id,
      metadata: {
        // Any additional user data
        questProgress: currentUser.questProgress,
        subscription: currentUser.subscriptionTier
      }
    }
  }, 'https://your-lumos-domain.com');
});

// Listen for events from LumosLand
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-lumos-domain.com') return;

  const { type, payload } = event.data;

  switch (type) {
    case 'LUMOS_AUTH_ACK':
      console.log('LumosLand authenticated successfully');
      break;

    case 'LUMOS_LESSON_COMPLETE':
      // Update lesson completion in HealthQuest
      updateLessonProgress(payload);
      break;

    case 'LUMOS_REWARDS_EARNED':
      // Update user XP/coins in HealthQuest
      updateUserRewards(payload);
      break;

    case 'LUMOS_PROGRESS_UPDATE':
      // Sync overall progress
      updateUserProgress(payload);
      break;
  }
});
```

---

## React Integration

### Basic Setup

```javascript
// In your main app file (App.jsx or index.jsx)
import { LumosEmbeddedApp } from './LumosEmbeddedApp';
import { useHealthQuestIntegration } from './HealthQuestIntegration';

function App() {
  return (
    <LumosEmbeddedApp>
      <YourMainComponent />
    </LumosEmbeddedApp>
  );
}

// In your lesson component
function LessonComponent() {
  const { user, syncLessonComplete, syncRewards } = useHealthQuestIntegration();

  const handleLessonComplete = (completionData) => {
    // Sync with HealthQuest
    syncLessonComplete({
      lessonId: lesson.id,
      score: completionData.score,
      correctAnswers: completionData.correctAnswers,
      totalQuestions: completionData.totalQuestions
    });

    syncRewards({
      xpEarned: completionData.xpEarned,
      coinsEarned: completionData.coinsEarned
    });
  };

  return <YourLessonUI onComplete={handleLessonComplete} />;
}
```

---

## JSON Format Compatibility

The new **MatchGameDataAdapter** automatically handles ALL these formats without backend changes:

### Format 1: Base44 String Format
```json
{
  "questions": [{
    "options": [
      {"ans": "Eyes", "matching_answer": "Sight"},
      {"ans": "Ears", "matching_answer": "Hearing"}
    ]
  }]
}
```

### Format 2: HealthQuest Object Format
```json
{
  "questions": [{
    "options": [
      {"ans": "Eyes", "matching_answer": {"answerId": "1", "group": "left"}},
      {"ans": "Sight", "matching_answer": {"answerId": "1", "group": "right"}},
      {"ans": "Ears", "matching_answer": {"answerId": "2", "group": "left"}},
      {"ans": "Hearing", "matching_answer": {"answerId": "2", "group": "right"}}
    ]
  }]
}
```

### Format 3: Nested Object Format
```json
{
  "questions": [{
    "options": [
      {
        "ques": {"text": "Eyes"},
        "ans": {"text": "Sight"}
      },
      {
        "ques": {"text": "Ears"},
        "ans": {"text": "Hearing"}
      }
    ]
  }]
}
```

### Format 4: Simple Pair Format
```json
{
  "pairs": [
    {"question": "Eyes", "answer": "Sight"},
    {"question": "Ears", "answer": "Hearing"}
  ]
}
```

### Format 5: Direct Pair Format
```json
{
  "pairs": [
    {"left": "Eyes", "right": "Sight"},
    {"left": "Ears", "right": "Hearing"}
  ]
}
```

**All formats work automatically** - no code changes needed!

---

## Message Protocol

### Messages FROM HealthQuest TO LumosLand

#### 1. Authentication
```javascript
{
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: string,
    email: string,
    displayName: string,
    photoURL?: string,
    token: string,
    sessionId: string,
    metadata?: object
  }
}
```

#### 2. User Update
```javascript
{
  type: 'HEALTHQUEST_USER_UPDATE',
  payload: {
    // Any user properties to update
  }
}
```

#### 3. Logout
```javascript
{
  type: 'HEALTHQUEST_LOGOUT',
  payload: {}
}
```

#### 4. Health Check
```javascript
{
  type: 'HEALTHQUEST_PING',
  payload: {}
}
```

### Messages FROM LumosLand TO HealthQuest

#### 1. Authentication Request
```javascript
{
  type: 'LUMOS_REQUEST_AUTH',
  payload: {
    timestamp: number
  }
}
```

#### 2. Authentication Acknowledgment
```javascript
{
  type: 'LUMOS_AUTH_ACK',
  payload: {
    success: boolean,
    timestamp: number
  }
}
```

#### 3. Lesson Complete
```javascript
{
  type: 'LUMOS_LESSON_COMPLETE',
  payload: {
    userId: string,
    lessonId: string,
    lessonNumber: number,
    questName: string,
    score: number,
    correctAnswers: number,
    totalQuestions: number,
    completedAt: string (ISO date),
    timeSpent?: number,
    gameStyle?: string,
    isAssessment: boolean,
    timestamp: number
  }
}
```

#### 4. Rewards Earned
```javascript
{
  type: 'LUMOS_REWARDS_EARNED',
  payload: {
    userId: string,
    xpEarned: number,
    coinsEarned: number,
    source: string,
    sourceId?: string,
    earnedAt: string (ISO date),
    metadata?: object,
    timestamp: number
  }
}
```

#### 5. Progress Update
```javascript
{
  type: 'LUMOS_PROGRESS_UPDATE',
  payload: {
    userId: string,
    totalXP: number,
    totalCoins: number,
    lessonsCompleted: number,
    currentQuest?: string,
    lastActivity: string (ISO date),
    lumoState?: object,
    achievements?: array,
    timestamp: number
  }
}
```

#### 6. Health Check Response
```javascript
{
  type: 'LUMOS_PONG',
  payload: {
    timestamp: number,
    status: 'ready'
  }
}
```

---

## Security

### Origin Validation

LumosLand only accepts messages from these origins:
- `https://discoverhealthquest.com`
- `https://www.discoverhealthquest.com`
- `https://app.discoverhealthquest.com`
- `https://api-dev.discoverhealthquest.com`
- `http://localhost:3000` (dev)
- `http://localhost:5173` (dev)
- `http://localhost:8080` (dev)

To add more origins, edit `HealthQuestEmbedBridge.jsx`:

```javascript
const allowedOrigins = [
  'https://your-domain.com',
  // ... add more
];
```

---

## Complete Example: HealthQuest Parent Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>HealthQuest - LumosLand</title>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; }
    #lumos-iframe { border: none; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <iframe id="lumos-iframe" src="https://your-lumos-domain.com/embed"></iframe>

  <script>
    // Get current user from your auth system
    const currentUser = {
      id: 'user123',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      jwt_token: 'your-jwt-token'
    };

    const iframe = document.getElementById('lumos-iframe');
    let isAuthenticated = false;

    // Send auth when iframe loads
    iframe.addEventListener('load', () => {
      sendAuth();

      // Retry every 2 seconds until acknowledged
      const authInterval = setInterval(() => {
        if (!isAuthenticated) {
          sendAuth();
        } else {
          clearInterval(authInterval);
        }
      }, 2000);
    });

    function sendAuth() {
      iframe.contentWindow.postMessage({
        type: 'HEALTHQUEST_AUTH',
        payload: {
          userId: currentUser.id,
          email: currentUser.email,
          displayName: currentUser.name,
          photoURL: currentUser.avatar,
          token: currentUser.jwt_token,
          sessionId: Date.now().toString()
        }
      }, 'https://your-lumos-domain.com');
    }

    // Listen for messages from LumosLand
    window.addEventListener('message', (event) => {
      // Verify origin
      if (event.origin !== 'https://your-lumos-domain.com') return;

      const { type, payload } = event.data;
      console.log('Received from LumosLand:', type, payload);

      switch (type) {
        case 'LUMOS_AUTH_ACK':
          isAuthenticated = true;
          console.log('LumosLand authenticated!');
          break;

        case 'LUMOS_REQUEST_AUTH':
          sendAuth();
          break;

        case 'LUMOS_LESSON_COMPLETE':
          // Save to your backend
          fetch('/api/lessons/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          break;

        case 'LUMOS_REWARDS_EARNED':
          // Update user rewards
          fetch('/api/users/rewards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          break;

        case 'LUMOS_PROGRESS_UPDATE':
          // Update user progress
          fetch('/api/users/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          break;
      }
    });

    // Health check every 30 seconds
    setInterval(() => {
      iframe.contentWindow.postMessage({
        type: 'HEALTHQUEST_PING',
        payload: {}
      }, 'https://your-lumos-domain.com');
    }, 30000);
  </script>
</body>
</html>
```

---

## Configuration

### Environment Variables

Create a `.env` file:

```env
# HealthQuest API
VITE_API_SERVER_URL=https://api-dev.discoverhealthquest.com

# Firebase (optional, for standalone mode)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=healthquest-8e631.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=healthquest-8e631

# Embedding
VITE_ENABLE_EMBEDDED_MODE=true
VITE_PARENT_ORIGIN=https://discoverhealthquest.com
```

### URL Parameters

You can also pass configuration via URL:

```
https://your-lumos-domain.com/embed?theme=dark&hideNav=true&quest=empathy&lesson=1
```

Parameters:
- `theme` - UI theme (default, dark, light)
- `hideNav` - Hide navigation (true/false)
- `quest` - Start with specific quest
- `lesson` - Start with specific lesson
- `embedded` - Force embedded mode (true/false)

---

## Testing Locally

### 1. Run LumosLand
```bash
npm run dev
# Runs on http://localhost:5173
```

### 2. Create Test HTML
Create `test-embed.html`:

```html
<!DOCTYPE html>
<html>
<head><title>Test Embed</title></head>
<body>
  <iframe
    id="lumos"
    src="http://localhost:5173/embed"
    width="800"
    height="600"
  ></iframe>
  <script>
    const iframe = document.getElementById('lumos');
    iframe.addEventListener('load', () => {
      iframe.contentWindow.postMessage({
        type: 'HEALTHQUEST_AUTH',
        payload: {
          userId: 'test123',
          email: 'test@example.com',
          displayName: 'Test User',
          token: 'test-token',
          sessionId: 'test-session'
        }
      }, 'http://localhost:5173');
    });

    window.addEventListener('message', (e) => {
      console.log('Message from LumosLand:', e.data);
    });
  </script>
</body>
</html>
```

### 3. Open Test Page
```bash
# Serve the test HTML
python -m http.server 8000
# Open http://localhost:8000/test-embed.html
```

---

## Troubleshooting

### Authentication Not Working

**Problem:** LumosLand shows "Authentication timeout"

**Solutions:**
1. Check iframe origin matches allowed origins
2. Verify postMessage is sent after iframe load
3. Check browser console for CORS errors
4. Ensure payload has required fields (userId, email, token)

### Match Games Not Loading

**Problem:** "No matching pairs found"

**Solutions:**
1. Check JSON format in browser console (format will be logged)
2. Verify `questions[0].options` or `pairs` array exists
3. Check that each pair has both left and right values
4. Use MatchGameDataAdapter directly to test:
   ```javascript
   import { normalizeMatchingData, validateMatchingData } from './MatchGameDataAdapter';
   const result = normalizeMatchingData(yourData);
   console.log(validateMatchingData(result));
   ```

### Messages Not Received

**Problem:** Parent not receiving messages from LumosLand

**Solutions:**
1. Verify origin in message listener matches LumosLand origin
2. Check postMessage target origin is not '*'
3. Ensure iframe is fully loaded before sending
4. Check browser security settings (Content-Security-Policy)

---

## Migration from Old System

### If You Had Separate Login

**Before:**
```javascript
// Old: Separate login screen
<LoginScreen onLogin={handleLogin} />
```

**After:**
```javascript
// New: Auto-authenticated via HealthQuest
import { LumosEmbeddedApp } from './LumosEmbeddedApp';

<LumosEmbeddedApp>
  <YourApp />
</LumosEmbeddedApp>
```

### If You Had Firebase Auth Only

**Before:**
```javascript
const user = useFirebaseAuth();
```

**After:**
```javascript
const { user, isEmbedded } = useHealthQuestIntegration();
// Returns HealthQuest user if embedded, falls back to Firebase if not
```

---

## API Reference

### `LumosEmbeddedApp`
Main wrapper component for embedded mode.

```javascript
import { LumosEmbeddedApp } from './LumosEmbeddedApp';

<LumosEmbeddedApp>
  {children}
</LumosEmbeddedApp>
```

### `useHealthQuestIntegration()`
Hook for accessing HealthQuest integration.

```javascript
const {
  isEmbedded,      // boolean - running in HealthQuest?
  isReady,         // boolean - authentication complete?
  user,            // object - current user data
  syncLessonComplete,  // function
  syncRewards,         // function
  syncProgress         // function
} = useHealthQuestIntegration();
```

### `normalizeMatchingData(lessonData)`
Converts any JSON format to standard matching format.

```javascript
import { normalizeMatchingData } from './MatchGameDataAdapter';

const { pairs, format, metadata } = normalizeMatchingData(lessonData);
```

### `validateMatchingData(normalizedData)`
Validates normalized matching data.

```javascript
import { validateMatchingData } from './MatchGameDataAdapter';

const { valid, error, pairCount } = validateMatchingData(normalizedData);
```

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify JSON format with MatchGameDataAdapter
3. Test authentication flow with test HTML
4. Check HealthQuest origin is in allowed list

---

## License

This integration is part of the LumosLand project for HealthQuest.
