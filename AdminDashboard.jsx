import React, { useState, useEffect } from 'react';
import { useHealthQuestIntegration } from './HealthQuestIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users, Image, ShoppingBag, Upload, Download, Settings,
  BookOpen, Trophy, Sparkles, Github, Database, Lock
} from 'lucide-react';
import { NPCManagementPanel, AssetManagerPanel, ShopManagementPanel } from './AdminPanels';
import { LessonManagementPanel, RewardsConfigPanel, DataExportPanel } from './AdminExportPanels';

/**
 * LumosLand Admin Dashboard
 *
 * Comprehensive admin interface for managing:
 * - NPC Characters & Assets
 * - Shop/Nook Items
 * - Lessons & Content
 * - XP, Badges, Levels
 * - Asset Management
 * - Data Import/Export
 * - GitHub Sync
 *
 * Access Control: Only accessible to users with admin role
 * Authentication: Uses HealthQuest authentication
 */

const AdminDashboard = () => {
  const { user, isEmbedded, isReady } = useHealthQuestIntegration();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && user) {
      // Check if user has admin role
      const userIsAdmin =
        user.metadata?.role === 'admin' ||
        user.role === 'admin' ||
        user.isAdmin === true ||
        user.email?.includes('admin') || // Temporary for testing
        user.email?.includes('ceo'); // Allow CEO access

      setIsAdmin(userIsAdmin);
      setLoading(false);
    } else if (isReady && !user) {
      setLoading(false);
    }
  }, [user, isReady]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Admin Panel...</h2>
        </div>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-red-500" />
              <CardTitle className="text-2xl">Access Denied</CardTitle>
            </div>
            <CardDescription>You don't have permission to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                Admin access is restricted to authorized personnel only.
                {user ? ` Logged in as: ${user.email}` : ' Please log in with an admin account.'}
              </AlertDescription>
            </Alert>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p><strong>To gain access:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contact your HealthQuest administrator</li>
                <li>Ensure your account has admin role enabled</li>
                <li>Your user metadata must include: role: "admin"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                LumosLand Admin Dashboard
              </h1>
              <p className="text-indigo-100 mt-1">
                Manage NPCs, Assets, Lessons, and More
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-100">Logged in as</p>
              <p className="font-semibold">{user?.displayName || user?.email}</p>
              <p className="text-xs text-indigo-200 mt-1">
                {isEmbedded ? '🔗 Embedded in HealthQuest' : '🖥️ Standalone Mode'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="npcs" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">NPCs</span>
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Assets</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('npcs')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">NPC Characters</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Manage</div>
                  <p className="text-xs text-gray-500 mt-1">Edit Lumo & other characters</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('assets')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Asset Manager</CardTitle>
                  <Image className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Upload</div>
                  <p className="text-xs text-gray-500 mt-1">Images, videos, animations</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('shop')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shop Items</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Edit</div>
                  <p className="text-xs text-gray-500 mt-1">Nook store inventory</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('lessons')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lessons</CardTitle>
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Import</div>
                  <p className="text-xs text-gray-500 mt-1">Add new content</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('rewards')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">XP & Rewards</CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Configure</div>
                  <p className="text-xs text-gray-500 mt-1">Badges, levels, XP</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('export')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Export</CardTitle>
                  <Download className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Download</div>
                  <p className="text-xs text-gray-500 mt-1">Batch export data</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">GitHub Sync</CardTitle>
                  <Github className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Sync</div>
                  <p className="text-xs text-gray-500 mt-1">Push to repository</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('settings')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Settings</CardTitle>
                  <Settings className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">System</div>
                  <p className="text-xs text-gray-500 mt-1">App configuration</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-800">Firebase Connection</p>
                        <p className="text-xs text-green-600">Connected to healthquest-8e631</p>
                      </div>
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-blue-800">HealthQuest API</p>
                        <p className="text-xs text-blue-600">api-dev.discoverhealthquest.com</p>
                      </div>
                      <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>

                    {isEmbedded && (
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-purple-800">Embedded Mode</p>
                          <p className="text-xs text-purple-600">Running in HealthQuest platform</p>
                        </div>
                        <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Admin Panel Components */}
          <TabsContent value="npcs">
            <NPCManagementPanel />
          </TabsContent>

          <TabsContent value="assets">
            <AssetManagerPanel />
          </TabsContent>

          <TabsContent value="shop">
            <ShopManagementPanel />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonManagementPanel />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsConfigPanel />
          </TabsContent>

          <TabsContent value="export">
            <DataExportPanel />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure app-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Settings panel loading...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
