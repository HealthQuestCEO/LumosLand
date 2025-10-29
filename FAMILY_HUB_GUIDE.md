# Family Hub System - Complete Guide

## Overview

The Family Hub is a **premium, subscription-only** feature for HealthQuest subscribers. It allows families to manage profiles, track progress, and monitor children's learning journey in LumosLand.

**Key Features:**
- ✅ Subscription-based access (managed by HealthQuest backend)
- ✅ Lumo-themed subscription gate for non-subscribers
- ✅ Guardian tracking dashboard
- ✅ Family member management
- ✅ Progress reports and analytics
- ✅ Separate CEO-only admin panel

---

## 🎯 Access Control

### Family Hub (`/family-hub`)
**Who can access:** Users with active HealthQuest subscription

**Check performed:**
```javascript
user.subscription.active === true
OR
user.hasSubscription === true
OR
user.metadata.subscription.active === true
```

### Family Hub Admin (`/family-hub-admin`)
**Who can access:** CEO/Owner only

**Check performed:**
```javascript
user.role === 'ceo'
OR
user.metadata.role === 'ceo'
OR
user.email.includes('ceo')
OR
user.email.includes('owner')
```

---

## 🔐 HealthQuest Integration

### How Subscription Status is Sent

When HealthQuest embeds LumosLand, it sends subscription data:

```javascript
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: 'user123',
    email: 'user@example.com',
    displayName: 'John Doe',
    token: 'jwt-token',
    sessionId: 'session123',

    // Subscription Data (NEW!)
    subscription: {
      active: true,           // Is subscription active?
      tier: 'plus',           // Subscription tier
      expiresAt: '2025-12-31' // Optional expiration date
    },

    // Alternative format (also supported)
    hasSubscription: true,

    // Role for admin access
    role: 'user' // or 'ceo' for Family Hub Admin access
  }
}, 'https://your-lumos-domain.com');
```

### Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Basic** | $9.99/mo | Up to 3 family members |
| **Plus** | $14.99/mo | Up to 6 family members + analytics |
| **Premium** | $19.99/mo | Unlimited members + advanced features |

---

## 📱 User Flow

### For Subscribed Users

1. User clicks "Family Hub" on home page
2. Bridge checks `user.subscription.active`
3. ✅ If `true` → Shows Family Hub dashboard
4. User can:
   - Add family members
   - View guardian tracking
   - See progress reports
   - Manage family settings

### For Non-Subscribed Users

1. User clicks "Family Hub"
2. Bridge checks `user.subscription.active`
3. ❌ If `false` → Shows Lumo-themed subscription gate
4. Popup displays:
   - Lumo character with message
   - Feature showcase (6 features)
   - Subscription tier pricing
   - "Subscribe Now" button
5. When user clicks "Subscribe Now":
   ```javascript
   window.parent.postMessage({
     type: 'LUMOS_REQUEST_SUBSCRIPTION',
     payload: { feature: 'family_hub' }
   }, '*');
   ```
6. HealthQuest parent receives message and opens subscription page

---

## 🎨 Subscription Gate (Lumo-Themed Popup)

### Features

**Visual Design:**
- Gradient background (purple → pink → orange)
- Animated floating bubbles
- Lumo character animation
- Premium badges and icons

**Content:**
- Lock icon with "Premium Feature" badge
- Lumo's personalized message
- 6 feature cards showcasing benefits
- 3 subscription tier options
- "Subscribe Now" CTA button
- Help text with support link

**Features Showcased:**
1. 👨‍👩‍👧‍👦 Family Profiles - Add unlimited family members
2. 📊 Guardian Tracking - Monitor children's progress
3. 🏆 Progress Reports - Detailed learning analytics
4. 🎯 Custom Goals - Set goals for each child
5. 📅 Activity Calendar - Track daily engagement
6. 💬 Family Chat - Connect with your family

---

## 👨‍👩‍👧‍👦 Family Hub Features

### Overview Tab
- Welcome message
- Subscription status display
- Quick stats:
  - Current subscription tier
  - Number of family members
  - Total family XP
- Quick action cards:
  - Add Family Member
  - View Progress Reports

### Family Members Tab
- List of all family members
- Add new member button
- Member profiles with:
  - Name, age, role (child/guardian)
  - Avatar
  - Progress stats
  - Last activity

### Guardian Tracking Tab
- Real-time activity monitoring
- What parents can track:
  - ✅ Lessons completed by each child
  - ✅ Time spent in LumosLand
  - ✅ XP and coins earned
  - ✅ Social-emotional learning progress
  - ✅ Daily activity summaries
- Filter by child
- Date range selection

### Reports Tab
- Progress reports
- Learning analytics
- Charts and graphs
- Export options

---

## 👑 Family Hub Admin (CEO-Only)

Completely **separate** from the main admin dashboard.

### Access

**URL:** `/family-hub-admin`

**Who:** CEO/Owner only (different from regular admin role)

### Features

#### Overview Dashboard
**4 Stat Cards:**
1. Total Families
2. Active Subscriptions
3. Monthly Revenue (calculated)
4. Total Members (across all families)

#### Families Tab
- Table of all registered families
- Columns:
  - Family Name
  - Email
  - Number of Members
  - Subscription Tier
  - Status (Active/Inactive)
  - Actions (View details)
- Search functionality
- Export to CSV

#### Subscriptions Tab
- Breakdown by tier:
  - Basic tier count
  - Plus tier count
  - Premium tier count
- Total revenue calculation
- Subscription analytics
- Read-only (managed by HealthQuest backend)

#### Analytics Tab
- Usage statistics
- Engagement metrics
- Conversion rates
- Coming soon features

#### Settings Tab
- Configure subscription tiers
- Edit pricing (syncs with HealthQuest)
- Feature access control
- Integration settings

---

## 🔗 Integration with Main App

### Home Page

**New Card Added:**
```
┌──────────────────────────┐
│ 👨‍👩‍👧‍👦  Family Hub       │
│ 👑 Premium                │
│                          │
│ Track your family's      │
│ progress and manage      │
│ subscriptions            │
│                          │
│ [Open Hub →]             │
│                          │
│ • Family Profiles        │
│ • Guardian Tracking      │
│ • Progress Reports       │
└──────────────────────────┘
```

### Navigation Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | HomePage | Everyone |
| `/admin` | AdminDashboard | Admins |
| `/family-hub` | FamilyHub | Subscribers only |
| `/family-hub-admin` | FamilyHubAdmin | CEO only |
| `/play` | Games/Lessons | Everyone |

---

## 💾 Data Storage

### Firestore Collections

**FamilySubscriptions**
```javascript
{
  id: "family123",
  email: "family@example.com",
  familyName: "The Smith Family",
  subscription: {
    active: true,
    tier: "plus",
    startDate: "2025-01-01",
    expiresAt: "2026-01-01"
  },
  members: [
    {
      id: "member1",
      name: "Child 1",
      age: 8,
      role: "child",
      avatar: "url"
    },
    {
      id: "member2",
      name: "Parent",
      age: 35,
      role: "guardian",
      avatar: "url"
    }
  ],
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-15T00:00:00Z"
}
```

---

## 📬 Messages Between LumosLand and HealthQuest

### From HealthQuest → LumosLand

**1. Authentication with Subscription**
```javascript
{
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: string,
    email: string,
    displayName: string,
    token: string,
    subscription: {
      active: boolean,
      tier: 'basic' | 'plus' | 'premium'
    },
    role: 'user' | 'admin' | 'ceo'
  }
}
```

### From LumosLand → HealthQuest

**1. Request Subscription**
```javascript
{
  type: 'LUMOS_REQUEST_SUBSCRIPTION',
  payload: {
    feature: 'family_hub',
    timestamp: number
  }
}
```

**2. Family Member Added**
```javascript
{
  type: 'LUMOS_FAMILY_MEMBER_ADDED',
  payload: {
    familyId: string,
    memberId: string,
    memberName: string,
    timestamp: number
  }
}
```

---

## 🚀 Setup Instructions

### Step 1: Update HealthQuest Auth Payload

In your HealthQuest platform, update the authentication message:

```javascript
// BEFORE (old format)
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: user.id,
    email: user.email,
    displayName: user.name,
    token: user.token
  }
}, '*');

// AFTER (new format with subscription)
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: user.id,
    email: user.email,
    displayName: user.name,
    token: user.token,

    // ADD THESE:
    subscription: {
      active: user.hasActiveSubscription,  // boolean
      tier: user.subscriptionTier           // 'basic' | 'plus' | 'premium'
    },
    role: user.role  // 'user' | 'admin' | 'ceo'
  }
}, '*');
```

### Step 2: Handle Subscription Requests

Listen for subscription requests from LumosLand:

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'LUMOS_REQUEST_SUBSCRIPTION') {
    // User clicked "Subscribe Now" in LumosLand
    // Redirect to your subscription page
    window.location.href = '/subscribe?feature=' + event.data.payload.feature;
  }
});
```

### Step 3: Test Locally

**Test with subscription:**
```javascript
// In test-healthquest-embed.html
iframe.contentWindow.postMessage({
  type: 'HEALTHQUEST_AUTH',
  payload: {
    userId: 'test123',
    email: 'test@example.com',
    displayName: 'Test User',
    token: 'test-token',
    sessionId: 'session123',
    subscription: {
      active: true,      // ← Set to true
      tier: 'plus'
    }
  }
}, '*');
```

**Test without subscription:**
```javascript
// Set active to false
subscription: {
  active: false,  // ← Will show subscription gate
  tier: 'free'
}
```

**Test CEO access:**
```javascript
// Add role: 'ceo'
payload: {
  // ... other fields
  role: 'ceo'  // ← Grants Family Hub Admin access
}
```

---

## 📊 Analytics & Metrics

### For CEO Admin

The Family Hub Admin dashboard automatically calculates:

**Revenue Metrics:**
- Monthly Recurring Revenue (MRR)
- Average Revenue Per Family (ARPF)
- Subscription tier distribution

**Engagement Metrics:**
- Total families registered
- Active subscription rate
- Average family size
- Member engagement

---

## 🎯 Use Cases

### Parent Use Case
1. Subscribe to HealthQuest
2. Access Family Hub in LumosLand
3. Add children's profiles
4. Set learning goals
5. Track daily progress
6. Review weekly reports

### CEO/Admin Use Case
1. Log in with CEO credentials
2. Navigate to `/family-hub-admin`
3. View all family subscriptions
4. Monitor revenue and engagement
5. Export data for analysis
6. Manage subscription tiers

---

## ⚠️ Important Notes

1. **Subscription Management:** All subscription logic (billing, activation, cancellation) is handled by HealthQuest backend, not LumosLand.

2. **Security:** Family Hub checks subscription status on every load. If subscription expires, access is immediately revoked.

3. **Data Sync:** LumosLand reads subscription status from HealthQuest auth payload. No separate API calls needed.

4. **CEO vs Admin:**
   - **Admin** (`/admin`) → Main admin dashboard (content management)
   - **CEO** (`/family-hub-admin`) → Family Hub admin (subscription management)
   - These are completely separate!

5. **Subscription Gate:** The popup is shown client-side. Backend must still verify subscription status on all API calls.

---

## 🐛 Troubleshooting

### "Subscription Gate Shows Even Though I'm Subscribed"

**Check:**
1. HealthQuest auth payload includes `subscription: { active: true }`
2. Browser console logs show subscription status
3. Refresh page after subscribing

### "Can't Access Family Hub Admin"

**Check:**
1. User role is set to `'ceo'` in auth payload
2. OR email contains 'ceo' or 'owner'
3. Try accessing `/family-hub-admin` directly

### "Subscribe Now Button Does Nothing"

**Check:**
1. HealthQuest parent window is listening for `LUMOS_REQUEST_SUBSCRIPTION` message
2. Browser console for errors
3. Origin checking is correct

---

## 📁 File Reference

| File | Purpose | Lines |
|------|---------|-------|
| `FamilyHub.jsx` | Main family hub component | 350 |
| `SubscriptionGate.jsx` | Lumo-themed subscription popup | 280 |
| `FamilyHubAdmin.jsx` | CEO-only admin panel | 346 |
| `HealthQuestEmbedBridge.jsx` | Updated with subscription handling | 200 |
| `MainApp.jsx` | Updated with routes and navigation | 334 |

---

## ✅ Summary

The Family Hub system provides:

✅ **Subscription-based access** - Managed by HealthQuest backend
✅ **Beautiful UX** - Lumo-themed subscription gate
✅ **Guardian tracking** - Monitor children's progress
✅ **CEO admin** - Separate admin panel for subscription management
✅ **Seamless integration** - Works with existing HealthQuest auth
✅ **No backend changes** - Reads from auth payload

**Branch:** `claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx`

**Ready to use!** 🚀
