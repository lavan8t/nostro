"use client";

import React, { useState } from "react";
import BaseTerminal from "./BaseTerminal";
import { TerminalTheme } from "./terminalTypes";

const win98Theme: TerminalTheme = {
  version: "win98",
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: 13,
  bgColor: "#000000",
  textColor: "#c0c0c0",
  promptColor: "#c0c0c0",
  selectionBg: "#000080",
  cursorColor: "#c0c0c0",
  windowBg: "#c0c0c0",
  titleBarBg: "#000080",
  titleBarText: "#ffffff",
  titleText: "MS-DOS Prompt",
  promptPrefix: (cwd: string) => `${cwd}>`,
  versionString: "Microsoft Windows 98 [Version 4.10.1998]",
  startupLines: [
    "Microsoft(R) Windows 98",
    "   (C)Copyright Microsoft Corp 1981-1998.",
    "",
    "",
  ],
};

// ─── 3D button styles ─────────────────────────────────────────────────────────
const raised: React.CSSProperties = {
  borderTop: "2px solid #ffffff",
  borderLeft: "2px solid #ffffff",
  borderRight: "2px solid #808080",
  borderBottom: "2px solid #808080",
  backgroundColor: "#c0c0c0",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
};

const sunken: React.CSSProperties = {
  borderTop: "2px solid #808080",
  borderLeft: "2px solid #808080",
  borderRight: "2px solid #ffffff",
  borderBottom: "2px solid #ffffff",
  backgroundColor: "#c0c0c0",
};

interface Win98TerminalProps {
  onClose?: () => void;
  style?: React.CSSProperties;
}

export default function Win98Terminal({ onClose, style }: Win98TerminalProps) {
  const [title, setTitle] = useState("MS-DOS Prompt");
  const [isMaximized, setIsMaximized] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  const btnDown = (id: string) => setPressed(id);
  const btnUp = () => setPressed(null);

  const pressedStyle = (id: string): React.CSSProperties =>
    pressed === id ? sunken : raised;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: isMaximized ? "100%" : 502,
        height: isMaximized ? "100%" : 380,
        border: "2px solid #ffffff",
        borderRight: "2px solid #808080",
        borderBottom: "2px solid #808080",
        outline: "1px solid #000000",
        backgroundColor: "#c0c0c0",
        fontFamily: '"MS Sans Serif", "Microsoft Sans Serif", Arial, sans-serif',
        fontSize: 11,
        ...style,
      }}
    >
      {/* ── Title bar ── */}
      <div
        style={{
          height: 20,
          background: "linear-gradient(to right, #000080, #1084d0)",
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
          gap: 4,
          flexShrink: 0,
          cursor: "default",
          userSelect: "none",
        }}
      >
        {/* App icon */}
        <div
          style={{
            width: 14,
            height: 14,
            backgroundColor: "#000080",
            border: "1px solid #000040",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* tiny CRT icon via nested divs */}
          <div
            style={{
              width: 10,
              height: 7,
              border: "1px solid #40a0ff",
              backgroundColor: "#000020",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -3,
                left: 2,
                width: 6,
                height: 2,
                backgroundColor: "#40a0ff",
              }}
            />
          </div>
        </div>

        {/* Title text */}
        <span
          style={{
            color: "#ffffff",
            fontSize: 11,
            fontWeight: "bold",
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>

        {/* Window control buttons */}
        <div style={{ display: "flex", gap: 2 }}>
          {/* Minimize */}
          <div
            style={{ ...pressedStyle("min"), width: 16, height: 14 }}
            onMouseDown={() => btnDown("min")}
            onMouseUp={btnUp}
          >
            <div
              style={{
                width: 8,
                height: 2,
                backgroundColor: "#000000",
                marginTop: 8,
                marginLeft: 2,
              }}
            />
          </div>

          {/* Maximize */}
          <div
            style={{ ...pressedStyle("max"), width: 16, height: 14 }}
            onMouseDown={() => btnDown("max")}
            onMouseUp={() => {
              btnUp();
              setIsMaximized((v) => !v);
            }}
          >
            <div
              style={{
                width: 10,
                height: 8,
                border: "2px solid #000000",
                borderTop: "3px solid #000000",
                marginLeft: 1,
                marginTop: 1,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Close */}
          <div
            style={{ ...pressedStyle("close"), width: 16, height: 14 }}
            onMouseDown={() => btnDown("close")}
            onMouseUp={() => {
              btnUp();
              onClose?.();
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: "#000000",
                lineHeight: 1,
                fontFamily: "Arial",
              }}
            >
              ✕
            </span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div
        style={{
          height: 28,
          backgroundColor: "#c0c0c0",
          borderBottom: "1px solid #808080",
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {/* Font size dropdown */}
        <div
          style={{
            ...sunken,
            width: 52,
            height: 20,
            display: "flex",
            alignItems: "center",
            padding: "0 4px",
            gap: 2,
          }}
        >
          <span style={{ flex: 1, fontSize: 11 }}>Auto</span>
          <div
            style={{
              ...raised,
              width: 12,
              height: 14,
              fontSize: 8,
              flexShrink: 0,
            }}
          >
            ▼
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 20,
            borderLeft: "1px solid #808080",
            borderRight: "1px solid #ffffff",
            margin: "0 2px",
          }}
        />

        {/* Toolbar icon buttons */}
        {[
          { label: "⊞", title: "Properties" },
          { label: "⧉", title: "Full Screen" },
          { label: "⊡", title: "Mark" },
          { label: "◉", title: "Scroll" },
          { label: "A",  title: "Font" },
        ].map(({ label, title: btnTitle }) => (
          <div
            key={btnTitle}
            title={btnTitle}
            style={{
              ...pressedStyle(btnTitle),
              width: 22,
              height: 20,
              fontSize: 11,
              fontFamily: "Arial",
            }}
            onMouseDown={() => btnDown(btnTitle)}
            onMouseUp={btnUp}
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Terminal body ── */}
      <div style={{ flex: 1, overflow: "hidden", ...sunken, padding: 0 }}>
        <BaseTerminal
          theme={win98Theme}
          onTitleChange={setTitle}
          style={{ height: "100%", padding: "6px 8px" }}
        />
      </div>
    </div>
  );
}