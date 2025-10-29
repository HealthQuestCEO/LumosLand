import React, { useState, useEffect } from 'react';
import { useHealthQuestIntegration } from './HealthQuestIntegration';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users, TrendingUp, DollarSign, Settings, Shield, Lock,
  Crown, CheckCircle, XCircle, Download, Search
} from 'lucide-react';

/**
 * Family Hub Admin - CEO/Owner Only
 *
 * Separate admin panel for managing Family Hub features.
 * Only accessible to CEO/Owner role - completely separate from main admin.
 *
 * Access Control: user.role === 'ceo' OR user.email contains 'ceo'
 */

const FamilyHubAdmin = () => {
  const { user, isReady } = useHealthQuestIntegration();
  const [isCEO, setIsCEO] = useState(false);
  const [loading, setLoading] = useState(true);
  const [families, setFamilies] = useState([]);
  const [stats, setStats] = useState({
    totalFamilies: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalMembers: 0
  });

  useEffect(() => {
    if (isReady && user) {
      // CEO-only access check
      const userIsCEO =
        user.metadata?.role === 'ceo' ||
        user.role === 'ceo' ||
        user.email?.toLowerCase().includes('ceo') ||
        user.email?.toLowerCase().includes('owner');

      setIsCEO(userIsCEO);
      setLoading(false);

      if (userIsCEO) {
        loadFamilyData();
      }
    } else if (isReady && !user) {
      setLoading(false);
    }
  }, [user, isReady]);

  const loadFamilyData = async () => {
    try {
      // Load family subscriptions from Firestore
      const snapshot = await getDocs(collection(db, 'FamilySubscriptions'));
      const familyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setFamilies(familyList);

      // Calculate stats
      const activeCount = familyList.filter(f => f.subscription?.active).length;
      const totalMembers = familyList.reduce((sum, f) => sum + (f.members?.length || 0), 0);
      const revenue = familyList.reduce((sum, f) => {
        if (!f.subscription?.active) return sum;
        const tierPrices = { basic: 9.99, plus: 14.99, premium: 19.99 };
        return sum + (tierPrices[f.subscription?.tier] || 0);
      }, 0);

      setStats({
        totalFamilies: familyList.length,
        activeSubscriptions: activeCount,
        totalRevenue: revenue,
        totalMembers: totalMembers
      });
    } catch (error) {
      console.error('[FamilyHubAdmin] Error loading data:', error);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Family Hub Admin...</h2>
        </div>
      </div>
    );
  }

  // Access Denied
  if (!isCEO) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-red-500" />
              <CardTitle className="text-2xl">Access Denied</CardTitle>
            </div>
            <CardDescription>CEO/Owner access only</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Shield className="w-4 h-4" />
              <AlertDescription>
                This is the Family Hub Admin panel - restricted to CEO/Owner only.
                {user ? ` Logged in as: ${user.email}` : ' Please log in.'}
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p><strong>To gain access:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your role must be: "ceo" or "owner"</li>
                <li>OR your email must contain "ceo"</li>
                <li>Contact HealthQuest admin to update your role</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CEO Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                Family Hub Admin
                <Badge className="bg-red-500 text-white">CEO Only</Badge>
              </h1>
              <p className="text-slate-300 mt-1">
                Manage family subscriptions and analytics
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Logged in as</p>
              <p className="font-semibold">{user?.displayName || user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Families</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFamilies}</div>
              <p className="text-xs text-gray-500 mt-1">Registered families</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-gray-500 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">Recurring monthly</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-gray-500 mt-1">Across all families</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="families" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="families">
              <Users className="w-4 h-4 mr-2" />
              Families
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <Crown className="w-4 h-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Families Tab */}
          <TabsContent value="families">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Families</CardTitle>
                    <CardDescription>Manage family accounts and subscriptions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Search families..." className="w-64" />
                    <Button variant="outline">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {families.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                    <p className="text-gray-600">No families registered yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Family Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {families.map(family => (
                        <TableRow key={family.id}>
                          <TableCell className="font-medium">{family.familyName || 'N/A'}</TableCell>
                          <TableCell>{family.email}</TableCell>
                          <TableCell>{family.members?.length || 0}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {family.subscription?.tier || 'none'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {family.subscription?.active ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>View and manage all family subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Crown className="w-4 h-4" />
                    <AlertDescription>
                      Subscriptions are managed through HealthQuest backend.
                      This panel provides read-only access and analytics.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Basic Tier</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {families.filter(f => f.subscription?.tier === 'basic').length}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">families</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Plus Tier</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {families.filter(f => f.subscription?.tier === 'plus').length}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">families</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Premium Tier</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {families.filter(f => f.subscription?.tier === 'premium').length}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">families</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Family Hub Analytics</CardTitle>
                <CardDescription>Insights and metrics for Family Hub feature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-600">Analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Family Hub Settings</CardTitle>
                <CardDescription>Configure Family Hub features and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Subscription Tiers</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Basic ($9.99/mo)</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Plus ($14.99/mo)</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Premium ($19.99/mo)</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Feature Access</h3>
                    <Alert>
                      <Shield className="w-4 h-4" />
                      <AlertDescription>
                        Family Hub features are controlled through HealthQuest subscription backend.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FamilyHubAdmin;
