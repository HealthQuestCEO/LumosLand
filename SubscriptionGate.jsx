import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Star, Heart, Sparkles, ArrowRight, X } from 'lucide-react';

/**
 * Subscription Gate - Lumo-Themed Popup
 *
 * Shows when user tries to access Family Hub without an active subscription.
 * Uses LumosLand branding and Lumo character to encourage subscription.
 */

export const SubscriptionGate = ({ onClose }) => {
  const [showDetails, setShowDetails] = useState(false);

  const lumoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/0a40a0a5c_Happy13.png";

  const features = [
    { icon: "👨‍👩‍👧‍👦", title: "Family Profiles", description: "Add unlimited family members" },
    { icon: "📊", title: "Guardian Tracking", description: "Monitor your children's progress" },
    { icon: "🏆", title: "Progress Reports", description: "Detailed learning analytics" },
    { icon: "🎯", title: "Custom Goals", description: "Set goals for each child" },
    { icon: "📅", title: "Activity Calendar", description: "Track daily engagement" },
    { icon: "💬", title: "Family Chat", description: "Connect with your family" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <Card className="border-4 border-purple-400 shadow-2xl overflow-hidden">
          {/* Header with Lumo */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 relative">
            {/* Lumo Character */}
            <motion.div
              className="absolute right-8 bottom-0 w-32 h-32"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={lumoUrl}
                alt="Lumo"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-8 h-8" />
                <Badge className="bg-yellow-400 text-purple-900 text-sm px-3 py-1">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium Feature
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                Family Hub Locked
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </h1>
              <p className="text-xl text-purple-100">
                Unlock Family Hub with a HealthQuest subscription!
              </p>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Lumo's Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-6 border-2 border-purple-200"
            >
              <div className="flex gap-4">
                <div className="text-4xl">💬</div>
                <div>
                  <p className="text-lg text-gray-800 mb-2">
                    <strong className="text-purple-600">Lumo says:</strong>
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    "Hi friend! The Family Hub is a special place where families can learn and grow together.
                    To unlock this amazing feature, you'll need an active HealthQuest subscription.
                    It's worth it - I promise! 🌟"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                What You'll Get:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="bg-white p-4 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Choose Your Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg text-center border-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Family Basic</p>
                  <p className="text-3xl font-bold text-purple-600 mb-2">$9.99</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-lg text-center text-white border-2 border-purple-400 transform scale-105">
                  <Badge className="bg-yellow-400 text-purple-900 mb-2">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                  <p className="text-sm mb-1">Family Plus</p>
                  <p className="text-3xl font-bold mb-2">$14.99</p>
                  <p className="text-xs opacity-90">per month</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center border-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Family Premium</p>
                  <p className="text-3xl font-bold text-purple-600 mb-2">$19.99</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-6 hover:from-purple-700 hover:to-pink-700"
                onClick={() => {
                  // Send message to HealthQuest parent to open subscription page
                  if (window.parent !== window) {
                    window.parent.postMessage({
                      type: 'LUMOS_REQUEST_SUBSCRIPTION',
                      payload: { feature: 'family_hub' }
                    }, '*');
                  }
                }}
              >
                <Crown className="w-5 h-5 mr-2" />
                Subscribe Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {onClose && (
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg py-6"
                  onClick={onClose}
                >
                  <X className="w-5 h-5 mr-2" />
                  Maybe Later
                </Button>
              )}
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already subscribed? Contact{' '}
              <a href="mailto:support@healthquest.com" className="text-purple-600 hover:underline">
                HealthQuest Support
              </a>
              {' '}if you're having trouble accessing Family Hub.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubscriptionGate;
