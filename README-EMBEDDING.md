# LumosLand HealthQuest Embedding - Quick Start

## What's New

LumosLand can now be **seamlessly embedded** into HealthQuest with:

- ✅ **No Separate Login** - Auto-authentication from HealthQuest
- ✅ **Universal JSON Adapter** - Works with ANY JSON format (no backend changes needed)
- ✅ **Bi-directional Sync** - Progress, rewards, and events sync automatically
- ✅ **Zero Configuration** - Just wrap your app and go

---

## 30-Second Integration

### 1. Wrap Your App

```javascript
// In your main App.jsx or index.jsx
import { LumosEmbeddedApp } from './LumosEmbeddedApp';

function App() {
  return (
    <LumosEmbeddedApp>
      {/* Your existing app */}
    </LumosEmbeddedApp>
  );
}
```

### 2. Embed in HealthQuest

```html
<iframe src="https://your-lumos-domain.com" width="100%" height="100%"></iframe>
```

### 3. Send Authentication

```javascript
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: currentUser.id,
    email: currentUser.email,
    displayName: currentUser.name,
    token: currentUser.jwt_token,
    sessionId: session.id
  }
}, 'https://your-lumos-domain.com');
```

**That's it!** LumosLand will automatically:
- Receive authentication
- Sync lesson completion
- Send reward updates
- Track progress

---

## Files Added

### Core Integration
- `HealthQuestEmbedBridge.jsx` - Authentication & messaging system
- `LumosEmbeddedApp.jsx` - Main wrapper component
- `HealthQuestIntegration.jsx` - React hooks for syncing

### Data Handling
- `MatchGameDataAdapter.jsx` - Universal JSON format adapter
- Updated `ConnectDotsMatchGame.jsx` - Now uses adapter

### Documentation & Testing
- `HEALTHQUEST_INTEGRATION.md` - Complete integration guide
- `test-healthquest-embed.html` - Test page for local development
- `README-EMBEDDING.md` - This file

---

## Test Locally

### 1. Start LumosLand
```bash
npm run dev
# Runs on http://localhost:5173
```

### 2. Open Test Page
```bash
# Open in browser:
open test-healthquest-embed.html
# Or serve it:
python -m http.server 8000
# Then open http://localhost:8000/test-healthquest-embed.html
```

### 3. Click "Send Authentication"
The test page will:
- Send user credentials to iframe
- Show connection status
- Log all messages
- Display lesson completions

---

## JSON Format Support

The new adapter automatically handles ALL these formats:

```javascript
// Format 1: Base44 String
{options: [{ans: "Eyes", matching_answer: "Sight"}]}

// Format 2: HealthQuest Object
{options: [{ans: "Eyes", matching_answer: {answerId: "1", group: "left"}}]}

// Format 3: Nested Objects
{options: [{ques: {text: "Eyes"}, ans: {text: "Sight"}}]}

// Format 4: Simple Pairs
{pairs: [{question: "Eyes", answer: "Sight"}]}

// Format 5: Direct Pairs
{pairs: [{left: "Eyes", right: "Sight"}]}
```

**No backend changes required!** The adapter handles everything automatically.

---

## Key Features

### Auto-Authentication
```javascript
const { user, isEmbedded } = useHealthQuestIntegration();
// Returns HealthQuest user if embedded, or null if standalone
```

### Auto-Sync Lesson Completion
```javascript
const { syncLessonComplete } = useHealthQuestIntegration();

syncLessonComplete({
  lessonId: '123',
  score: 100,
  correctAnswers: 5,
  totalQuestions: 5
});
```

### Auto-Sync Rewards
```javascript
const { syncRewards } = useHealthQuestIntegration();

syncRewards({
  xpEarned: 50,
  coinsEarned: 50
});
```

---

## Message Types

### From HealthQuest → LumosLand
- `HEALTHQUEST_AUTH` - Send user authentication
- `HEALTHQUEST_USER_UPDATE` - Update user data
- `HEALTHQUEST_LOGOUT` - Logout user
- `HEALTHQUEST_PING` - Health check

### From LumosLand → HealthQuest
- `LUMOS_REQUEST_AUTH` - Request authentication
- `LUMOS_AUTH_ACK` - Authentication successful
- `LUMOS_LESSON_COMPLETE` - Lesson completed
- `LUMOS_REWARDS_EARNED` - XP/coins earned
- `LUMOS_PROGRESS_UPDATE` - Overall progress update
- `LUMOS_PONG` - Health check response

---

## Security

Messages are only accepted from these origins:
- `https://discoverhealthquest.com`
- `https://www.discoverhealthquest.com`
- `https://app.discoverhealthquest.com`
- `http://localhost:*` (development)

Edit `HealthQuestEmbedBridge.jsx` to add more origins.

---

## Troubleshooting

### "Authentication timeout"
**Fix:** Ensure you're sending `HEALTHQUEST_AUTH` message after iframe loads.

### "No matching pairs found"
**Fix:** Check browser console for detected format. The adapter logs what it finds.

### Messages not received
**Fix:** Verify origin matching and that iframe is fully loaded.

---

## Full Documentation

See `HEALTHQUEST_INTEGRATION.md` for:
- Complete message protocol
- API reference
- Migration guide
- Security details
- Advanced configuration

---

## Questions?

1. Check `HEALTHQUEST_INTEGRATION.md` for detailed docs
2. Use `test-healthquest-embed.html` to test locally
3. Check browser console for adapter logs
4. Verify JSON format with the adapter

---

Built for **HealthQuest Platform** 🏥
