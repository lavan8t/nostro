"use client";

import React, { useEffect } from "react";

interface WinXPLoginProps {
  onLogin: () => void;
  isLoading?: boolean;
}

export default function WinXPLogin({ onLogin }: WinXPLoginProps) {
  useEffect(() => {
    const startupSound = new Audio('/assets/winxp/winxp.mp3');
       startupSound.play();
    // Show the welcome screen for 4 seconds before advancing
    const timer = setTimeout(() => {
      onLogin();
    }, 4000);

    return () => {
      clearTimeout(timer);
      startupSound.pause();
    };
  }, [onLogin]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none cursor-none bg-[#5a7edc]">
      
      {/* 1. Top Dark Blue Row */}
      <div className="h-[15vh] w-full bg-[#002f9e]" />

      {/* 2. Middle Light Blue Row */}
      <div className="flex-1 w-full relative flex items-center">
        
        {/* Top White Fading Line - Peaks at 40% */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(to right, transparent 22.5%, rgba(255,255,255,0.9) 30%, transparent 75%)"
          }}
        />

        {/* Offset Radial White Glow in Top Left */}
        <div 
          className="absolute top-0 left-0 w-[45%] h-[100%] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)"
          }}
        />

        {/* "welcome" Text (Right-Centered) */}
        <div className="w-full flex justify-center" style={{ paddingLeft: '20%' }}>
          <h1 
            className="text-white italic font-bold "
            style={{ 
              fontSize: "4.5rem", 
              fontFamily: "Arial, Helvetica, sans-serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.8)" 
            }}
          >
            welcome
          </h1>
        </div>

        {/* Bottom Light Orange Fading Line - Peaks at 40% */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(to right, transparent 22.5%, #ffb347 30%, transparent 75%)"
          }}
        />
      </div>

      {/* 3. Bottom Dark Blue Row */}
      <div className="h-[15vh] w-full bg-[#002f9e]" />
    </div>
  );
}