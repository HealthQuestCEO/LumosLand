import React, { useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, FileJson, Github, Database, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Lesson Import/Export Panel
 */
export const LessonManagementPanel = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState(null);

  const importLesson = async () => {
    setImporting(true);
    setStatus(null);

    try {
      const lessonData = JSON.parse(jsonInput);

      // Validate required fields
      if (!lessonData.quest || !lessonData.number) {
        throw new Error('Lesson must have "quest" and "number" fields');
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'lessons'), {
        ...lessonData,
        imported_at: new Date().toISOString(),
        imported_by: 'admin'
      });

      setStatus({ type: 'success', message: `Lesson imported successfully! ID: ${docRef.id}` });
      setJsonInput('');
    } catch (error) {
      setStatus({ type: 'error', message: `Import failed: ${error.message}` });
    }

    setImporting(false);
  };

  const exportAllLessons = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'lessons'));
      const lessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const json = JSON.stringify(lessons, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `lumos-lessons-${Date.now()}.json`;
      a.click();

      setStatus({ type: 'success', message: `Exported ${lessons.length} lessons!` });
    } catch (error) {
      setStatus({ type: 'error', message: `Export failed: ${error.message}` });
    }
  };

  const sampleLesson = {
    quest: "empathy",
    number: 1,
    name: "Understanding Emotions",
    description: "Learn to recognize different emotions",
    game_format: "mcq",
    game_style: "bubble_pop",
    xp_reward: 50,
    coins_reward: 50,
    questions: [
      {
        question: "What emotion is this?",
        options: ["Happy", "Sad", "Angry", "Surprised"],
        answer: 0,
        rationale: {
          correct: "That's right! This person is smiling and looks happy.",
          incorrect: {
            1: "Not quite. Sad people usually frown or cry.",
            2: "Not this time. Angry faces are usually red and frowning.",
            3: "Almost! But this is a happy face, not surprised."
          }
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Lesson Management</h2>
        <p className="text-gray-600">Import new lessons and export existing content</p>
      </div>

      {status && (
        <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle>Import Lesson</CardTitle>
          <CardDescription>Paste JSON data to import a new lesson</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lesson JSON</label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={JSON.stringify(sampleLesson, null, 2)}
              rows={15}
              className="font-mono text-xs"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={importLesson} disabled={importing || !jsonInput}>
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Importing...' : 'Import Lesson'}
            </Button>
            <Button variant="outline" onClick={() => setJsonInput(JSON.stringify(sampleLesson, null, 2))}>
              <FileJson className="w-4 h-4 mr-2" /> Load Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Lessons</CardTitle>
          <CardDescription>Download all lessons as JSON for backup or migration</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={exportAllLessons}>
            <Download className="w-4 h-4 mr-2" /> Export All Lessons
          </Button>
        </CardContent>
      </Card>

      {/* Batch Import */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Import</CardTitle>
          <CardDescription>Import multiple lessons at once from JSON array</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Format: <code className="bg-gray-100 px-2 py-1 rounded">[{'{lesson1}'}, {'{lesson2}'}, ...]</code>
          </p>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Choose JSON File
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Rewards & Progression Configuration Panel
 */
export const RewardsConfigPanel = () => {
  const [config, setConfig] = useState({
    xp_per_level: 100,
    level_multiplier: 1.5,
    max_level: 50,
    daily_coin_limit: 500,
    daily_xp_limit: 1000,
    badges: []
  });

  const [newBadge, setNewBadge] = useState({ name: '', description: '', icon: '', requirement: '', xp_reward: 0 });
  const [saving, setSaving] = useState(false);

  const saveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'SystemConfig', 'rewards'), config);
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Save failed: ' + error.message);
    }
    setSaving(false);
  };

  const addBadge = () => {
    setConfig({
      ...config,
      badges: [...config.badges, { ...newBadge, id: Date.now() }]
    });
    setNewBadge({ name: '', description: '', icon: '', requirement: '', xp_reward: 0 });
  };

  const removeBadge = (id) => {
    setConfig({
      ...config,
      badges: config.badges.filter(b => b.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rewards & Progression</h2>
        <p className="text-gray-600">Configure XP, coins, badges, and level requirements</p>
      </div>

      {/* XP & Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Level Configuration</CardTitle>
          <CardDescription>Set XP requirements for leveling up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">XP per Level</label>
              <Input
                type="number"
                value={config.xp_per_level}
                onChange={(e) => setConfig({ ...config, xp_per_level: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Base XP needed for level 2</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Level Multiplier</label>
              <Input
                type="number"
                step="0.1"
                value={config.level_multiplier}
                onChange={(e) => setConfig({ ...config, level_multiplier: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">XP increases each level</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Level</label>
              <Input
                type="number"
                value={config.max_level}
                onChange={(e) => setConfig({ ...config, max_level: parseInt(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum achievable level</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Preview:</p>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {[1, 2, 3, 4, 5].map(level => {
                const xp = Math.round(config.xp_per_level * Math.pow(config.level_multiplier, level - 1));
                return (
                  <div key={level} className="bg-white p-2 rounded text-center">
                    <p className="font-bold">Level {level}</p>
                    <p className="text-gray-600">{xp} XP</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Limits</CardTitle>
          <CardDescription>Set maximum daily earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Daily Coin Limit</label>
              <Input
                type="number"
                value={config.daily_coin_limit}
                onChange={(e) => setConfig({ ...config, daily_coin_limit: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Daily XP Limit</label>
              <Input
                type="number"
                value={config.daily_xp_limit}
                onChange={(e) => setConfig({ ...config, daily_xp_limit: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges ({config.badges.length})</CardTitle>
          <CardDescription>Create and manage achievement badges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.badges.map(badge => (
            <div key={badge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                  <Badge variant="outline" className="mt-1">+{badge.xp_reward} XP</Badge>
                </div>
              </div>
              <Button size="sm" variant="destructive" onClick={() => removeBadge(badge.id)}>Remove</Button>
            </div>
          ))}

          <div className="border-t pt-4 mt-4">
            <p className="font-medium mb-3">Add New Badge</p>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Badge Name" value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} />
              <Input placeholder="Icon (emoji)" value={newBadge.icon} onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })} />
              <Input placeholder="Description" value={newBadge.description} onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })} />
              <Input placeholder="Requirement" value={newBadge.requirement} onChange={(e) => setNewBadge({ ...newBadge, requirement: e.target.value })} />
              <Input type="number" placeholder="XP Reward" value={newBadge.xp_reward} onChange={(e) => setNewBadge({ ...newBadge, xp_reward: parseInt(e.target.value) })} />
              <Button onClick={addBadge}>Add Badge</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveConfig} disabled={saving}>
        {saving ? 'Saving...' : 'Save Configuration'}
      </Button>
    </div>
  );
};

/**
 * Data Export & GitHub Sync Panel
 */
export const DataExportPanel = () => {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const collections = [
    { name: 'lessons', label: 'Lessons' },
    { name: 'AssetMapping', label: 'NPC Characters' },
    { name: 'ShopItems', label: 'Shop Items' },
    { name: 'LumoState', label: 'User States' },
    { name: 'InventoryItem', label: 'Inventory Items' },
    { name: 'LessonCompletion', label: 'Lesson Progress' },
    { name: 'ActivityLog', label: 'Activity Logs' },
    { name: 'SystemConfig', label: 'System Config' }
  ];

  const exportCollection = async (collectionName) => {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${collectionName}-${Date.now()}.json`;
      a.click();

      return { success: true, count: data.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const exportAll = async () => {
    setExporting(true);
    setExportStatus('Exporting all collections...');

    const results = {};
    for (const col of collections) {
      const result = await exportCollection(col.name);
      results[col.name] = result;
    }

    setExportStatus(`Export complete! Check your downloads folder.`);
    setExporting(false);
  };

  const createBackup = async () => {
    setExporting(true);
    setExportStatus('Creating full backup...');

    try {
      const backup = {};

      for (const col of collections) {
        const snapshot = await getDocs(collection(db, col.name));
        backup[col.name] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      backup.metadata = {
        created_at: new Date().toISOString(),
        version: '1.0',
        platform: 'LumosLand'
      };

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `lumos-backup-${Date.now()}.json`;
      a.click();

      setExportStatus('Backup created successfully!');
    } catch (error) {
      setExportStatus(`Backup failed: ${error.message}`);
    }

    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Export & Backup</h2>
        <p className="text-gray-600">Export data, create backups, and sync with GitHub</p>
      </div>

      {exportStatus && (
        <Alert>
          <Database className="w-4 h-4" />
          <AlertDescription>{exportStatus}</AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={exportAll}>
          <CardContent className="pt-6 text-center">
            <Download className="w-12 h-12 mx-auto mb-3 text-blue-600" />
            <p className="font-bold">Export All</p>
            <p className="text-xs text-gray-500">Download all collections</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={createBackup}>
          <CardContent className="pt-6 text-center">
            <Database className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <p className="font-bold">Full Backup</p>
            <p className="text-xs text-gray-500">Complete system backup</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <Github className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="font-bold">GitHub Sync</p>
            <p className="text-xs text-gray-500">Push to repository</p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export by Collection</CardTitle>
          <CardDescription>Download individual Firestore collections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {collections.map(col => (
              <Button
                key={col.name}
                variant="outline"
                onClick={() => exportCollection(col.name)}
                disabled={exporting}
                className="justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                {col.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GitHub Integration */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub Repository Sync</CardTitle>
          <CardDescription>Sync data exports to GitHub for version control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Configure GitHub Personal Access Token and repository details to enable automatic syncing.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Input placeholder="GitHub Token" type="password" />
            <Input placeholder="Repository (e.g., username/repo)" />
            <Input placeholder="Branch (e.g., main)" defaultValue="main" />
          </div>

          <Button disabled>
            <Github className="w-4 h-4 mr-2" /> Configure GitHub Sync
          </Button>
          <p className="text-xs text-gray-500">Feature coming soon - manual export available now</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default { LessonManagementPanel, RewardsConfigPanel, DataExportPanel };
