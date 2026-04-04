"use client";

import React, { useEffect, useState } from "react";
import { useAppContext, MenuItem } from "../state/AppContext";
import Taskbar from "./Taskbar";
import ThemeCrossfade from "./ThemeCrossfade";
import WindowFrame, { SnapRect } from "./WindowFrame";
import Notepad, { getNotepadMenus } from "../apps/Notepad/Notepad";
import ContextMenu from "./ContextMenu";
import DesktopIcon from "./DesktopIcon";
import Explorer, { getExplorerMenus } from "../apps/Explorer/Explorer";

function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

export default function Desktop() {
  const { state, dispatch } = useAppContext();
  const [snapPreview, setSnapPreview] = useState<SnapRect | null>(null);
  const viewportSize = useViewportSize();
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
    // --- ADD THIS BLOCK ---
    if (id.includes("explorer")) {
      return {
        content: <Explorer winId={id} />,
        menus: getExplorerMenus(dispatch, id),
      };
    }
    // ----------------------
    return { content: null };
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;

    const items: MenuItem[] = [
      {
        label: "Arrange Icons",
        submenu: [
          { label: "by Name" },
          { separator: true, label: "" },
          {
            label: state.autoArrange ? "✓ Auto Arrange" : "Auto Arrange",
            action: () =>
              dispatch({
                type: "SET_AUTO_ARRANGE",
                payload: !state.autoArrange,
              }),
          },
        ],
      },
      // --- WIRE THIS UP RIGHT HERE ---
      {
        label: "Line up Icons",
        action: () => dispatch({ type: "ALIGN_ICONS_TO_GRID" }),
      },
      // -------------------------------
      { separator: true, label: "" },
      { label: "Refresh", action: () => window.location.reload() },
      { separator: true, label: "" },
      {
        label: "New",
        submenu: [
          {
            label: "Folder",
            action: () =>
              dispatch({
                type: "ADD_ICON",
                payload: {
                  id: `folder-${Date.now()}`,
                  x: clickX,
                  y: clickY,
                  type: "folder",
                  label: "New Folder",
                },
              }),
          },
          {
            label: "Text Document",
            action: () =>
              dispatch({
                type: "ADD_ICON",
                payload: {
                  id: `text-${Date.now()}`,
                  x: clickX,
                  y: clickY,
                  type: "text",
                  label: "New Text Document.txt",
                },
              }),
          },
          {
            label: "Bitmap Image",
            action: () =>
              dispatch({
                type: "ADD_ICON",
                payload: {
                  id: `bitmap-${Date.now()}`,
                  x: clickX,
                  y: clickY,
                  type: "bitmap",
                  label: "New Bitmap Image.bmp",
                },
              }),
          },
        ],
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
      }}
    >
      <ThemeCrossfade />
      <ContextMenu />

      {snapPreview && (
        <div
          className="absolute z-5 pointer-events-none transition-all duration-200"
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

      {/* Render the Icons directly on the main surface without a blocking div */}
      {state.icons.map((icon, index) => (
        <DesktopIcon key={icon.id} icon={icon} index={index} />
      ))}

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

      <Taskbar />
    </main>
  );
}
