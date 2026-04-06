"use client";

import React, { useState } from "react";
import BaseTerminal from "./BaseTerminal";
import { TerminalTheme } from "./terminalTypes";

const win7Theme: TerminalTheme = {
  version: "win7",
  fontFamily: '"Consolas", "Lucida Console", monospace',
  fontSize: 14,
  bgColor: "#000000",
  textColor: "#c0c0c0",
  promptColor: "#c0c0c0",
  selectionBg: "#000080",
  cursorColor: "#c0c0c0",
  windowBg: "rgba(240,240,240,0.85)",
  titleBarBg: "rgba(200,220,240,0.7)",
  titleBarText: "#000000",
  titleText: "C:\\Windows\\system32\\cmd.exe",
  promptPrefix: (cwd: string) => `${cwd}>`,
  versionString: "Microsoft Windows [Version 6.1.7601]",
  startupLines: [
    "Microsoft Windows [Version 6.1.7601]",
    "Copyright (c) 2009 Microsoft Corporation.  All rights reserved.",
    "",
  ],
};

interface Win7TerminalProps {
  onClose?: () => void;
  style?: React.CSSProperties;
}

export default function Win7Terminal({ onClose, style }: Win7TerminalProps) {
  const [title, setTitle] = useState(win7Theme.titleText);
  const [isMaximized, setIsMaximized] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: isMaximized ? "100%" : 660,
        height: isMaximized ? "100%" : 400,
        border: "1px solid rgba(100,140,180,0.8)",
        borderRadius: "6px 6px 0 0",
        overflow: "hidden",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 11,
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
        ...style,
      }}
    >
      {/* ── Title bar — Aero glass ── */}
      <div
        style={{
          height: 32,
          background:
            "linear-gradient(to bottom, rgba(220,235,255,0.9) 0%, rgba(180,210,245,0.75) 50%, rgba(160,195,235,0.7) 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          padding: "0 4px 0 6px",
          gap: 6,
          flexShrink: 0,
          cursor: "default",
          userSelect: "none",
          borderBottom: "1px solid rgba(100,140,180,0.5)",
        }}
      >
        {/* App icon */}
        <div
          style={{
            width: 16,
            height: 16,
            backgroundColor: "#000080",
            border: "1px solid #5080c0",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#c0c0c0", fontSize: 7, fontFamily: "monospace" }}>
            C:\
          </span>
        </div>

        {/* Title */}
        <span
          style={{
            color: "#000000",
            fontSize: 12,
            fontWeight: "normal",
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>

        {/* Aero window buttons — all equal size, vertically centred */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginRight: 4,
          }}
        >
          {/* Minimize */}
          <div
            style={{
              width: 28,
              height: 22,
              borderRadius: 3,
              background:
                hovered === "min"
                  ? "rgba(180,210,255,0.8)"
                  : "rgba(220,235,255,0.5)",
              border: "1px solid rgba(100,140,200,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={() => setHovered("min")}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              style={{
                width: 9,
                height: 1,
                backgroundColor: "#333",
              }}
            />
          </div>

          {/* Maximize */}
          <div
            style={{
              width: 28,
              height: 22,
              borderRadius: 3,
              background:
                hovered === "max"
                  ? "rgba(180,210,255,0.8)"
                  : "rgba(220,235,255,0.5)",
              border: "1px solid rgba(100,140,200,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={() => setHovered("max")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setIsMaximized((v) => !v)}
          >
            <div
              style={{
                width: 9,
                height: 7,
                border: "1.5px solid #333",
                borderTop: "2.5px solid #333",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Close — glows red on hover */}
          <div
            style={{
              width: 28,
              height: 22,
              borderRadius: 3,
              background:
                hovered === "close"
                  ? "linear-gradient(to bottom, #e8504a, #c02020)"
                  : "rgba(220,235,255,0.5)",
              border:
                hovered === "close"
                  ? "1px solid #a01010"
                  : "1px solid rgba(100,140,200,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={() => setHovered("close")}
            onMouseLeave={() => setHovered(null)}
            onClick={onClose}
          >
            <span
              style={{
                fontSize: 11,
                color: hovered === "close" ? "#fff" : "#333",
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
          theme={win7Theme}
          onTitleChange={setTitle}
          style={{ height: "100%", padding: "6px 8px" }}
        />
      </div>
    </div>
  );
}