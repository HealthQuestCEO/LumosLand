import { createContext, useContext, useState, useEffect } from 'react';

/**
 * HealthQuest Embed Bridge
 *
 * This component handles seamless authentication integration when LumosLand
 * is embedded within the HealthQuest platform. It automatically receives
 * user authentication from the parent window via postMessage API.
 *
 * Features:
 * - Auto-pulls authentication from HealthQuest parent
 * - No separate login required
 * - Secure postMessage communication
 * - Fallback to Firebase auth if not embedded
 */

const HealthQuestEmbedContext = createContext(null);

export const useHealthQuestEmbed = () => {
  const context = useContext(HealthQuestEmbedContext);
  if (!context) {
    throw new Error('useHealthQuestEmbed must be used within HealthQuestEmbedProvider');
  }
  return context;
};

export const HealthQuestEmbedProvider = ({ children }) => {
  const [embeddedUser, setEmbeddedUser] = useState(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [parentOrigin, setParentOrigin] = useState(null);

  useEffect(() => {
    // Check if we're running in an iframe
    const isInIframe = window.self !== window.top;
    setIsEmbedded(isInIframe);

    if (!isInIframe) {
      console.log('[LumosEmbed] Running in standalone mode');
      setIsReady(true);
      return;
    }

    console.log('[LumosEmbed] Running in embedded mode, waiting for parent auth...');

    // Listen for authentication messages from parent HealthQuest platform
    const handleMessage = (event) => {
      // Security: Verify origin is from HealthQuest domain
      const allowedOrigins = [
        'https://discoverhealthquest.com',
        'https://www.discoverhealthquest.com',
        'https://app.discoverhealthquest.com',
        'https://api-dev.discoverhealthquest.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
      ];

      const isAllowedOrigin = allowedOrigins.some(origin =>
        event.origin.startsWith(origin)
      );

      if (!isAllowedOrigin) {
        console.warn('[LumosEmbed] Rejected message from unauthorized origin:', event.origin);
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'HEALTHQUEST_AUTH':
          console.log('[LumosEmbed] Received authentication from HealthQuest');
          setParentOrigin(event.origin);
          setEmbeddedUser({
            userId: payload.userId,
            email: payload.email,
            displayName: payload.displayName || payload.name,
            photoURL: payload.photoURL || payload.avatar,
            token: payload.token,
            sessionId: payload.sessionId,
            role: payload.role || payload.metadata?.role,
            subscription: payload.subscription || payload.metadata?.subscription || {
              active: false,
              tier: 'free'
            },
            hasSubscription: payload.hasSubscription || payload.subscription?.active || false,
            metadata: payload.metadata || {}
          });
          setIsReady(true);

          // Send acknowledgment back to parent
          event.source.postMessage({
            type: 'LUMOS_AUTH_ACK',
            payload: { success: true, timestamp: Date.now() }
          }, event.origin);
          break;

        case 'HEALTHQUEST_USER_UPDATE':
          console.log('[LumosEmbed] Received user update from HealthQuest');
          setEmbeddedUser(prev => ({
            ...prev,
            ...payload
          }));
          break;

        case 'HEALTHQUEST_LOGOUT':
          console.log('[LumosEmbed] Received logout from HealthQuest');
          setEmbeddedUser(null);
          setIsReady(false);
          break;

        case 'HEALTHQUEST_PING':
          // Respond to health check
          event.source.postMessage({
            type: 'LUMOS_PONG',
            payload: { timestamp: Date.now(), status: 'ready' }
          }, event.origin);
          break;

        default:
          console.log('[LumosEmbed] Received unknown message type:', type);
      }
    };

    window.addEventListener('message', handleMessage);

    // Request authentication from parent
    const requestAuth = () => {
      console.log('[LumosEmbed] Requesting authentication from parent...');
      window.parent.postMessage({
        type: 'LUMOS_REQUEST_AUTH',
        payload: { timestamp: Date.now() }
      }, '*');
    };

    // Request immediately and retry every 2 seconds until we get auth
    requestAuth();
    const authInterval = setInterval(() => {
      if (!embeddedUser) {
        requestAuth();
      } else {
        clearInterval(authInterval);
      }
    }, 2000);

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      if (!embeddedUser) {
        console.warn('[LumosEmbed] Authentication timeout - no response from parent');
        setIsReady(true); // Allow fallback to Firebase auth
        clearInterval(authInterval);
      }
    }, 30000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(authInterval);
      clearTimeout(timeout);
    };
  }, [embeddedUser]);

  // Send messages to parent HealthQuest platform
  const sendToParent = (type, payload) => {
    if (!isEmbedded || !parentOrigin) {
      console.warn('[LumosEmbed] Cannot send to parent - not embedded or origin unknown');
      return;
    }

    console.log('[LumosEmbed] Sending message to parent:', type);
    window.parent.postMessage({ type, payload }, parentOrigin);
  };

  // Notify parent of progress updates
  const notifyProgress = (progressData) => {
    sendToParent('LUMOS_PROGRESS_UPDATE', {
      userId: embeddedUser?.userId,
      ...progressData,
      timestamp: Date.now()
    });
  };

  // Notify parent of lesson completion
  const notifyLessonComplete = (lessonData) => {
    sendToParent('LUMOS_LESSON_COMPLETE', {
      userId: embeddedUser?.userId,
      ...lessonData,
      timestamp: Date.now()
    });
  };

  // Notify parent of XP/coins earned
  const notifyRewards = (rewardData) => {
    sendToParent('LUMOS_REWARDS_EARNED', {
      userId: embeddedUser?.userId,
      ...rewardData,
      timestamp: Date.now()
    });
  };

  // Request navigation change in parent
  const requestNavigation = (path) => {
    sendToParent('LUMOS_REQUEST_NAVIGATION', {
      path,
      timestamp: Date.now()
    });
  };

  const value = {
    isEmbedded,
    isReady,
    embeddedUser,
    parentOrigin,
    sendToParent,
    notifyProgress,
    notifyLessonComplete,
    notifyRewards,
    requestNavigation
  };

  return (
    <HealthQuestEmbedContext.Provider value={value}>
      {children}
    </HealthQuestEmbedContext.Provider>
  );
};

// Hook to get current user (embedded or Firebase)
export const useCurrentUser = () => {
  const { embeddedUser, isEmbedded, isReady } = useHealthQuestEmbed();

  // If embedded and we have a user, return that
  if (isEmbedded && embeddedUser) {
    return {
      user: embeddedUser,
      loading: false,
      isEmbedded: true
    };
  }

  // If embedded but no user yet and not ready, still loading
  if (isEmbedded && !isReady) {
    return {
      user: null,
      loading: true,
      isEmbedded: true
    };
  }

  // Otherwise fall back to Firebase auth (implement in your app)
  return {
    user: null,
    loading: false,
    isEmbedded: false,
    needsFirebaseAuth: true
  };
};

export default HealthQuestEmbedProvider;
