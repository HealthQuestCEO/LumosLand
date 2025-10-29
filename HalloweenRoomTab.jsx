
import React, { useState, useEffect } from "react";
import { InventoryItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StickyNoteItem from "./StickyNoteItem";

const ROOM_BACKGROUND = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/367788447_3.png";

export default function HalloweenRoomTab({ user, onUpdate }) {
  const [halloweenItems, setHalloweenItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    try {
      const userItems = await InventoryItem.filter({ 
        user_email: user.email,
        room_location: "halloween_room"
      });
      setHalloweenItems(userItems);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToAttic = async (itemId) => {
    try {
      await InventoryItem.update(itemId, {
        room_location: "attic",
        position_x: 50,
        position_y: 50
      });
      await loadItems();
      onUpdate();
    } catch (error) {
      console.error("Error moving item to attic:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading Special Items...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-300">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-600 flex items-center gap-2">
            ✨ Special Items Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full aspect-square bg-cover bg-center rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50"
            style={ROOM_BACKGROUND ? { backgroundImage: `url(${ROOM_BACKGROUND})` } : {}}
          >
            {halloweenItems.length > 0 && (
              <div className="absolute top-4 left-4 right-4 grid grid-cols-5 gap-3">
                {halloweenItems.slice(0, 10).map((item) => (
                  <StickyNoteItem key={item.id} item={item} />
                ))}
              </div>
            )}
            
            {halloweenItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-center px-4">
                  No special items yet.<br />Visit the Nook or move items from other rooms!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-3xl shadow-lg border-2 border-orange-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-600">✨ Special Items</CardTitle>
        </CardHeader>
        <CardContent>
          {halloweenItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No special items yet. Visit the Nook or move items from other rooms!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {halloweenItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-4 border-2 border-orange-200"
                >
                  <div className="text-center">
                    {item.item_image ? (
                      <img src={item.item_image} alt={item.item_name} className="w-20 h-20 mx-auto mb-2 object-contain" />
                    ) : (
                      <div className="text-5xl mb-2">{item.item_emoji}</div>
                    )}
                    <p className="font-semibold text-gray-800">{item.item_name}</p>
                    <Button
                      onClick={() => handleReturnToAttic(item.id)}
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs"
                    >
                      Return to Attic
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
