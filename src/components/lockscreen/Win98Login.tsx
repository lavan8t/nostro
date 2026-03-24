"use client";

import React, { useEffect } from "react";

interface Win98LoginProps {
  onLogin: () => void;
  isLoading?: boolean; // Kept as optional so TypeScript doesn't complain during the transition
}

export default function Win98Login({ onLogin }: Win98LoginProps) {
  useEffect(() => {
    // 1. Play the boot screen for exactly 4 seconds
    const timer = setTimeout(() => {
      
      
       const startupSound = new Audio('/assets/win98/win98.mp3');
       startupSound.play();

      
      onLogin();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onLogin]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center cursor-none">
      {/* Assuming you move 98win.gif into your public/assets/win98/ folder */}
      <img
        src="/assets/win98/98win.gif"
        alt="Windows 98 Booting..."
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
}