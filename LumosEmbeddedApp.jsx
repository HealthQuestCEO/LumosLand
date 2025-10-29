import React, { useEffect, useState } from 'react';
import { HealthQuestEmbedProvider, useHealthQuestEmbed, useCurrentUser } from './HealthQuestEmbedBridge';

/**
 * LumosLand Embedded App
 *
 * Main entry point for embedding LumosLand into HealthQuest platform.
 * This component handles:
 * - Authentication from parent window
 * - Loading states
 * - Error boundaries
 * - Seamless integration without separate login
 *
 * Usage in HealthQuest:
 * <iframe src="https://your-lumos-domain.com/embed" />
 *
 * Then send authentication:
 * iframe.contentWindow.postMessage({
 *   type: 'HEALTHQUEST_AUTH',
 *   payload: {
 *     userId: 'user123',
 *     email: 'user@example.com',
 *     displayName: 'John Doe',
 *     token: 'jwt-token-here',
 *     sessionId: 'session123'
 *   }
 * }, 'https://your-lumos-domain.com');
 */

// Loading Screen Component
const EmbedLoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse shadow-lg flex items-center justify-center">
            <span className="text-4xl">🌟</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Loading LumosLand{dots}
        </h2>
        <p className="text-gray-600">
          Connecting to HealthQuest
        </p>
      </div>
    </div>
  );
};

// Error Screen Component
const EmbedErrorScreen = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600">
            {error || 'Unable to connect to HealthQuest'}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};

// Main Embedded App Content
const EmbeddedAppContent = ({ children }) => {
  const { isEmbedded, isReady, embeddedUser } = useHealthQuestEmbed();
  const { user, loading, needsFirebaseAuth } = useCurrentUser();
  const [error, setError] = useState(null);

  // If we're embedded and waiting for auth
  if (isEmbedded && !isReady) {
    return <EmbedLoadingScreen />;
  }

  // If we're embedded but got no user after timeout
  if (isEmbedded && isReady && !embeddedUser) {
    return (
      <EmbedErrorScreen
        error="Authentication timeout. Please refresh the page."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // If we need Firebase auth (not embedded)
  if (needsFirebaseAuth) {
    return (
      <EmbedErrorScreen
        error="This app must be embedded within HealthQuest platform or configured with Firebase authentication."
      />
    );
  }

  // If still loading
  if (loading) {
    return <EmbedLoadingScreen />;
  }

  // If we have an error
  if (error) {
    return (
      <EmbedErrorScreen
        error={error}
        onRetry={() => setError(null)}
      />
    );
  }

  // Success - render the main app
  return (
    <div className="lumos-embedded-app">
      {children}
    </div>
  );
};

// Main Export - Wrap your entire app with this
export const LumosEmbeddedApp = ({ children }) => {
  return (
    <HealthQuestEmbedProvider>
      <EmbeddedAppContent>
        {children}
      </EmbeddedAppContent>
    </HealthQuestEmbedProvider>
  );
};

// Standalone hook for components that need embed context
export { useHealthQuestEmbed, useCurrentUser } from './HealthQuestEmbedBridge';

export default LumosEmbeddedApp;
