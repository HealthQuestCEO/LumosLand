
import React, { useState, useEffect } from "react";
import { InventoryItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StickyNoteItem from "./StickyNoteItem";

const ROOM_BACKGROUND = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/97b96c346_1.png";

export default function ClassroomTab({ user, onUpdate }) {
  const [classroomItems, setClassroomItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    try {
      const userItems = await InventoryItem.filter({ 
        user_email: user.email,
        room_location: "classroom"
      });
      setClassroomItems(userItems);
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
    return <div className="text-center py-8">Loading Classroom...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#1165b3]/20">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--color-primary-blue)] flex items-center gap-2">
            📚 Classroom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full aspect-square bg-cover bg-center rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-50"
            style={ROOM_BACKGROUND ? { backgroundImage: `url(${ROOM_BACKGROUND})` } : {}}
          >
            {classroomItems.length > 0 && (
              <div className="absolute top-4 left-4 right-4 grid grid-cols-5 gap-3">
                {classroomItems.slice(0, 10).map((item) => (
                  <StickyNoteItem key={item.id} item={item} />
                ))}
              </div>
            )}
            
            {classroomItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-center px-4">
                  No classroom items yet.<br />Visit the Nook or move items from other rooms!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-3xl shadow-lg border-2 border-[#66bfad]/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1165b3]">📚 Classroom Items</CardTitle>
        </CardHeader>
        <CardContent>
          {classroomItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No classroom items yet. Visit the Nook or move items from other rooms!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {classroomItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-[#e0f8f5] to-white rounded-2xl p-4 border-2 border-[#66bfad]/20"
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
