import React, { useState, useEffect } from "react";
import { InventoryItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Home, Bed, Sparkles, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function AtticTab({ user, onUpdate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    try {
      const userItems = await InventoryItem.filter({ 
        user_email: user.email,
        room_location: "attic"
      });
      setItems(userItems);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveToRoom = async (itemId, roomLocation) => {
    try {
      await InventoryItem.update(itemId, { room_location: roomLocation });
      await loadItems();
      onUpdate();
    } catch (error) {
      console.error("Error moving item:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading Attic...</div>;
  }

  return (
    <Card className="border-2 border-[var(--color-accent-orange)]/30">
      <CardHeader>
        <CardTitle className="text-2xl text-[var(--color-primary-blue)]">
          📦 Attic (Storage)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Attic is empty</h3>
            <p className="text-gray-500">Purchase items from the Nook to fill your attic!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="border-2 border-gray-200 rounded-2xl p-4"
              >
                <div className="text-center mb-4">
                  {item.item_image ? (
                    <img src={item.item_image} alt={item.item_name} className="w-24 h-24 mx-auto mb-2 object-contain" />
                  ) : (
                    <div className="text-6xl mb-2">{item.item_emoji}</div>
                  )}
                  <h3 className="font-semibold text-[var(--color-primary-blue)]">{item.item_name}</h3>
                  <Badge variant="outline" className="mt-2 capitalize">{item.item_type}</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600 text-center mb-2">Move to:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveToRoom(item.id, "bedroom")}
                      className="text-xs"
                    >
                      <Bed className="w-3 h-3 mr-1" />
                      Bedroom
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveToRoom(item.id, "living_room")}
                      className="text-xs"
                    >
                      <Home className="w-3 h-3 mr-1" />
                      Living
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveToRoom(item.id, "classroom")}
                      className="text-xs"
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Classroom
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveToRoom(item.id, "halloween_room")}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Halloween
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}