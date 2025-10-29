import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload, Download, Trash2, Edit, Plus, Save, X, Image as ImageIcon,
  Video, FileText, CheckCircle, AlertCircle, Copy, ExternalLink
} from 'lucide-react';

/**
 * NPC Character Management Panel
 */
export const NPCManagementPanel = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample Lumo states
  const lumoStates = [
    'happy', 'sad', 'angry', 'sleepy', 'playful', 'anxious',
    'confident', 'brave', 'content', 'hungry', 'thirsty', 'dirty'
  ];

  const [newCharacter, setNewCharacter] = useState({
    name: '',
    type: 'lumo',
    states: {},
    defaultState: 'happy',
    description: ''
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'AssetMapping'));
      const chars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCharacters(chars);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
    setLoading(false);
  };

  const saveCharacter = async () => {
    try {
      if (selectedCharacter?.id) {
        await updateDoc(doc(db, 'AssetMapping', selectedCharacter.id), newCharacter);
      } else {
        await addDoc(collection(db, 'AssetMapping'), newCharacter);
      }
      loadCharacters();
      setEditMode(false);
      setSelectedCharacter(null);
    } catch (error) {
      console.error('Error saving character:', error);
    }
  };

  const deleteCharacter = async (id) => {
    if (confirm('Are you sure you want to delete this character?')) {
      try {
        await deleteDoc(doc(db, 'AssetMapping', id));
        loadCharacters();
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">NPC Character Management</h2>
          <p className="text-gray-600">Manage character assets, states, and animations</p>
        </div>
        <Button onClick={() => { setEditMode(true); setNewCharacter({ name: '', type: 'lumo', states: {}, defaultState: 'happy', description: '' }); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Character
        </Button>
      </div>

      {/* Character List */}
      <Card>
        <CardHeader>
          <CardTitle>Characters ({characters.length})</CardTitle>
          <CardDescription>Click a character to edit its states and assets</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : characters.length === 0 ? (
            <Alert>
              <AlertDescription>No characters found. Add your first character!</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>States</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {characters.map(char => (
                  <TableRow key={char.id}>
                    <TableCell className="font-medium">{char.name || char.character_name || 'Unnamed'}</TableCell>
                    <TableCell><Badge>{char.type || 'NPC'}</Badge></TableCell>
                    <TableCell>{Object.keys(char.states || {}).length} states</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedCharacter(char); setNewCharacter(char); setEditMode(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCharacter(char.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editMode && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>{selectedCharacter ? 'Edit Character' : 'Add New Character'}</CardTitle>
            <CardDescription>Configure character properties and asset mappings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Character Name</label>
              <Input
                value={newCharacter.name}
                onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                placeholder="Lumo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Input
                value={newCharacter.type}
                onChange={(e) => setNewCharacter({ ...newCharacter, type: e.target.value })}
                placeholder="lumo, npc, pet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newCharacter.description}
                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                placeholder="Character description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default State</label>
              <Input
                value={newCharacter.defaultState}
                onChange={(e) => setNewCharacter({ ...newCharacter, defaultState: e.target.value })}
                placeholder="happy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">States & Asset URLs</label>
              <p className="text-xs text-gray-500 mb-3">Add URLs for each emotional state</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lumoStates.map(state => (
                  <div key={state} className="flex gap-2 items-center">
                    <Badge variant="outline" className="w-24">{state}</Badge>
                    <Input
                      placeholder={`URL for ${state} state`}
                      value={newCharacter.states?.[state] || ''}
                      onChange={(e) => setNewCharacter({
                        ...newCharacter,
                        states: { ...newCharacter.states, [state]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveCharacter}>
                <Save className="w-4 h-4 mr-2" /> Save Character
              </Button>
              <Button variant="outline" onClick={() => { setEditMode(false); setSelectedCharacter(null); }}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Asset Manager Panel
 */
export const AssetManagerPanel = () => {
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [assetPath, setAssetPath] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const storageRef = ref(storage);
      const result = await listAll(storageRef);

      const assetList = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            name: item.name,
            fullPath: item.fullPath,
            url: url
          };
        })
      );

      setAssets(assetList);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = assetPath ? `${assetPath}/${file.name}` : file.name;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      alert(`Upload successful!\nURL: ${url}`);
      loadAssets();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Asset Manager</h2>
        <p className="text-gray-600">Upload and manage images, videos, and animations</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Asset</CardTitle>
          <CardDescription>Supported: Images (PNG, JPG, GIF), Videos (MP4, WEBM), Audio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Asset Path (optional)</label>
            <Input
              placeholder="e.g., characters/lumo or backgrounds/winter"
              value={assetPath}
              onChange={(e) => setAssetPath(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to upload to root directory</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <Input
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>

          {uploading && (
            <Alert>
              <Upload className="w-4 h-4" />
              <AlertDescription>Uploading... Please wait.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Asset Library */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Library ({assets.length})</CardTitle>
          <CardDescription>All uploaded assets in Firebase Storage</CardDescription>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <Alert>
              <AlertDescription>No assets found. Upload your first asset!</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {asset.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={asset.url} alt={asset.name} className="max-h-full max-w-full object-contain" />
                    ) : asset.name.match(/\.(mp4|webm)$/i) ? (
                      <Video className="w-12 h-12 text-gray-400" />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate" title={asset.name}>{asset.name}</p>
                    <p className="text-xs text-gray-500 truncate" title={asset.fullPath}>{asset.fullPath}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(asset.url)}>
                        <Copy className="w-3 h-3 mr-1" /> Copy URL
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(asset.url, '_blank')}>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Shop/Nook Item Management Panel
 */
export const ShopManagementPanel = () => {
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: '',
    item_emoji: '',
    item_image: '',
    item_type: 'decoration',
    price_coins: 0,
    price_xp: 0,
    description: '',
    category: 'furniture',
    rarity: 'common',
    available: true
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      // Load from InventoryItem collection or create a ShopItems collection
      const snapshot = await getDocs(collection(db, 'ShopItems'));
      const itemsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    } catch (error) {
      console.error('Error loading shop items:', error);
    }
  };

  const saveItem = async () => {
    try {
      if (newItem.id) {
        await updateDoc(doc(db, 'ShopItems', newItem.id), newItem);
      } else {
        await addDoc(collection(db, 'ShopItems'), newItem);
      }
      loadItems();
      setEditMode(false);
      setNewItem({ item_name: '', item_emoji: '', item_image: '', item_type: 'decoration', price_coins: 0, price_xp: 0, description: '', category: 'furniture', rarity: 'common', available: true });
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const deleteItem = async (id) => {
    if (confirm('Delete this item from the shop?')) {
      try {
        await deleteDoc(doc(db, 'ShopItems', id));
        loadItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Shop & Nook Items</h2>
          <p className="text-gray-600">Manage store inventory and item properties</p>
        </div>
        <Button onClick={() => setEditMode(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shop Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <Alert>
              <AlertDescription>No shop items found. Add your first item!</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price (Coins)</TableHead>
                  <TableHead>Rarity</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.item_emoji && <span className="text-2xl">{item.item_emoji}</span>}
                        <span className="font-medium">{item.item_name}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{item.item_type}</Badge></TableCell>
                    <TableCell>🪙 {item.price_coins}</TableCell>
                    <TableCell><Badge>{item.rarity}</Badge></TableCell>
                    <TableCell>{item.available ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-gray-400" />}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => { setNewItem(item); setEditMode(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editMode && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>{newItem.id ? 'Edit Item' : 'Add New Item'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <Input value={newItem.item_name} onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Emoji</label>
                <Input value={newItem.item_emoji} onChange={(e) => setNewItem({ ...newItem, item_emoji: e.target.value })} placeholder="🪑" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input value={newItem.item_image} onChange={(e) => setNewItem({ ...newItem, item_image: e.target.value })} placeholder="https://..." />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <Input value={newItem.item_type} onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Input value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rarity</label>
                <Input value={newItem.rarity} onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (Coins)</label>
                <Input type="number" value={newItem.price_coins} onChange={(e) => setNewItem({ ...newItem, price_coins: parseInt(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price (XP)</label>
                <Input type="number" value={newItem.price_xp} onChange={(e) => setNewItem({ ...newItem, price_xp: parseInt(e.target.value) })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} rows={3} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newItem.available}
                onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Available in Shop</label>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveItem}><Save className="w-4 h-4 mr-2" /> Save Item</Button>
              <Button variant="outline" onClick={() => setEditMode(false)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default { NPCManagementPanel, AssetManagerPanel, ShopManagementPanel };
