"use client";

import React, { useEffect, useState } from "react";

interface Win10LoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

type Phase = "boot" | "welcome" | "done";

export default function Win10Login({ onLogin, isLoading }: Win10LoginProps) {
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "boot") {
      // Boot for 3 seconds then go to welcome
      timer = setTimeout(() => setPhase("welcome"), 3000);
    } else if (phase === "welcome") {
      // Welcome screen for 3.5 seconds then cut to desktop
      timer = setTimeout(() => {
        setPhase("done");
        onLogin();
      }, 3500);
    }

    return () => clearTimeout(timer);
  }, [phase, onLogin]);

  // ── Phase: boot ───────────────────────────────────────────────────────────
  if (phase === "boot") {
    return (
      <div
        className="h-screen w-screen overflow-hidden cursor-none select-none flex flex-col items-center justify-center"
        style={{ background: "#000000" }}
      >
        {/* Windows logo — centered, pushed slightly above mid */}
        <div style={{ marginBottom: 100 }}>
          <img
            src="/assets/win10/start.png"
            alt="Windows 10"
            style={{
              width: 138,
              height: "auto",
              pointerEvents: "none",
              filter: "drop-shadow(0 0 18px rgba(100,200,255,0.35))",
            }}
            draggable={false}
          />
        </div>

        {/*
         * Loading video — constrained to a small loader-sized box (60×60).
         * object-contain keeps the video centred inside without cropping.
         * The black bg matches so no letterboxing is visible.
         */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            width: 54,
            height: 54,
            overflow: "hidden",
          }}
        >
          <img
  src="/assets/win10/windowsLoadingScreen.gif"
  alt=""
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }}
/>
        </div>
      </div>
    );
  }

  // ── Phase: welcome ────────────────────────────────────────────────────────
  return (
    <div
      className="h-screen w-screen relative overflow-hidden cursor-none select-none"
      style={{
        backgroundImage: "url('/assets/win10/lockscreen.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blur + darken overlay */}
      <div
  className="absolute inset-0"
  style={{
    background: "rgba(0,0,0,0.45)",
  }}
/>

      {/* Centred user panel */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {/* User avatar circle */}
        <div
  style={{
    width: 160,
    height: 160,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.15)",
    overflow: "hidden",
    marginBottom: 20,
  }}
>
  <img
    src="/assets/win10/Windows_10_Default_Profile_Picture.svg"
    alt="User"
    style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
    draggable={false}
  />
</div>

        {/* Username */}
        <div
          style={{
            fontFamily: '"Segoe UI", Arial, sans-serif',
            color: "#ffffff",
            fontSize: 34,
            fontWeight: 300,
            letterSpacing: "0.02em",
            textShadow: "0 1px 4px rgba(0,0,0,0.4), 0 0 4px rgba(0,0,0,0.4)",
            marginBottom: 26,
          }}
        >
          User
        </div>

        {/* Spinner + Welcome — side by side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/*
           * Same video reused as the small welcome spinner.
           * Constrained to 22×22 to match the dotted spinner size from Image 2.
           */}
          <div
            style={{
              width: 26,
              height: 26,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
  src="/assets/win10/windowsLoadingScreen.gif"
  alt=""
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }}
/>
          </div>

          {/* Welcome text */}
          <span
            style={{
              fontFamily: '"Segoe UI", Arial, sans-serif',
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 450,
              letterSpacing: "0.04em",
              textShadow: "0 1px 3px rgba(0,0,0,0.5), 0 0 3px rgba(0,0,0,0.5)",
            }}
          >
            Welcome
          </span>
        </div>
      </div>
    </div>
  );
}