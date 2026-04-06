"use client";

import React, { useEffect } from "react";
import { useAppContext } from "../../state/AppContext";

export default function WinXPLogin({ onUnlock }: { onUnlock: () => void }) {
  const { dispatch } = useAppContext();

  useEffect(() => {
    const startupSound = new Audio("/assets/winxp/winxp.mp3");
    const playPromise = startupSound.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    // Show the welcome screen for 4 seconds before advancing
    const timer = setTimeout(() => {
      dispatch({ type: "LOG_IN" });
      localStorage.setItem("nostro_logged_in", "true");
      onUnlock();
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            startupSound.pause();
          })
          .catch(() => {});
      }
    };
  }, [dispatch, onUnlock]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none cursor-none bg-[#5a7edc]">
      <div className="h-[15vh] w-full bg-[#002f9e]" />
      <div className="flex-1 w-full relative flex items-center">
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(to right, transparent 22.5%, rgba(255,255,255,0.9) 30%, transparent 75%)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-[45%] h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)",
          }}
        />
        <div
          className="w-full flex justify-center"
          style={{ paddingLeft: "20%" }}
        >
          <h1
            className="text-white italic font-bold"
            style={{
              fontSize: "4.5rem",
              fontFamily: "Arial, Helvetica, sans-serif",
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.6), 1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            welcome
          </h1>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{
            background:
              "linear-gradient(to right, transparent 22.5%, #ffb347 30%, transparent 75%)",
          }}
        />
      </div>
      <div className="h-[15vh] w-full bg-[#002f9e]" />
    </div>
  );
}
