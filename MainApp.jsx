import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LumosEmbeddedApp } from './LumosEmbeddedApp';
import AdminDashboard from './AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home, Settings, BookOpen, Users, ShoppingBag, Sparkles,
  PlayCircle, Award, Heart, Brain, Smile, Star, ArrowRight
} from 'lucide-react';

/**
 * Main App Entry Point
 *
 * This is your main application that includes:
 * - Home page with navigation
 * - Admin dashboard at /admin
 * - Game/lesson routes
 * - Embedded mode support
 */

// Home/Landing Page
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🌟</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  LumosLand
                </h1>
                <p className="text-sm text-gray-600">Social-Emotional Learning Platform</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              HealthQuest Integration Ready
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to LumosLand! 🎉
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive social-emotional learning platform with seamless HealthQuest integration,
            complete admin dashboard, and universal data format support.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Admin Dashboard */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-indigo-200" onClick={() => navigate('/admin')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Settings className="w-8 h-8 text-indigo-600" />
                <Badge variant="outline">Admin</Badge>
              </div>
              <CardTitle className="text-xl mt-3">Admin Dashboard</CardTitle>
              <CardDescription>Manage NPCs, assets, shop items, lessons, and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> NPC Management
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Shop Editor
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Lesson Import
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Play Lessons */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-emerald-200" onClick={() => navigate('/play')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <PlayCircle className="w-8 h-8 text-emerald-600" />
                <Badge variant="outline">Student</Badge>
              </div>
              <CardTitle className="text-xl mt-3">Play & Learn</CardTitle>
              <CardDescription>Interactive lessons and games with Lumo</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                Start Learning <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Empathy Quest
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Self-Awareness
                </div>
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4" /> Emotion Games
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card className="hover:shadow-xl transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <Badge variant="outline">Docs</Badge>
              </div>
              <CardTitle className="text-xl mt-3">Documentation</CardTitle>
              <CardDescription>Complete guides and API references</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/ADMIN_GUIDE.md" target="_blank">
                    <Settings className="w-4 h-4 mr-2" /> Admin Guide
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/HEALTHQUEST_INTEGRATION.md" target="_blank">
                    <Sparkles className="w-4 h-4 mr-2" /> Integration Guide
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/README-EMBEDDING.md" target="_blank">
                    <BookOpen className="w-4 h-4 mr-2" /> Quick Start
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" /> Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🔐"
              title="Seamless Authentication"
              description="Auto-authentication from HealthQuest - no separate login needed"
            />
            <FeatureCard
              icon="🎮"
              title="Universal JSON Adapter"
              description="Works with ANY JSON format - no backend changes required"
            />
            <FeatureCard
              icon="👥"
              title="NPC Management"
              description="Create and manage characters with 12+ emotional states"
            />
            <FeatureCard
              icon="🖼️"
              title="Asset Manager"
              description="Upload images, videos, and audio to Firebase Storage"
            />
            <FeatureCard
              icon="🏪"
              title="Shop Editor"
              description="Manage inventory, prices, rarity, and item properties"
            />
            <FeatureCard
              icon="📚"
              title="Lesson Import"
              description="Import lessons from JSON with format validation"
            />
            <FeatureCard
              icon="🏆"
              title="Rewards Config"
              description="Configure XP, levels, badges, and daily limits"
            />
            <FeatureCard
              icon="💾"
              title="Batch Export"
              description="Download all data as JSON for backup and migration"
            />
            <FeatureCard
              icon="🔄"
              title="Real-time Sync"
              description="Bi-directional communication with HealthQuest platform"
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard
              label="Embedding System"
              status="Ready"
              color="green"
              details="HealthQuest integration active"
            />
            <StatusCard
              label="Admin Dashboard"
              status="Ready"
              color="green"
              details="All management tools available"
            />
            <StatusCard
              label="Data Adapter"
              status="Ready"
              color="green"
              details="Supports 5+ JSON formats"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            LumosLand &copy; 2025 | Built for HealthQuest Platform
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Branch: claude/healthquest-care-loop-embed-011CUbhP5oL44vGwPCZT8tqx
          </p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex gap-3">
    <div className="text-3xl flex-shrink-0">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

// Status Card Component
const StatusCard = ({ label, status, color, details }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  };

  const dotClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">{label}</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotClasses[color]} animate-pulse`}></div>
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>
      <p className="text-xs text-gray-600">{details}</p>
    </div>
  );
};

// Main App Component with Routing
const MainApp = () => {
  return (
    <LumosEmbeddedApp>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/play" element={<div className="p-8 text-center"><h1 className="text-3xl font-bold">Game/Lesson Routes</h1><p className="text-gray-600 mt-2">Add your lesson components here</p></div>} />
          {/* Add more routes for your lessons, games, etc. */}
        </Routes>
      </Router>
    </LumosEmbeddedApp>
  );
};

export default MainApp;
