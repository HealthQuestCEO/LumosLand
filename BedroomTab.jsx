
import React, { useState, useEffect } from "react";
import { LumoState, ActivityLog, InventoryItem } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JournalTab from "./JournalTab";
import StickyNoteItem from "./StickyNoteItem";

const BEDROOM_BG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/bd6463427_Baselinebackground8.png";
const SLEEPING_LUMO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/208b586ea_Untitleddesign48.png";
const AWAKE_LUMO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/533b1b034_Happy4.png";

export default function BedroomTab({ user, lumoState, activityLog, onUpdate }) {
  const [showJournal, setShowJournal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTakingNap, setIsTakingNap] = useState(false);
  const [napCooldown, setNapCooldown] = useState(0);
  const [napsTakenToday, setNapsTakenToday] = useState(0);
  const [bedroomItems, setBedroomItems] = useState([]);
  const [isSleepTime, setIsSleepTime] = useState(false);
  const [bedtime, setBedtime] = useState(21); // Default 9pm (21:00)
  const [wakeTime, setWakeTime] = useState(7); // Default 7am (07:00)

  useEffect(() => {
    loadSettings();
    checkNapStatus();
    checkSleepTime();
    loadBedroomItems();
    const interval = setInterval(() => {
      checkNapStatus();
      checkSleepTime();
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user?.email]);

  const loadSettings = () => {
    if (!user) return;
    const saved = localStorage.getItem(`sleep_schedule_${user.email}`);
    if (saved) {
      const { bedtime: bt, wakeTime: wt } = JSON.parse(saved);
      setBedtime(bt);
      setWakeTime(wt);
    }
  };

  const saveSettings = () => {
    if (!user) return;
    localStorage.setItem(`sleep_schedule_${user.email}`, JSON.stringify({
      bedtime,
      wakeTime
    }));
    setShowSettings(false);
    checkSleepTime();
  };

  const checkSleepTime = () => {
    const now = new Date();
    const centralTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    const hour = centralTime.getHours();
    
    // Check if current hour is between bedtime and wake time
    if (bedtime > wakeTime) {
      // Bedtime is in evening (e.g., 9pm to 7am)
      setIsSleepTime(hour >= bedtime || hour < wakeTime);
    } else {
      // Bedtime is unusual (e.g., 7am to 9pm - shouldn't happen normally)
      setIsSleepTime(hour >= bedtime && hour < wakeTime);
    }
  };

  const loadBedroomItems = async () => {
    if (!user) return;
    try {
      const items = await InventoryItem.filter({ 
        user_email: user.email,
        room_location: "bedroom"
      });
      setBedroomItems(items);
    } catch (error) {
      console.error("Error loading bedroom items:", error);
    }
  };

  const checkNapStatus = () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastNapData = localStorage.getItem(`last_nap_${user.email}`);
    
    if (lastNapData) {
      const { timestamp, date, count } = JSON.parse(lastNapData);
      
      if (date !== today) {
        setNapsTakenToday(0);
        localStorage.setItem(`last_nap_${user.email}`, JSON.stringify({
          timestamp: 0,
          date: today,
          count: 0
        }));
        setNapCooldown(0);
      } else {
        setNapsTakenToday(count || 0);
        
        const timeSince = Date.now() - timestamp;
        const cooldownTime = 60 * 60 * 1000; // 1 hour
        
        if (timeSince < cooldownTime) {
          setNapCooldown(Math.ceil((cooldownTime - timeSince) / 60000));
        } else {
          setNapCooldown(0);
        }
      }
    }
  };

  const showLumoAlert = (title, message, type = "success") => {
    // Create custom alert modal
    const alertDiv = document.createElement('div');
    alertDiv.className = 'lumo-alert-overlay';
    
    const bgGradient = type === "success" 
      ? "from-[#66bfad] to-[#1165b3]" 
      : type === "error"
      ? "from-[#ffa400] to-[#ff8c00]" // Changed from red to orange Lumo color
      : "from-[#ffa400] to-[#ff8c00]"; // Using info type for the cooldown, so similar to journal button
    
    const emoji = type === "success" ? "✨" : type === "error" ? "💡" : "💡"; // Changed error emoji for positive messaging
    const borderColor = type === "success" ? "#66bfad" : type === "error" ? "#ffa400" : "#ffa400"; // Changed error border color
    const titleGradient = type === "success" ? "background: linear-gradient(135deg, #66bfad 0%, #1165b3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" :
                          type === "error" ? "background: linear-gradient(135deg, #ffa400 0%, #ff8c00 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" : "background: linear-gradient(135deg, #ffa400 0%, #ff8c00 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"; // Changed error title gradient
    const buttonBg = type === "success" ? "background: linear-gradient(135deg, #66bfad 0%, #1165b3 100%);" :
                     type === "error" ? "background: linear-gradient(135deg, #ffa400 0%, #ff8c00 100%);" : "background: linear-gradient(135deg, #ffa400 0%, #ff8c00 100%);"; // Changed error button background
    const buttonShadow = type === "success" ? "box-shadow: 0 4px 12px rgba(102, 191, 173, 0.4);" :
                         type === "error" ? "box-shadow: 0 4px 12px rgba(255, 164, 0, 0.4);" : "box-shadow: 0 4px 12px rgba(255, 164, 0, 0.4);"; // Changed error button shadow
    const textColor = type === "success" ? "#1165b3" : type === "error" ? "#e68a00" : "#e68a00"; // Changed error text color

    alertDiv.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem;">
        <div style="background: linear-gradient(135deg, #e0f8f5 0%, #ffffff 100%); border-radius: 24px; padding: 2rem; max-width: 400px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); border: 4px solid ${borderColor}; animation: slideIn 0.3s ease-out;">
          <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 0.6s ease-in-out;">${emoji}</div>
            <div style="${titleGradient} font-size: 1.75rem; font-weight: bold; margin-bottom: 0.75rem;">${title}</div>
            <div style="color: ${textColor}; font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">${message}</div>
            <button onclick="this.closest('.lumo-alert-overlay').remove()" style="${buttonBg} color: white; border: none; padding: 0.875rem 2.5rem; border-radius: 16px; font-size: 1.125rem; font-weight: bold; cursor: pointer; ${buttonShadow} transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Awesome! 🎉</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      </style>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 4000);
  };

  const handleTakeNap = async () => {
    if (napCooldown > 0) {
      showLumoAlert("Please wait before taking another nap! ⏰", `${napCooldown} more minutes`, "info");
      return;
    }

    const maxNaps = 2;
    if (napsTakenToday >= maxNaps) {
      showLumoAlert("Daily nap limit reached! 😴", "Come back tomorrow for more naps!", "info");
      return;
    }

    setIsTakingNap(true);

    try {
      const xpEarned = 15;
      const coinsEarned = 5;

      await LumoState.update(lumoState.id, { // Changed from base44.entities.LumoState.update as per existing imports
        total_xp: lumoState.total_xp + xpEarned,
        total_coins: lumoState.total_coins + coinsEarned
      });

      await ActivityLog.update(activityLog.id, { // Changed from base44.entities.ActivityLog.update as per existing imports
        naps_taken: (activityLog.naps_taken || 0) + 1
      });

      const today = new Date().toISOString().split('T')[0];
      const newCount = napsTakenToday + 1;
      
      localStorage.setItem(`last_nap_${user.email}`, JSON.stringify({
        timestamp: Date.now(),
        date: today,
        count: newCount
      }));
      
      setNapCooldown(60);
      setNapsTakenToday(newCount);

      showLumoAlert("Lumo feels refreshed! 😴", `+${xpEarned} XP, +${coinsEarned} coins`, "success");
      await onUpdate();
    } catch (error) {
      console.error("Error taking nap:", error);
      showLumoAlert("Oops! Something went wrong", error.message, "error");
    } finally {
      setIsTakingNap(false);
    }
  };

  if (showJournal) {
    return <JournalTab user={user} lumoState={lumoState} activityLog={activityLog} onUpdate={onUpdate} onBack={() => setShowJournal(false)} />;
  }

  // Show sleeping Lumo if it's sleep time OR actively napping
  const isLumoSleeping = isSleepTime || isTakingNap || napCooldown > 0;
  const lumoImage = isLumoSleeping ? SLEEPING_LUMO : AWAKE_LUMO;

  // Convert 24-hour to 12-hour for display and input
  const formatTo12Hour = (hour) => {
    if (hour === 0) return { hour: 12, period: 'AM' };
    if (hour < 12) return { hour, period: 'AM' };
    if (hour === 12) return { hour: 12, period: 'PM' };
    return { hour: hour - 12, period: 'PM' };
  };

  // Note: convert12HourTo24Hour is not directly used in the updated onChange handlers,
  // the logic is now inline for better input control and immediate state updates.
  // Keeping it for potential future direct use or clarity if needed.
  const convert12HourTo24Hour = (hour12, period) => {
    if (period === 'PM' && hour12 !== 12) {
      return hour12 + 12;
    } else if (period === 'AM' && hour12 === 12) {
      return 0;
    }
    return hour12;
  };


  const bedtime12 = formatTo12Hour(bedtime);
  const wakeTime12 = formatTo12Hour(wakeTime);

  return (
    <Card className="relative overflow-hidden border-2 border-[#66bfad]/30">
      <CardHeader>
        <CardTitle className="text-[#1165b3] flex items-center gap-2">
          <Moon className="w-6 h-6" />
          Lumo's Bedroom
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div 
          className="relative w-full aspect-square bg-cover bg-center rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url(${BEDROOM_BG})` }}
        >
          {/* Bedroom Items Display */}
          {bedroomItems.length > 0 && (
            <div className="absolute top-4 left-4 right-4 grid grid-cols-5 gap-3 z-10">
              {bedroomItems.slice(0, 10).map((item) => (
                <StickyNoteItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Lumo on the ground - 4x bigger */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2" style={{ width: '800px', height: '800px' }}>
            <img 
              src={lumoImage}
              alt={isLumoSleeping ? "Sleeping Lumo" : "Content Lumo"}
              className="w-full h-full object-contain object-bottom"
              style={{ 
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
              }}
            />
          </div>

          {/* Nap Button - Left side bottom */}
          <div className="absolute bottom-8 left-4 z-20">
            <Card className="bg-white/95 backdrop-blur-sm w-48 shadow-xl">
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <p className="font-bold text-[#1165b3] text-lg mb-1">💤 Nap Time</p>
                  <p className="text-xs text-gray-600">Earn rewards!</p>
                </div>
                
                <Button
                  onClick={handleTakeNap}
                  disabled={isTakingNap || napCooldown > 0 || napsTakenToday >= 2}
                  className={`w-full h-20 text-white rounded-xl disabled:opacity-50 flex items-center justify-center ${
                    napCooldown > 0 
                      ? 'bg-[#0d4a7a] hover:bg-[#0d4a7a]' // Darker blue for cooldown
                      : 'bg-gradient-to-r from-[#66bfad] to-[#1165b3] hover:from-[#1165b3] hover:to-[#66bfad]'
                  }`}
                >
                  {isTakingNap ? (
                    <span className="text-base">Resting...</span>
                  ) : napCooldown > 0 ? (
                    <div className="text-center">
                      <div className="text-xs leading-tight text-white font-bold"> {/* Text color changed to white */}
                        Cooling<br/>Down<br/>({napCooldown}m)
                      </div>
                    </div>
                  ) : napsTakenToday >= 2 ? (
                    <span className="text-sm leading-tight">Come Back<br/>Tomorrow</span>
                  ) : (
                    <span className="text-lg">💤 Rest Now</span>
                  )}
                </Button>

                {/* Sleep Schedule Settings Button */}
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Sleep Schedule
                </Button>

                {/* Settings Panel */}
                {showSettings && (
                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <Label className="text-xs">Bedtime</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={bedtime12.hour}
                          onChange={(e) => {
                            const hour12 = parseInt(e.target.value) || 1; // Ensure valid number, default to 1
                            const hour24 = bedtime12.period === 'AM' 
                              ? (hour12 === 12 ? 0 : hour12)
                              : (hour12 === 12 ? 12 : hour12 + 12);
                            setBedtime(hour24);
                          }}
                          className="h-8 text-xs flex-1"
                        />
                        <select
                          value={bedtime12.period}
                          onChange={(e) => {
                            const newPeriod = e.target.value;
                            const hour24 = newPeriod === 'AM'
                              ? (bedtime12.hour === 12 ? 0 : bedtime12.hour)
                              : (bedtime12.hour === 12 ? 12 : bedtime12.hour + 12);
                            setBedtime(hour24);
                          }}
                          className="h-8 text-xs px-2 border rounded"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{bedtime12.hour}:00 {bedtime12.period}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Wake Time</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={wakeTime12.hour}
                          onChange={(e) => {
                            const hour12 = parseInt(e.target.value) || 1; // Ensure valid number, default to 1
                            const hour24 = wakeTime12.period === 'AM'
                              ? (hour12 === 12 ? 0 : hour12)
                              : (hour12 === 12 ? 12 : hour12 + 12);
                            setWakeTime(hour24);
                          }}
                          className="h-8 text-xs flex-1"
                        />
                        <select
                          value={wakeTime12.period}
                          onChange={(e) => {
                            const newPeriod = e.target.value;
                            const hour24 = newPeriod === 'AM'
                              ? (wakeTime12.hour === 12 ? 0 : wakeTime12.hour)
                              : (wakeTime12.hour === 12 ? 12 : wakeTime12.hour + 12);
                            setWakeTime(hour24);
                          }}
                          className="h-8 text-xs px-2 border rounded"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{wakeTime12.hour}:00 {wakeTime12.period}</p>
                    </div>
                    <Button
                      onClick={saveSettings}
                      size="sm"
                      className="w-full bg-[#66bfad] text-xs"
                    >
                      Save Schedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Journal Button - Right side bottom with yellow/orange color */}
          <div className="absolute bottom-8 right-4 z-20">
            <Card className="bg-white/95 backdrop-blur-sm w-48 shadow-xl border-2 border-[#ffa400]/30">
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <p className="font-bold text-[#1165b3] text-lg mb-1">📖 Journal</p>
                  <p className="text-xs text-gray-600">Earn rewards!</p>
                </div>
                
                <Button
                  onClick={() => setShowJournal(true)}
                  className="w-full h-20 bg-gradient-to-r from-[#ffa400] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ffa400] text-white rounded-xl shadow-lg border-2 border-[#ffa400] relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#ff8c00] to-transparent"></div>
                  <div className="absolute right-1 top-2 bottom-2 w-0.5 bg-white/30 rounded-r"></div>
                  <div className="text-center relative z-10">
                    <div className="text-3xl mb-1">📖</div>
                    <p className="text-xs font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                      Mood & Moves<br/>Journal
                    </p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
