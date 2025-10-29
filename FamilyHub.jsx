import React, { useState, useEffect } from 'react';
import { useHealthQuestIntegration } from './HealthQuestIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, Heart, TrendingUp, Calendar, Award, Activity,
  Lock, Star, Crown, ArrowRight, CheckCircle
} from 'lucide-react';
import { SubscriptionGate } from './SubscriptionGate';

/**
 * Family Hub - Subscription-Only Feature
 *
 * This component is only accessible to users with active HealthQuest subscriptions.
 * Subscription status is managed by HealthQuest backend and passed through the bridge.
 *
 * Features:
 * - Family member management
 * - Guardian tracking dashboard
 * - Progress reports
 * - Activity monitoring
 * - Subscription-gated content
 */

const FamilyHub = () => {
  const { user, isEmbedded, isReady } = useHealthQuestIntegration();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && user) {
      // Check subscription status from HealthQuest metadata
      const subStatus =
        user.metadata?.subscription?.active ||
        user.subscription?.active ||
        user.hasSubscription ||
        false;

      const tier =
        user.metadata?.subscription?.tier ||
        user.subscription?.tier ||
        'free';

      setHasSubscription(subStatus);
      setSubscriptionTier(tier);
      setLoading(false);

      console.log('[FamilyHub] Subscription check:', {
        hasSubscription: subStatus,
        tier: tier,
        user: user.email
      });
    } else if (isReady && !user) {
      setLoading(false);
    }
  }, [user, isReady]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Family Hub...</h2>
        </div>
      </div>
    );
  }

  // Subscription gate - show Lumo-themed popup if no subscription
  if (!hasSubscription) {
    return <SubscriptionGate />;
  }

  // User has subscription - show Family Hub
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">👨‍👩‍👧‍👦</div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Family Hub
                  <Badge className="bg-yellow-400 text-purple-900">
                    <Crown className="w-3 h-3 mr-1" />
                    {subscriptionTier || 'Premium'}
                  </Badge>
                </h1>
                <p className="text-purple-100">Track progress and manage your family's learning journey</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Subscribed Family</p>
              <p className="font-semibold">{user?.displayName || user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="overview">
              <Users className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members">
              <Heart className="w-4 h-4 mr-2" />
              Family Members
            </TabsTrigger>
            <TabsTrigger value="guardian">
              <TrendingUp className="w-4 h-4 mr-2" />
              Guardian Tracking
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Activity className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Welcome to Your Family Hub!
                </CardTitle>
                <CardDescription>
                  Manage your family's LumosLand experience and track everyone's progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Subscription</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{subscriptionTier}</p>
                    <p className="text-xs text-gray-500">Active Plan</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Family Members</span>
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-xs text-gray-500">Added</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total XP</span>
                      <Award className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">0</p>
                    <p className="text-xs text-gray-500">Family Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Add Family Member</CardTitle>
                  <CardDescription>Invite children or guardians to join your family</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>View Progress Reports</CardTitle>
                  <CardDescription>See detailed analytics for all family members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Family Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>Manage profiles for children and guardians</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Family Members Yet</h3>
                  <p className="text-gray-600 mb-4">Add your first family member to get started!</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Add First Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guardian Tracking Tab */}
          <TabsContent value="guardian" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guardian Tracking Dashboard</CardTitle>
                <CardDescription>Monitor your children's activity, progress, and time spent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What You Can Track:</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Lessons completed by each child
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Time spent in LumosLand
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        XP and coins earned
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Social-emotional learning progress
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Daily activity summaries
                      </li>
                    </ul>
                  </div>

                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-gray-600">Add family members to start tracking their progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Reports</CardTitle>
                <CardDescription>Detailed analytics and insights for your family</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports Coming Soon</h3>
                  <p className="text-gray-600 mb-4">Add family members to generate reports</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FamilyHub;
