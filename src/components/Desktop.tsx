"use client";

import React, { useEffect, useState } from "react";
import { useAppContext, MenuItem } from "../state/AppContext";
import Taskbar from "./Taskbar";
import ThemeCrossfade from "./ThemeCrossfade";
import WindowFrame, { SnapRect } from "./WindowFrame";
import Notepad, { getNotepadMenus } from "../apps/Notepad/Notepad";
import TerminalApp from "../apps/Terminal/TerminalApp";
import ContextMenu from "./ContextMenu";
import DesktopIcon from "./DesktopIcon";
import BSODOverlay from "./BSODOverlay";

// --------------------------------------------------
// HOOKS
// --------------------------------------------------
import Explorer, { getExplorerMenus } from "../apps/Explorer/Explorer";
import Calendar, { getCalendarMenus } from "../apps/Calendar/Calendar";
import MediaPlayer, { getMediaPlayerMenus } from "../apps/MediaPlayer/MediaPlayer";
import Paint, { getPaintMenus } from "../apps/Paint/Paint";

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
    if (id.includes("terminal") || id.includes("cmd") || id.includes("powershell")) {
      return { content: <TerminalApp winId={id} /> };
    }
    if (id.includes("explorer")) {
      return {
        content: <Explorer winId={id} />,
        menus: getExplorerMenus(dispatch, id),
      };
    }
    if (id.includes("calendar")) {
      return {
        content: <Calendar winId={id} />,
        menus: getCalendarMenus(dispatch, id),
      };
    }
    if (id.includes("media")) {
      return {
        content: <MediaPlayer winId={id} />,
        menus: getMediaPlayerMenus(dispatch, id),
      };
    }
    if (id.includes("paint") || id.includes("bitmap")) {
      return {
        content: <Paint winId={id} />,
        menus: getPaintMenus(dispatch, id),
      };
    }
    return { content: null };
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;

    // Windows 10 authentic right-click menu
    const win10Items: MenuItem[] = [
      {
        label: "View",
        submenu: [
          { label: "Large icons" },
          { label: "Medium icons" },
          { label: "Small icons" },
          { separator: true, label: "" },
          { label: "Auto arrange icons" },
          { label: "Align icons to grid" },
          { separator: true, label: "" },
          { label: "Show desktop icons" },
        ],
      },
      {
        label: "Sort by",
        submenu: [
          { label: "Name" },
          { label: "Size" },
          { label: "Item type" },
          { label: "Date modified" },
        ],
      },
      { label: "Refresh", action: () => window.location.reload() },
      { separator: true, label: "" },
      { label: "Paste", disabled: true },
      { label: "Paste shortcut", disabled: true },
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
          { separator: true, label: "" },
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
        ],
      },
      { separator: true, label: "" },
      { label: "Display settings", action: () => {} },
      { label: "Personalize", action: () => {} },
    ];

    // Classic menu for Win98 / XP / 7
    const classicItems: MenuItem[] = [
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
      {
        label: "Line up Icons",
        action: () => dispatch({ type: "ALIGN_ICONS_TO_GRID" }),
      },
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
          // --- ADDED THIS SO YOU CAN SPAWN THE MEDIA PLAYER ---
          {
            label: "Media File",
            action: () =>
              dispatch({
                type: "ADD_ICON",
                payload: {
                  id: `media-${Date.now()}`,
                  x: clickX,
                  y: clickY,
                  type: "media",
                  label: "Sample Video.avi",
                },
              }),
          },
        ],
      },
    ];

    const items = state.osIndex === 3 ? win10Items : classicItems;

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
      <BSODOverlay />
    </main>
  );
}