"use client";

import React, { useState } from "react";
import BaseTerminal from "./BaseTerminal";
import { TerminalTheme } from "./terminalTypes";

const winXPTheme: TerminalTheme = {
  version: "winxp",
  fontFamily: '"Lucida Console", "Courier New", monospace',
  fontSize: 13,
  bgColor: "#000000",
  textColor: "#c0c0c0",
  promptColor: "#c0c0c0",
  selectionBg: "#000080",
  cursorColor: "#c0c0c0",
  windowBg: "#ece9d8",
  titleBarBg: "#0a246a",
  titleBarText: "#ffffff",
  titleText: "C:\\WINDOWS\\System32\\cmd.exe",
  promptPrefix: (cwd: string) => `${cwd}>`,
  versionString: "Microsoft Windows XP [Version 5.1.2600]",
  startupLines: [
    "Microsoft Windows XP [Version 5.1.2600]",
    "(C) Copyright 1985-2001 Microsoft Corp.",
    "",
  ],
};

interface WinXPTerminalProps {
  onClose?: () => void;
  style?: React.CSSProperties;
}

export default function WinXPTerminal({ onClose, style }: WinXPTerminalProps) {
  const [title, setTitle] = useState(winXPTheme.titleText);
  const [isMaximized, setIsMaximized] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: isMaximized ? "100%" : 660,
        height: isMaximized ? "100%" : 400,
        border: "3px solid #0a246a",
        borderRadius: "8px 8px 0 0",
        overflow: "hidden",
        fontFamily: '"Tahoma", Arial, sans-serif',
        fontSize: 11,
        boxShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      {/* ── Title bar — Luna blue gradient ── */}
      <div
        style={{
          height: 28,
          background:
            "linear-gradient(to bottom, #2067d2 0%, #2b88e0 40%, #1e5abf 60%, #1a52b8 100%)",
          display: "flex",
          alignItems: "center",
          padding: "0 4px 0 6px",
          gap: 6,
          flexShrink: 0,
          cursor: "default",
          userSelect: "none",
          borderRadius: "5px 5px 0 0",
        }}
      >
        {/* App icon — small cmd prompt icon */}
        <div
          style={{
            width: 16,
            height: 16,
            backgroundColor: "#000080",
            border: "1px solid #5080ff",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#c0c0c0", fontSize: 8, fontFamily: "monospace" }}>
            C:\
          </span>
        </div>

        {/* Title */}
        <span
          style={{
            color: "#ffffff",
            fontSize: 12,
            fontWeight: "bold",
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </span>

        {/* XP window buttons */}
        <div style={{ display: "flex", gap: 2 }}>
          {/* Minimize */}
          <div
            style={{
              width: 21,
              height: 21,
              borderRadius: 3,
              background: hovered === "min"
                ? "linear-gradient(to bottom, #5599ee, #2266cc)"
                : "linear-gradient(to bottom, #4488dd, #1155bb)",
              border: "1px solid #0033aa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
            onMouseEnter={() => setHovered("min")}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: 8, height: 2, backgroundColor: "#fff", marginTop: 6 }} />
          </div>

          {/* Maximize */}
          <div
            style={{
              width: 21,
              height: 21,
              borderRadius: 3,
              background: hovered === "max"
                ? "linear-gradient(to bottom, #5599ee, #2266cc)"
                : "linear-gradient(to bottom, #4488dd, #1155bb)",
              border: "1px solid #0033aa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
            onMouseEnter={() => setHovered("max")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setIsMaximized((v) => !v)}
          >
            <div
              style={{
                width: 9,
                height: 7,
                border: "2px solid #fff",
                borderTop: "3px solid #fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Close — red */}
          <div
            style={{
              width: 21,
              height: 21,
              borderRadius: 3,
              background: hovered === "close"
                ? "linear-gradient(to bottom, #f08080, #c02020)"
                : "linear-gradient(to bottom, #e05050, #a01010)",
              border: "1px solid #800000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
            onMouseEnter={() => setHovered("close")}
            onMouseLeave={() => setHovered(null)}
            onClick={onClose}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Arial",
                lineHeight: 1,
              }}
            >
              ✕
            </span>
          </div>
        </div>
      </div>

      {/* ── Terminal body ── */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <BaseTerminal
          theme={winXPTheme}
          onTitleChange={setTitle}
          style={{ height: "100%", padding: "6px 8px" }}
        />
      </div>
    </div>
  );
}