"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "../state/AppContext";
import Taskbar from "./Taskbar";
import WindowLauncher from "./WindowLauncher";
import ThemeCrossfade from "./ThemeCrossfade";
import WindowFrame, { SnapRect } from "./WindowFrame";

// --------------------------------------------------
// HOOKS
// --------------------------------------------------

function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function Desktop() {
  const { state } = useAppContext();
  const [snapPreview, setSnapPreview] = useState<SnapRect | null>(null);
  const viewportSize = useViewportSize();

  // Filter out minimized windows from the desktop rendering layer
  const visibleWindows = state.windows.filter((w) => !w.minimized);

  return (
    <main
      className="relative h-screen w-screen overflow-hidden transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: "var(--os-bg)",
        color: "var(--os-text)",
      }}
    >
      <ThemeCrossfade />

      {/* Snap Preview Overlay */}
      {snapPreview && (
        <div
          className="absolute z-[5] pointer-events-none transition-all duration-200"
          style={{
            left: snapPreview.x,
            top: snapPreview.y,
            width: snapPreview.width,
            height: snapPreview.height,
            backgroundColor: "var(--os-accent)",
            opacity: 0.15,
          }}
        />
      )}

      {/* Window Layer */}
      <div className="absolute top-0 left-0 right-0 bottom-[40px] z-10">
        {visibleWindows.map((win) => (
          <WindowFrame
            key={win.id}
            win={win}
            onSnapHover={setSnapPreview}
            viewportSize={viewportSize}
          />
        ))}
      </div>

      <WindowLauncher />
      <Taskbar />
    </main>
  );
}
