
import React, { useState, useEffect } from "react";
import { AssetMapping } from "@/api/entities";

// Fallback assets if no database mapping exists
const FALLBACK_STATE_ASSETS = {
  hungry: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/8b127202f_15.png" },
  thirsty: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/f7d121f3c_16.png" },
  dirty: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/45a1084b9_17.png" },
  happy: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/ea90d5151_14.png" },
  brave: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/c2c4fd167_7.png" },
  confident: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/836a8a0be_10.png" },
  content: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/4db499561_Happy1.png" },
  angry: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/df75d7d0f_9.png" },
  sad: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/1415d3112_8.png" },
  sleepy: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/bda7969a3_6.png" },
  sleeping: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/d59b9b481_Untitleddesign48.png" },
  playful: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/96d7a8c18_11.png" },
  anxious: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/9b8243e2f_12.png" },
  missing: { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/9a383d0b4_Happy.png" },
};

const FALLBACK_BACKGROUNDS = {
  winter: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/e22450842_19.png",
  spring: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/998fa88e7_20.png",
  summer: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/6c6ac26e4_21.png",
  fall: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/21962a127_22.png",
  default: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/21962a127_22.png"
};

export default function LumoCharacter({ lumoState, isSleepTime }) {
  const [assetMappings, setAssetMappings] = useState({ states: {}, backgrounds: {} });

  useEffect(() => {
    loadAssetMappings();
  }, []);

  const loadAssetMappings = async () => {
    try {
      const allMappings = await AssetMapping.list();
      
      const stateMap = {};
      const bgMap = {};
      
      allMappings.forEach(mapping => {
        if (mapping.asset_type === "lumo_state") {
          stateMap[mapping.asset_key] = {
            img: mapping.image_url,
            scale: mapping.scale || 2
          };
        } else if (mapping.asset_type === "background") {
          bgMap[mapping.asset_key] = mapping.image_url;
        }
      });
      
      setAssetMappings({ states: stateMap, backgrounds: bgMap });
    } catch (error) {
      console.error("Error loading asset mappings:", error);
    }
  };

  const getLumoDisplayState = () => {
    if (!lumoState) return "content";
    if (lumoState.is_missing) return "missing";
    
    // PRIORITY: If it's sleep time, show sleeping Lumo (not sleepy emotion)
    if (isSleepTime) return "sleeping";
    
    const allNeedsHealthy = lumoState.hunger >= 50 && lumoState.thirst >= 50 && lumoState.cleanliness >= 50;
    
    if (allNeedsHealthy) {
      return lumoState.current_emotion_state === "neutral" ? "content" : (lumoState.current_emotion_state || "content");
    }
    
    const needs = [
      { type: "thirsty", value: lumoState.thirst },
      { type: "hungry", value: lumoState.hunger },
      { type: "dirty", value: lumoState.cleanliness }
    ];
    
    const needsBelow50 = needs.filter(n => n.value < 50);
    
    if (needsBelow50.length > 0) {
      const minValue = Math.min(...needsBelow50.map(n => n.value));
      const lowestNeeds = needsBelow50.filter(n => n.value === minValue);
      return lowestNeeds[0].type;
    }
    
    return "content";
  };
  
  const displayState = getLumoDisplayState();
  const isMissing = displayState === "missing";
  const isActuallySleeping = displayState === "sleeping";
  
  // Get asset from database or fall back to hardcoded
  const stateAsset = assetMappings.states[displayState] || FALLBACK_STATE_ASSETS[displayState] || FALLBACK_STATE_ASSETS["content"];
  const assetUrl = stateAsset.img;
  
  // For sleeping state on home screen, use 1/2 the normal size
  let assetScale = stateAsset.scale || 2;
  if (isActuallySleeping) {
    assetScale = assetScale * 0.5; // 1/2 the size for sleeping Lumo
  }
  
  // Get background
  const season = lumoState?.current_season || "fall";
  const backgroundImage = assetMappings.backgrounds[season] || FALLBACK_BACKGROUNDS[season] || FALLBACK_BACKGROUNDS.default;

  return (
    <div 
      className="w-full h-96 bg-cover rounded-3xl flex items-end justify-center relative overflow-hidden shadow-lg border-2 border-[var(--color-border-blue)]/30"
      style={{ 
        backgroundImage: `url('${backgroundImage}')`,
        backgroundPosition: "left bottom"
      }}
    >
      <div
        className="relative z-10"
        style={{ 
          maxWidth: '100%',
          maxHeight: '90%',
          marginBottom: '-20px'
        }}
      >
        <img 
          src={assetUrl}
          alt={isMissing ? "Lumo left a message" : isActuallySleeping ? "Lumo is sleeping" : `Lumo is ${displayState}`}
          className="max-w-full max-h-full object-contain"
          style={{ 
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            transform: `scale(${assetScale})`,
            transformOrigin: 'bottom center'
          }}
        />
      </div>
    </div>
  );
}
