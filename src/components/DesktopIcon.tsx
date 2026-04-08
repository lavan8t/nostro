"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppContext, DesktopIconState, MenuItem } from "../state/AppContext";
import { makeWindow } from "../state/windowFactory";

// --------------------------------------------------
// FALLBACK ICON (White Document with Folded Corner)
// --------------------------------------------------
const FallbackFileIcon = () => (
  <div className="absolute inset-0 flex items-center justify-center drop-shadow-md">
    <svg
      viewBox="0 0 24 24"
      fill="white"
      stroke="#666"
      strokeWidth="1"
      className="w-[85%] h-[85%]"
    >
      <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v6h6" fill="#eee" />
    </svg>
  </div>
);

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------
export default function DesktopIcon({
  icon,
  index,
}: {
  icon: DesktopIconState;
  index: number;
}) {
  const { state, dispatch } = useAppContext();

  // --- Refs ---
  const nodeRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const isDraggingRef = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const renameInputRef = useRef<HTMLInputElement>(null);

  // --- State ---
  const [selected, setSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  // Determine properties
  const osIndex = state.osIndex;
  const isClassic = osIndex <= 1;
  const iconType = icon.type || icon.id;

  // Built-in icons that cannot be renamed or deleted
  const BUILTIN_IDS = ["computer", "recycle", "terminal", "controlpanel"];
  const isBuiltin =
    BUILTIN_IDS.includes(icon.id) || BUILTIN_IDS.includes(iconType);

  let label = icon.label || "Icon";
  if (iconType === "computer")
    label =
      osIndex <= 2 ? "My Computer" : "This PC";
  if (iconType === "recycle")
    label = "Recycle Bin";
  if (iconType === "terminal" && osIndex === 0)
    label = "MS-DOS Prompt";

  // --- Grid & Positioning ---
  const GRID_SIZE_X = 90;
  const GRID_SIZE_Y = 100;
  let targetX = icon.x;
  let targetY = icon.y;

  if (state.autoArrange) {
    const maxRows = Math.floor(
      (typeof window !== "undefined" ? window.innerHeight - 80 : 800) /
        GRID_SIZE_Y,
    );
    const rows = maxRows > 0 ? maxRows : 6;
    const col = Math.floor(index / rows);
    const row = index % rows;
    targetX = 10 + col * GRID_SIZE_X;
    targetY = 10 + row * GRID_SIZE_Y;
  }

  const [pos, setPos] = useState({ x: targetX, y: targetY });

  // Keep local pos synced with global pos (unless we are actively dragging)
  useEffect(() => {
    if (!isDraggingRef.current) setPos({ x: targetX, y: targetY });
  }, [targetX, targetY]);

  // Focus rename input when it appears
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);
  // --- Icon Image Resolution ---
  const getIconFileName = () => {
    switch (iconType) {
      case "computer":
        return "computer.ico";
      case "recycle":
        return state.recycleBinFilled
          ? "recycle_bin_full.ico"
          : "recycle_bin_empty.ico";
      case "folder":
        return "folder.ico";
      case "text":
        return "text.ico";
      case "shortcut":
        return "shortcut.ico";
      case "controlpanel":
        return "controlpanel.ico";
      case "terminal":
        return "command_prompt.ico";
      case "media":
        return "media.ico";
      case "paint":
        return "paint.ico";
      default:
        return "default.png";
    }
  };

  const osDir = ["win98", "winxp", "win7", "win10"][osIndex] || "win10";
  const iconPath = `/assets/${osDir}/icons/${getIconFileName()}`;
  const [imgError, setImgError] = useState(false);

  // --- Drag & Drop via Pointer Events ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (isRenaming) return;
    e.stopPropagation();

    setSelected(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    isPointerDown.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...pos };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;

    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;

    if (!isDraggingRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }

    if (isDraggingRef.current) {
      setPos({ x: posStart.current.x + dx, y: posStart.current.y + dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;

    isPointerDown.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      dispatch({
        type: "UPDATE_ICON_POS",
        payload: { id: icon.id, x: pos.x, y: pos.y },
      });

      if (state.autoArrange) {
        dispatch({ type: "SET_AUTO_ARRANGE", payload: false });
      }
    }
  };

  // --- App Launching (Open) ---
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRenaming) return;

    let baseId = `app-${icon.id}`;
    if (iconType === "text") baseId = `notepad-${icon.id}`;
    else if (iconType === "bitmap") baseId = `paint-${icon.id}`;
    else if (iconType === "computer" || iconType === "folder")
      baseId = `explorer-${icon.id}`;

    const maxZ =
      state.windows.length > 0
        ? Math.max(...state.windows.map((w) => w.z))
        : 0;

    const offset = state.windows.length * 25;
    const spawnX = 100 + offset;
    const spawnY = 100 + offset;

    dispatch({
      type: "ADD_WINDOW",
      payload: makeWindow({
        id: `${baseId}-${Date.now()}`,
        z: maxZ + 1,
        focused: true,
        x: spawnX,
        y: spawnY,
      }),
    });
  };

  // --- Rename helpers ---
  const startRename = () => {
    setRenameValue(label);
    setIsRenaming(true);
  };

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== label) {
      dispatch({
        type: "RENAME_ICON",
        payload: { id: icon.id, label: trimmed },
      });
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") setIsRenaming(false);
  };

  // --- Context Menu ---
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(true);

    // Windows 10 file context menu
    if (osIndex === 3) {
      const win10FileItems: MenuItem[] = [
        { label: "Open", action: () => handleDoubleClick(e) },
        { label: "Edit", disabled: true },
        { label: "Print", disabled: true },
        { label: "Scan with Microsoft Defender...", disabled: true },
        { label: "Share", disabled: true },
        {
          label: "Open with",
          submenu: [{ label: "Choose another app", disabled: true }],
        },
        {
          label: "Give access to",
          submenu: [{ label: "Specific people...", disabled: true }],
        },
        { label: "Restore previous versions", disabled: true },
        {
          label: "Send to",
          submenu: [
            { label: "Desktop (create shortcut)", disabled: true },
            { label: "Documents", disabled: true },
            { label: "Mail recipient", disabled: true },
          ],
        },
        { separator: true, label: "" },
        { label: "Cut", disabled: true },
        { label: "Copy", disabled: true },
        { separator: true, label: "" },
        { label: "Create shortcut", disabled: true },
        {
          label: "Delete",
          disabled: isBuiltin,
          action: isBuiltin
            ? undefined
            : () => dispatch({ type: "REMOVE_ICON", payload: icon.id }),
        },
        {
          label: "Rename",
          disabled: isBuiltin,
          action: isBuiltin ? undefined : startRename,
        },
        { separator: true, label: "" },
        { label: "Properties", disabled: true },
      ];

      dispatch({
        type: "OPEN_CONTEXT_MENU",
        payload: { x: e.clientX, y: e.clientY, items: win10FileItems },
      });
      return;
    }

    // Classic context menu (Win98 / XP / 7)
    const items: MenuItem[] = [
      { label: "Open", action: () => handleDoubleClick(e) },
      { separator: true, label: "" },
    ];

    if (iconType === "recycle") {
      items.push({
        label: "Empty Recycle Bin",
        action: () => dispatch({ type: "EMPTY_RECYCLE_BIN" }),
        disabled: !state.recycleBinFilled,
      });
      items.push({ separator: true, label: "" });
    }

    if (!isBuiltin) {
      items.push({ label: "Rename", action: startRename });
      items.push({
        label: "Delete",
        action: () => dispatch({ type: "REMOVE_ICON", payload: icon.id }),
      });
      items.push({ separator: true, label: "" });
    }

    items.push({ label: "Properties", disabled: true });
    dispatch({
      type: "OPEN_CONTEXT_MENU",
      payload: { x: e.clientX, y: e.clientY, items },
    });
  };
  
  // --- Click Outside to Deselect / Commit Rename ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setSelected(false);
        if (isRenaming) commitRename();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isRenaming, renameValue]);

  // --- Styles ---
  const textStyle: React.CSSProperties = {
    color: "white",
    textShadow: osIndex === 0 ? "none" : "1px 1px 2px rgba(0,0,0,0.8)",
  };

  return (
    <div
      ref={nodeRef}
      className="absolute flex flex-col items-center justify-start p-1 w-[90px] select-none group"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: isDragging ? 0.6 : 1,
        zIndex: 0,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Icon Image */}
      <div
        className={`mb-1 w-8 h-8 relative ${
          selected
            ? "opacity-80 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
            : ""
        }`}
      >
        {!imgError ? (
          <img
            src={iconPath}
            alt={label}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
            draggable={false}
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <FallbackFileIcon />
        )}
      </div>

      {/* Label — inline rename input or static text */}
      {isRenaming ? (
        <input
          ref={renameInputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={commitRename}
          onClick={(e) => e.stopPropagation()}
          className="icon-rename-input"
          maxLength={64}
        />
      ) : (
        <div
          className={`text-[11px] text-center leading-tight px-1 rounded-sm line-clamp-3 wrap-break-word w-full ${
            selected
              ? isClassic
                ? "bg-[#000080] text-white border border-dotted border-white/50"
                : "bg-[#316ac5] bg-opacity-60 text-white"
              : "border border-transparent"
          }`}
          style={!selected ? textStyle : {}}
        >
          {label}
        </div>
      )}
    </div>
  );
}

