"use client";

import React, { useState } from "react";
import BaseTerminal from "./BaseTerminal";
import { TerminalTheme } from "./terminalTypes";

const win10Theme: TerminalTheme = {
  version: "win10",
  fontFamily: '"Cascadia Mono", "Cascadia Code", "Consolas", monospace',
  fontSize: 14,
  bgColor: "#012456",
  textColor: "#cccccc",
  promptColor: "#3a96dd",
  selectionBg: "#3a96dd",
  cursorColor: "#cccccc",
  windowBg: "#0c0c0c",
  titleBarBg: "#1c1c1c",
  titleBarText: "#cccccc",
  titleText: "Administrator: PowerShell",
  promptPrefix: (cwd: string) => `PS ${cwd}> `,
  versionString: "PowerShell 7.2.6\nCopyright (c) Microsoft Corporation.\n\nhttps://aka.ms/powershell\nType 'help' to get help.",
  startupLines: [
    "PowerShell 7.2.6",
    "Copyright (c) Microsoft Corporation.",
    "",
    "https://aka.ms/powershell",
    "Type 'help' to get help.",
    "",
  ],
};

interface Win10TerminalProps {
  onClose?: () => void;
  style?: React.CSSProperties;
}

export default function Win10Terminal({ onClose, style }: Win10TerminalProps) {
  const [title, setTitle] = useState(win10Theme.titleText);
  const [isMaximized, setIsMaximized] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tabs] = useState(["Administrator: PowerShell"]);
  const [activeTab] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: isMaximized ? "100%" : 720,
        height: isMaximized ? "100%" : 440,
        backgroundColor: "#1c1c1c",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "Segoe UI, Arial, sans-serif",
        fontSize: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
        ...style,
      }}
    >
      {/* ── Tab bar ── */}
      <div
        style={{
          height: 35,
          backgroundColor: "#1c1c1c",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 0 0 0",
          gap: 0,
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Shield + tab icon area */}
        <div
          style={{
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Shield icon (admin indicator) */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L2 3V7C2 9.8 4.2 12.4 7 13C9.8 12.4 12 9.8 12 7V3L7 1Z"
              fill="#3a96dd"
              stroke="#2070bb"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Active tab */}
        {tabs.map((tab, i) => (
          <div
            key={i}
            style={{
              height: 28,
              minWidth: 160,
              maxWidth: 220,
              backgroundColor: i === activeTab ? "#012456" : "#1c1c1c",
              borderRadius: "6px 6px 0 0",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
              gap: 6,
              cursor: "pointer",
              borderTop: i === activeTab ? "1px solid #3a3a3a" : "none",
              borderLeft: i === activeTab ? "1px solid #3a3a3a" : "none",
              borderRight: i === activeTab ? "1px solid #3a3a3a" : "none",
              marginBottom: 0,
              position: "relative",
            }}
          >
            {/* PowerShell icon */}
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#012456",
                border: "1px solid #3a96dd",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ color: "#3a96dd", fontSize: 8, fontWeight: "bold" }}>
                PS
              </span>
            </div>

            <span
              style={{
                color: i === activeTab ? "#cccccc" : "#888888",
                fontSize: 11,
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {tab}
            </span>

            {/* Tab close */}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: 10,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "#444")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                  "transparent")
              }
            >
              ✕
            </div>
          </div>
        ))}

        {/* New tab button */}
        <div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 16,
            cursor: "pointer",
            borderRadius: 4,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.backgroundColor = "#333")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent")
          }
        >
          +
        </div>

        {/* Dropdown arrow */}
        <div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 10,
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          ∨
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Window controls */}
        <div style={{ display: "flex" }}>
          {/* Minimize */}
          <div
            style={{
              width: 46,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: hovered === "min" ? "#333333" : "transparent",
              color: "#cccccc",
              fontSize: 12,
            }}
            onMouseEnter={() => setHovered("min")}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: 10, height: 1, backgroundColor: "#cccccc" }} />
          </div>

          {/* Maximize */}
          <div
            style={{
              width: 46,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: hovered === "max" ? "#333333" : "transparent",
            }}
            onMouseEnter={() => setHovered("max")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setIsMaximized((v) => !v)}
          >
            <div
              style={{
                width: 10,
                height: 8,
                border: "1px solid #cccccc",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Close — red on hover */}
          <div
            style={{
              width: 46,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: hovered === "close" ? "#c42b1c" : "transparent",
              color: "#cccccc",
              borderRadius: "0 8px 0 0",
            }}
            onMouseEnter={() => setHovered("close")}
            onMouseLeave={() => setHovered(null)}
            onClick={onClose}
          >
            <span style={{ fontSize: 12, fontFamily: "Arial" }}>✕</span>
          </div>
        </div>
      </div>

      {/* ── Terminal body (PowerShell blue bg) ── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          backgroundColor: "#012456",
        }}
      >
        <BaseTerminal
          theme={win10Theme}
          onTitleChange={setTitle}
          style={{ height: "100%", padding: "8px 12px" }}
        />
      </div>
    </div>
  );
}