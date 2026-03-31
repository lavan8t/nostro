"use client";

import React, { useEffect, useState } from "react";

interface Win7LoginProps {
  onLogin: () => void;
  isLoading?: boolean;
}

type Phase = "video" | "blackout" | "welcome" | "done";

export default function Win7Login({ onLogin }: Win7LoginProps) {
  const [phase, setPhase] = useState<Phase>("video");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "video") {
      // Force-advance to blackout after 7s regardless of video length
      timer = setTimeout(() => setPhase("blackout"), 7000);
    } else if (phase === "blackout") {
      // 1 second of pure black
      timer = setTimeout(() => setPhase("welcome"), 1000);
    } else if (phase === "welcome") {
      // 3.5 seconds of welcome screen, then play audio and cut to home
      timer = setTimeout(() => {
        const audio = new Audio("/assets/win7/win7.mp3");
        audio.play().catch(() => {}); // silently ignore autoplay blocks
        setPhase("done");
        onLogin();
      }, 3500);
    }

    return () => clearTimeout(timer);
  }, [phase, onLogin]);

  // ── Phase: video + blackout ───────────────────────────────────────────────
  if (phase === "video" || phase === "blackout") {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center cursor-none overflow-hidden">
        {/* Keep video mounted during blackout so there's no remount flash —
            opacity goes to 0 while the black bg shows through */}
        <video
          src="/assets/win7/Windows7BootScreen.webm"
          autoPlay
          playsInline
          className="w-full max-w-[1080px] object-contain -translate-y-[10vh] transition-opacity duration-100"
          style={{ opacity: phase === "blackout" ? 0 : 1 }}
          onEnded={() => setPhase("blackout")}
        />
      </div>
    );
  }

  // ── Phase: welcome ────────────────────────────────────────────────────────
  return (
    <div
      className="h-screen w-screen relative overflow-hidden cursor-none select-none"
      style={{
        backgroundImage: "url('/assets/win7/win7-welcome-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Bottom logo image */}
      <img
        src="/assets/win7/win7-logo.png"
        alt="Windows 7 Professional"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ height: 52, width: "auto", pointerEvents: "none" }}
        draggable={false}
      />

      {/* Welcome indicator — horizontally centred, ~43% from top */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
        style={{ top: "43%", gap: 10 }}
      >
        {/*
         * Sprite sheet loader.
         * Measured frame width: 30px (18 frames × 30px = 540px total).
         * steps(18, end) snaps exactly one frame at a time — no sliding.
         * backgroundSize: "auto 100%" renders each frame at natural width
         * so only one ring is ever visible in the 30×30 window.
         */}
        <div
  style={{
    width: 24,                              // ← display width (scaled down)
    height: 24,                             // ← display height (scaled down)
    backgroundImage: "url('/assets/win7/loader.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "432px 24px",           // ← 540 * (24/30) = 432px wide, 24px tall
    animation: "win7sprite 0.6s steps(18, end) infinite",
    flexShrink: 0,
  }}
/>

        {/* "Welcome" text — Segoe UI light */}
        <span
         // AFTER
style={{
fontFamily: '"Segoe UI", Arial, sans-serif',
color: "#ffffff",
fontSize: 29,
fontWeight: 450,         
textShadow: "0 1px 4px rgba(0,0,0,0.4), 0 0 4px rgba(0,0,0,0.4)",  // razor-tight, zero blur spread
}}
        >
          Welcome
        </span>
      </div>

      <style>{`
        @keyframes win7sprite {
          from { background-position: 0px 0px; }
          to   { background-position: -432px 0px; }
        }
      `}</style>
    </div>
  );
}