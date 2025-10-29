import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Sparkles } from "lucide-react";

export default function DailySpinner({ user, lumoState, onClose, onPrizeWon }) {
  const [prizes, setPrizes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [canSpin, setCanSpin] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    loadPrizes();
    checkIfCanSpin();
  }, []);

  const loadPrizes = async () => {
    try {
      const allPrizes = await base44.entities.SpinnerPrize.filter({ is_active: true });
      setPrizes(allPrizes);
    } catch (error) {
      console.error("Error loading prizes:", error);
    }
  };

  const checkIfCanSpin = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const history = await base44.entities.SpinnerHistory.filter({
        user_email: user.email,
        spin_date: today
      });
      setCanSpin(history.length === 0);
    } catch (error) {
      console.error("Error checking spin history:", error);
    }
  };

  const handleSpin = async () => {
    if (!canSpin || spinning || prizes.length === 0) return;

    setSpinning(true);

    // Calculate weighted random prize
    const totalWeight = prizes.reduce((sum, p) => sum + (p.probability_weight || 1), 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      random -= (prize.probability_weight || 1);
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Calculate rotation (spin 5 times + land on prize)
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = prizeIndex * segmentAngle;
    const spins = 5 * 360;
    const finalRotation = spins + (360 - targetAngle);

    setRotation(finalRotation);

    // Wait for animation
    setTimeout(async () => {
      setWonPrize(selectedPrize);
      setSpinning(false);
      setCanSpin(false);

      // Award prize
      if (selectedPrize.prize_type === "xp") {
        await base44.entities.LumoState.update(lumoState.id, {
          total_xp: lumoState.total_xp + selectedPrize.prize_amount
        });
      } else if (selectedPrize.prize_type === "coins") {
        await base44.entities.LumoState.update(lumoState.id, {
          total_coins: lumoState.total_coins + selectedPrize.prize_amount
        });
      } else if (selectedPrize.prize_type === "item" && selectedPrize.item_id) {
        // Add item directly to inventory/attic
        const shopItems = await base44.entities.ShopItem.filter({ item_id: selectedPrize.item_id });
        if (shopItems.length > 0) {
          const item = shopItems[0];
          await base44.entities.InventoryItem.create({
            user_email: user.email,
            item_type: item.sub_type || item.item_type,
            item_name: item.item_name,
            item_emoji: item.emoji || "",
            item_image: item.image_url || "",
            room_location: "attic"
          });
        }
      }

      // Record spin
      await base44.entities.SpinnerHistory.create({
        user_email: user.email,
        spin_date: new Date().toISOString().split('T')[0],
        prize_won: selectedPrize.prize_name,
        prize_type: selectedPrize.prize_type,
        prize_amount: selectedPrize.prize_amount || 1
      });

      onPrizeWon();
    }, 4000);
  };

  if (prizes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full bg-white rounded-3xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Prize Spinner</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No prizes configured yet. Please check back later!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-[#e0f8f5] to-white rounded-3xl border-4 border-[#66bfad]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-[#1165b3]">
              🎡 Daily Prize Spinner
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!wonPrize ? (
            <>
              {/* Spinner Wheel */}
              <div className="relative w-80 h-80 mx-auto">
                {/* Arrow pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500"></div>
                </div>

                {/* Wheel */}
                <motion.div
                  className="w-full h-full rounded-full border-8 border-[#1165b3] shadow-2xl overflow-hidden relative"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: "easeOut" }}
                >
                  {prizes.map((prize, index) => (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${index * segmentAngle}deg)`,
                        transformOrigin: 'center',
                        clipPath: `polygon(50% 50%, 100% 0%, 100% 100%)`
                      }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: prize.display_color || "#66bfad" }}
                      >
                        <div className="transform rotate-45 text-center">
                          <div className="text-2xl mb-1">
                            {prize.prize_type === "xp" ? "⚡" : prize.prize_type === "coins" ? "🪙" : "🎁"}
                          </div>
                          <div className="text-xs">{prize.prize_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-[#1165b3] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#ffa400]" />
                  </div>
                </motion.div>
              </div>

              {/* Spin Button */}
              {canSpin ? (
                <Button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="w-full bg-gradient-to-r from-[#ffa400] to-[#ff8c00] text-white text-xl py-8 rounded-2xl hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {spinning ? "🎰 Spinning..." : "🎰 SPIN NOW!"}
                </Button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 text-lg font-semibold">You've already spun today!</p>
                  <p className="text-sm text-gray-500 mt-2">Come back tomorrow for another chance!</p>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-8xl mb-6">🎉</div>
              <h3 className="text-3xl font-bold text-[#1165b3] mb-4">You Won!</h3>
              <div className="bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white p-6 rounded-2xl mb-6">
                <p className="text-4xl font-bold mb-2">{wonPrize.prize_name}</p>
                {wonPrize.prize_type === "xp" && <p className="text-xl">+{wonPrize.prize_amount} XP</p>}
                {wonPrize.prize_type === "coins" && <p className="text-xl">+{wonPrize.prize_amount} Coins</p>}
                {wonPrize.prize_type === "item" && <p className="text-xl">Added to your Attic!</p>}
              </div>
              <Button
                onClick={onClose}
                className="bg-[#66bfad] text-white px-8 py-4 rounded-2xl text-lg"
              >
                Awesome! ✨
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}