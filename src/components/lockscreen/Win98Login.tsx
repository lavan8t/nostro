"use client";

import React, { useEffect } from "react";
import { useAppContext } from "../../state/AppContext";

export default function Win98Login({ onUnlock }: { onUnlock: () => void }) {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // 1. Play the boot screen for exactly 4 seconds
    const timer = setTimeout(() => {
      const startupSound = new Audio("/assets/win98/win98.mp3");
      startupSound.play().catch(() => {});

      dispatch({ type: "LOG_IN" });
      localStorage.setItem("nostro_logged_in", "true");
      onUnlock();
    }, 4000);

    return () => clearTimeout(timer);
  }, [dispatch, onUnlock]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center cursor-none">
      <img
        src="/assets/win98/98win.gif"
        alt="Windows 98 Booting..."
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
}
