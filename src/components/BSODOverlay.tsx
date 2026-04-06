"use client";

import React from "react";
import { useAppContext } from "../state/AppContext";

const OS_DIRS = ["win98", "winxp", "win7", "win10"];

export default function BSODOverlay() {
  const { state } = useAppContext();

  if (!state.bsod) return null;

  const osDir = OS_DIRS[state.osIndex] ?? "win10";
  const bsodSrc = `/assets/${osDir}/bsod.avif`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
        backgroundColor: "#0000aa", // fallback if image fails
        cursor: "default",
        userSelect: "none",
      }}
    >
      <img
        src={bsodSrc}
        alt="BSOD"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill", // fill = stretch to cover exactly like a real BSOD
          display: "block",
        }}
        draggable={false}
      />
    </div>
  );
}
