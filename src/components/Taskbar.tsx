"use client";

import React from "react";
import { useAppContext, WindowState } from "../state/AppContext";
import { osThemes } from "../themes/osThemes";

// --------------------------------------------------
// ICONS
// --------------------------------------------------

const Icons = {
  Terminal: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Browser: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Notepad: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Paint: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Default: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
    </svg>
  ),
};

const getProgramId = (id: string): string => {
  const parts = id.split("-");
  if (parts.length >= 2) return parts[1].toLowerCase();
  return "default";
};

const getProgramIcon = (programId: string) => {
  if (programId.includes("terminal") || programId.includes("cmd"))
    return <Icons.Terminal />;
  if (
    programId.includes("browser") ||
    programId.includes("chrome") ||
    programId.includes("web")
  )
    return <Icons.Browser />;
  if (
    programId.includes("notepad") ||
    programId.includes("editor") ||
    programId.includes("text")
  )
    return <Icons.Notepad />;
  if (programId.includes("paint") || programId.includes("draw"))
    return <Icons.Paint />;
  return <Icons.Default />;
};

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function Taskbar() {
  const { state, dispatch } = useAppContext();

  // Group windows
  const groupedWindows = state.windows.reduce(
    (acc, win) => {
      const pId = getProgramId(win.id);
      if (!acc[pId]) acc[pId] = [];
      acc[pId].push(win);
      return acc;
    },
    {} as Record<string, WindowState[]>,
  );

  const handleProgramClick = (programId: string) => {
    const windows = groupedWindows[programId];
    if (!windows || windows.length === 0) return;

    // Logic to toggle/raise window
    const sorted = [...windows].sort((a, b) => b.z - a.z);
    const topWindow = sorted[0];

    if (topWindow.minimized) {
      dispatch({ type: "RESTORE_WINDOW", payload: topWindow.id });
    } else if (topWindow.focused) {
      if (sorted.length > 1) {
        // Cycle
        const next = sorted[1];
        bringToFront(next.id);
      } else {
        dispatch({ type: "MINIMIZE_WINDOW", payload: topWindow.id });
      }
    } else {
      bringToFront(topWindow.id);
    }
  };

  const bringToFront = (id: string) => {
    const sortedGlobal = [...state.windows].sort((a, b) => a.z - b.z);
    const others = sortedGlobal.filter((w) => w.id !== id);
    const target = state.windows.find((w) => w.id === id);
    if (!target) return;
    const newOrder = [...others, target];
    newOrder.forEach((w, index) => {
      const newZ = index + 1;
      const focused = w.id === id;
      if (w.z !== newZ || w.focused !== focused) {
        dispatch({
          type: "UPDATE_WINDOW",
          payload: { id: w.id, z: newZ, focused },
        });
      }
    });
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (Math.abs(e.deltaY) < 5) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    const totalThemes = 5;
    const newIndex = (state.osIndex + direction + totalThemes) % totalThemes;

    if (newIndex !== state.osIndex) {
      dispatch({ type: "SET_OS", payload: newIndex });
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between select-none z-[9999]"
      style={{
        height: "28px",
        backgroundColor: "var(--ButtonFace)",
        borderTop: "1px solid var(--ButtonHilight)",
        boxShadow: "inset 0 1px 0 var(--ButtonFace)",
        color: "var(--ButtonText)",
        padding: "2px",
      }}
    >
      {/* Start Button */}
      <div className="flex items-center px-1 h-full">
        <button
          className="px-2 h-full flex items-center gap-1 font-bold active:translate-y-[1px] active:translate-x-[1px]"
          style={{
            backgroundColor: "var(--ButtonFace)",
            borderTop: "1px solid var(--ButtonHilight)",
            borderLeft: "1px solid var(--ButtonHilight)",
            borderRight: "1px solid var(--ButtonDkShadow)",
            borderBottom: "1px solid var(--ButtonDkShadow)",
            boxShadow:
              "inset -1px -1px 0 var(--ButtonShadow), inset 1px 1px 0 var(--ButtonFace)",
            color: "var(--ButtonText)",
            fontSize: "11px",
            fontFamily: "Segoe UI, sans-serif",
          }}
        >
          <div className="w-4 h-4 bg-black/20" /> {/* Logo placeholder */}
          Start
        </button>

        {/* Divider / Handle */}
        <div className="w-[2px] h-[20px] mx-1 border-l border-[var(--ButtonShadow)] border-r border-[var(--ButtonHilight)]" />
      </div>

      {/* Window List */}
      <div className="flex-1 flex items-center gap-1 h-full overflow-hidden">
        {Object.entries(groupedWindows).map(([programId, windows]) => {
          const isActive = windows.some((w) => w.focused && !w.minimized);
          const isRunning = windows.length > 0;
          if (!isRunning) return null;

          // Taskbar Item Style
          const baseStyle = {
            backgroundColor: "var(--ButtonFace)",
            color: "var(--ButtonText)",
            borderTop: isActive
              ? "1px solid var(--ButtonShadow)"
              : "1px solid var(--ButtonHilight)",
            borderLeft: isActive
              ? "1px solid var(--ButtonShadow)"
              : "1px solid var(--ButtonHilight)",
            borderRight: isActive
              ? "1px solid var(--ButtonHilight)"
              : "1px solid var(--ButtonDkShadow)",
            borderBottom: isActive
              ? "1px solid var(--ButtonHilight)"
              : "1px solid var(--ButtonDkShadow)",
            boxShadow: isActive
              ? "inset 1px 1px 0 0 var(--ButtonDkShadow)" // Pushed in
              : "inset -1px -1px 0 0 var(--ButtonShadow), inset 1px 1px 0 0 var(--ButtonLight)", // Popped out
            backgroundImage: isActive
              ? "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')" // Dither pattern
              : "none",
            opacity: 1,
            fontFamily: "Segoe UI, sans-serif",
            fontSize: "11px",
          };

          return (
            <button
              key={programId}
              onClick={() => handleProgramClick(programId)}
              className="flex-1 max-w-[160px] h-full flex items-center px-1 gap-1 truncate active:border-l-black active:border-t-black"
              style={baseStyle}
            >
              <div className="w-4 h-4 shrink-0 text-current">
                {getProgramIcon(programId)}
              </div>
              <span className="truncate font-normal">{programId}</span>
            </button>
          );
        })}
      </div>

      {/* Clock / Tray / OS Switcher */}
      <div
        className="flex items-center px-2 h-full ml-1 cursor-ns-resize hover:bg-black/5 transition-colors"
        onWheel={handleScroll}
        title="Scroll to switch OS"
        style={{
          borderTop: "1px solid var(--ButtonShadow)",
          borderLeft: "1px solid var(--ButtonShadow)",
          borderRight: "1px solid var(--ButtonHilight)",
          borderBottom: "1px solid var(--ButtonHilight)",
          boxShadow:
            "inset 1px 1px 0 var(--ButtonDkShadow), inset -1px -1px 0 var(--ButtonLight)", // Deep Inset
          backgroundColor: "var(--ButtonFace)",
          minWidth: "70px",
          justifyContent: "center",
        }}
      >
        <span
          className="text-xs font-normal"
          style={{ fontFamily: "Segoe UI, sans-serif" }}
        >
          {osThemes[state.osIndex].name}
        </span>
      </div>
    </div>
  );
}
