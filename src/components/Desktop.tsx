"use client";

import React, { useEffect, useState } from "react";
import { useAppContext, MenuItem } from "../state/AppContext";
import Taskbar from "./Taskbar";
import ThemeCrossfade from "./ThemeCrossfade";
import WindowFrame, { SnapRect } from "./WindowFrame";
import Notepad, { getNotepadMenus } from "../apps/Notepad";
import ContextMenu from "./ContextMenu";

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
  const { state, dispatch } = useAppContext();
  const [snapPreview, setSnapPreview] = useState<SnapRect | null>(null);
  const viewportSize = useViewportSize();

  // Filter out minimized windows from the desktop rendering layer
  const visibleWindows = state.windows.filter((w) => !w.minimized);

  const getAppContent = (
    id: string,
  ): { content: React.ReactNode; menus?: any[] } => {
    if (id.includes("notepad")) {
      return {
        content: <Notepad winId={id} />,
        menus: getNotepadMenus(dispatch, id, state.notepad.text),
      };
    }
    return { content: null };
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // Define Desktop Context Menu Items
    const items: MenuItem[] = [
      {
        label: "Arrange Icons",
        submenu: [
          { label: "by Name", action: () => console.log("Sort Name") },
          { label: "by Type", action: () => console.log("Sort Type") },
          { label: "by Size", action: () => console.log("Sort Size") },
          { label: "by Date", action: () => console.log("Sort Date") },
          { separator: true, label: "" },
          { label: "Auto Arrange", action: () => console.log("Auto Arrange") },
        ],
      },
      { label: "Line up Icons", action: () => console.log("Line up") },
      { separator: true, label: "" },
      { label: "Refresh", action: () => window.location.reload() },
      { separator: true, label: "" },
      {
        label: "New",
        submenu: [
          { label: "Folder", action: () => console.log("New Folder") },
          { label: "Shortcut", action: () => console.log("New Shortcut") },
          { separator: true, label: "" },
          { label: "Text Document", action: () => console.log("New Text") },
          { label: "Bitmap Image", action: () => console.log("New BMP") },
        ],
      },
      { separator: true, label: "" },
      {
        label: "Properties",
        disabled: true,
        action: () => console.log("Properties"),
      },
    ];

    dispatch({
      type: "OPEN_CONTEXT_MENU",
      payload: { x: e.clientX, y: e.clientY, items },
    });
  };

  return (
    <main
      onContextMenu={handleContextMenu}
      className="relative h-screen w-screen overflow-hidden transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: "var(--os-bg)",
        backgroundImage: "var(--os-wallpaper)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "var(--os-text)",
      }}
    >
      <ThemeCrossfade />

      {/* Context Menu Layer */}
      <ContextMenu />

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
        {visibleWindows.map((win) => {
          const { content, menus } = getAppContent(win.id);
          return (
            <WindowFrame
              key={win.id}
              win={win}
              onSnapHover={setSnapPreview}
              viewportSize={viewportSize}
              menuItems={menus}
            >
              {content}
            </WindowFrame>
          );
        })}
      </div>

      { }
      <Taskbar />
    </main>
  );
}
