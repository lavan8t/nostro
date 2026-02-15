"use client";

import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useAppContext, WindowState, MenuItem } from "../state/AppContext";
import { Icons } from "./Icons";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface SnapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type SnapType =
  | "top"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;

interface WindowFrameProps {
  win: WindowState;
  children: React.ReactNode;
  viewportSize: { width: number; height: number };
  onSnapHover: (rect: SnapRect | null) => void;
  menuItems?: MenuItem[];
}

// --------------------------------------------------
// HELPER: Title
// --------------------------------------------------

const getWindowTitle = (id: string) => {
  if (id.includes("notepad")) return "Untitled - Notepad";
  if (id.includes("paint")) return "Untitled - Paint";
  if (id.includes("terminal") || id.includes("cmd")) return "Command Prompt";
  if (id.includes("internet") || id.includes("browser"))
    return "Internet Explorer";
  if (id.includes("explorer")) return "File Explorer";
  return "Application";
};

// --------------------------------------------------
// HELPER: Title Bar Controls
// --------------------------------------------------

const TitleBarControls = ({
  osIndex,
  onMinimize,
  onMaximize,
  onClose,
}: {
  osIndex: number;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximize: (e: React.MouseEvent) => void;
  onClose: (e: React.MouseEvent) => void;
}) => {
  // Win98 / Classic
  if (osIndex === 0) {
    return (
      <div className="flex items-center gap-[2px] mr-[2px]">
        <button
          onClick={onMinimize}
          className="w-[16px] h-[14px] flex items-center justify-center bg-[var(--ButtonFace)] border-t border-[var(--ButtonHilight)] border-l border-[var(--ButtonHilight)] border-r border-[var(--ButtonDkShadow)] border-b border-[var(--ButtonDkShadow)] active:border-t-[var(--ButtonDkShadow)] active:border-l-[var(--ButtonDkShadow)] active:border-r-[var(--ButtonHilight)] active:border-b-[var(--ButtonHilight)]"
        >
          <div className="w-[6px] h-[2px] bg-black mb-[4px]" />
        </button>
        <button
          onClick={onMaximize}
          className="w-[16px] h-[14px] flex items-center justify-center bg-[var(--ButtonFace)] border-t border-[var(--ButtonHilight)] border-l border-[var(--ButtonHilight)] border-r border-[var(--ButtonDkShadow)] border-b border-[var(--ButtonDkShadow)] active:border-t-[var(--ButtonDkShadow)] active:border-l-[var(--ButtonDkShadow)] active:border-r-[var(--ButtonHilight)] active:border-b-[var(--ButtonHilight)]"
        >
          <div className="w-[9px] h-[8px] border-t-2 border-l-2 border-r border-b border-black" />
        </button>
        <button
          onClick={onClose}
          className="w-[16px] h-[14px] flex items-center justify-center bg-[var(--ButtonFace)] border-t border-[var(--ButtonHilight)] border-l border-[var(--ButtonHilight)] border-r border-[var(--ButtonDkShadow)] border-b border-[var(--ButtonDkShadow)] active:border-t-[var(--ButtonDkShadow)] active:border-l-[var(--ButtonDkShadow)] active:border-r-[var(--ButtonHilight)] active:border-b-[var(--ButtonHilight)] ml-[2px]"
        >
          <svg viewBox="0 0 10 10" className="w-[8px] h-[8px]">
            <path d="M1 1L9 9M9 1L1 9" stroke="black" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    );
  }

  // WinXP
  if (osIndex === 1) {
    return (
      <div className="flex items-center gap-1 mr-1">
        <button
          onClick={onMinimize}
          className="w-[21px] h-[21px] bg-[#2963d7] rounded-[3px] flex items-center justify-center text-white hover:brightness-110 shadow-inner border border-white/20"
        >
          <div className="w-[8px] h-[2px] bg-white mt-1" />
        </button>
        <button
          onClick={onMaximize}
          className="w-[21px] h-[21px] bg-[#2963d7] rounded-[3px] flex items-center justify-center text-white hover:brightness-110 shadow-inner border border-white/20"
        >
          <div className="w-[10px] h-[8px] border border-white" />
        </button>
        <button
          onClick={onClose}
          className="w-[21px] h-[21px] bg-[#d73f29] rounded-[3px] flex items-center justify-center text-white hover:brightness-110 shadow-inner border border-white/20 ml-1"
        >
          <svg viewBox="0 0 10 10" className="w-[8px] h-[8px]">
            <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="2" />
          </svg>
        </button>
      </div>
    );
  }

  // Win7 / 10 (Modern)
  const isWin7 = osIndex === 2;
  return (
    <div className={`flex items-center h-full ${isWin7 ? "gap-1 mr-2" : ""}`}>
      <button
        onClick={onMinimize}
        className={`h-full flex items-center justify-center hover:bg-black/10 transition-colors ${isWin7 ? "w-[28px]" : "w-[46px]"}`}
      >
        <div className="w-[10px] h-[1px] bg-current" />
      </button>
      <button
        onClick={onMaximize}
        className={`h-full flex items-center justify-center hover:bg-black/10 transition-colors ${isWin7 ? "w-[28px]" : "w-[46px]"}`}
      >
        <div className="w-[10px] h-[10px] border border-current" />
      </button>
      <button
        onClick={onClose}
        className={`h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white transition-colors ${isWin7 ? "w-[40px] rounded-[3px]" : "w-[46px]"}`}
      >
        <svg viewBox="0 0 10 10" className="w-[10px] h-[10px]">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>
    </div>
  );
};

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function WindowFrame({
  win,
  children,
  viewportSize,
  onSnapHover,
  menuItems,
}: WindowFrameProps) {
  const { state, dispatch } = useAppContext();
  const { width: vw, height: vh } = viewportSize;

  // Refs & State
  const rndRef = useRef<Rnd>(null);
  const snapTypeRef = useRef<SnapType>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [animState, setAnimState] = useState<
    "entering" | "visible" | "exiting" | "closing"
  >("entering");
  const [isInteracting, setIsInteracting] = useState(false);

  // OS Flags
  const isWin10 = state.osIndex === 3;
  const isWin7 = state.osIndex === 2;
  const isXP = state.osIndex === 1;
  const isClassic = state.osIndex === 0;

  // Mount Animation
  useEffect(() => {
    setAnimState("entering");
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setAnimState("visible");
      });
    });
    return () => {
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  // Actions
  const activate = () => {
    if (!win.focused) {
      dispatch({
        type: "UPDATE_WINDOW",
        payload: { id: win.id, z: 0, focused: true },
      });
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    setAnimState("exiting");
    animationTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "MINIMIZE_WINDOW", payload: win.id });
    }, 300);
  };

  const handleMaximizeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    win.maximized
      ? dispatch({ type: "UNMAXIMIZE_WINDOW", payload: win.id })
      : dispatch({ type: "MAXIMIZE_WINDOW", payload: win.id });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    setAnimState("closing");
    animationTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "REMOVE_WINDOW", payload: win.id });
    }, 300);
  };

  // Drag & Snap Logic
  const handleDrag = (e: any, d: any) => {
    if (win.maximized) {
      if (d.y > 20) {
        const restoredWidth = win.width;
        const newX = Math.max(
          -(restoredWidth - 10),
          Math.min(e.clientX - restoredWidth / 2, vw - 10),
        );
        dispatch({ type: "UNMAXIMIZE_WINDOW", payload: win.id });
        dispatch({
          type: "UPDATE_WINDOW",
          payload: { id: win.id, x: newX, y: d.y, focused: true },
        });
      }
      return;
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const taskbarHeight = 40;
    const workHeight = vh - taskbarHeight;
    const EDGE = 20;

    let newSnap: SnapType = null;
    let preview: SnapRect | null = null;

    if (mouseY < 10) {
      if (mouseX < EDGE) {
        newSnap = "top-left";
        preview = { x: 0, y: 0, width: vw / 2, height: workHeight / 2 };
      } else if (mouseX > vw - EDGE) {
        newSnap = "top-right";
        preview = { x: vw / 2, y: 0, width: vw / 2, height: workHeight / 2 };
      } else {
        newSnap = "top";
        preview = { x: 0, y: 0, width: vw, height: workHeight };
      }
    } else if (mouseY > workHeight - EDGE) {
      if (mouseX < EDGE) {
        newSnap = "bottom-left";
        preview = {
          x: 0,
          y: workHeight / 2,
          width: vw / 2,
          height: workHeight / 2,
        };
      } else if (mouseX > vw - EDGE) {
        newSnap = "bottom-right";
        preview = {
          x: vw / 2,
          y: workHeight / 2,
          width: vw / 2,
          height: workHeight / 2,
        };
      }
    } else {
      if (mouseX < EDGE) {
        newSnap = "left";
        preview = { x: 0, y: 0, width: vw / 2, height: workHeight };
      } else if (mouseX > vw - EDGE) {
        newSnap = "right";
        preview = { x: vw / 2, y: 0, width: vw / 2, height: workHeight };
      }
    }

    if (snapTypeRef.current !== newSnap) {
      snapTypeRef.current = newSnap;
      onSnapHover(preview);
    }
  };

  const handleDragStop = (e: any, d: any) => {
    setIsInteracting(false);
    const snap = snapTypeRef.current;
    const workHeight = vh - 40;
    const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);

    if (snap) {
      if (snap === "top") {
        dispatch({ type: "MAXIMIZE_WINDOW", payload: win.id });
      } else {
        let rect = { x: 0, y: 0, width: 0, height: 0 };
        if (snap === "left")
          rect = { x: 0, y: 0, width: vw / 2, height: workHeight };
        else if (snap === "right")
          rect = { x: vw / 2, y: 0, width: vw / 2, height: workHeight };
        else if (snap === "top-left")
          rect = { x: 0, y: 0, width: vw / 2, height: workHeight / 2 };
        else if (snap === "top-right")
          rect = { x: vw / 2, y: 0, width: vw / 2, height: workHeight / 2 };
        else if (snap === "bottom-left")
          rect = {
            x: 0,
            y: workHeight / 2,
            width: vw / 2,
            height: workHeight / 2,
          };
        else if (snap === "bottom-right")
          rect = {
            x: vw / 2,
            y: workHeight / 2,
            width: vw / 2,
            height: workHeight / 2,
          };

        dispatch({
          type: "UPDATE_WINDOW",
          payload: {
            id: win.id,
            ...rect,
            maximized: false,
            focused: true,
            z: maxZ + 1,
          },
        });
      }
    } else {
      dispatch({
        type: "UPDATE_WINDOW",
        payload: { id: win.id, x: d.x, y: d.y },
      });
    }
    snapTypeRef.current = null;
    onSnapHover(null);
  };

  // Rendering Styles
  const dropDistance = vh - win.y;

  const getAnimationStyles = (): React.CSSProperties => {
    const base =
      "transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease-in-out";
    if (animState === "entering")
      return {
        opacity: 0,
        transform: `scale(0.8) translateY(${dropDistance * 0.2}px)`,
        transition: base,
      };
    if (animState === "exiting")
      return {
        opacity: 0,
        transform: `scale(0.6) translateY(${dropDistance * 0.5}px)`,
        transformOrigin: "bottom center",
        transition: base,
      };
    if (animState === "closing")
      return {
        opacity: 0,
        transform: "scale(0.9)",
        transition: "transform 200ms ease-out, opacity 200ms ease-out",
      };
    return {
      opacity: 1,
      transform: "scale(1) translateY(0)",
      transition: base,
    };
  };

  const titleBarHeight = isClassic ? 18 : 30;

  const frameStyle: React.CSSProperties = {
    backgroundColor: "var(--os-bg)",
    boxShadow: isClassic
      ? "1px 1px 0 0 black, -1px -1px 0 0 white, inset 1px 1px 0 0 var(--ButtonHilight), inset -1px -1px 0 0 var(--ButtonShadow)"
      : isXP
        ? "4px 4px 8px rgba(0,0,0,0.3)"
        : "0 0 10px rgba(0,0,0,0.3), 0 0 0 1px var(--os-window-border)",
    border: isClassic
      ? "2px solid var(--ButtonFace)"
      : isXP
        ? "3px solid #0058ee"
        : isWin7
          ? "1px solid rgba(0,0,0,0.4)"
          : "1px solid var(--os-window-border)",
    borderRadius: isXP ? "4px 4px 0 0" : isWin7 ? "6px" : "0px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    fontFamily: "var(--os-font)",
    ...getAnimationStyles(),
  };

  return (
    <Rnd
      ref={rndRef}
      size={
        win.maximized
          ? { width: vw, height: Math.max(0, vh - 40) }
          : { width: win.width, height: win.height }
      }
      position={win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
      onDragStart={() => {
        setIsInteracting(true);
        activate();
      }}
      onDragStop={handleDragStop}
      onDrag={handleDrag}
      onResizeStart={() => {
        setIsInteracting(true);
        activate();
      }}
      onResizeStop={(e, dir, ref, d, pos) => {
        setIsInteracting(false);
        if (!win.maximized)
          dispatch({
            type: "UPDATE_WINDOW",
            payload: {
              id: win.id,
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...pos,
            },
          });
      }}
      dragHandleClassName="window-titlebar"
      minWidth={200}
      minHeight={100}
      bounds="parent"
      style={{
        zIndex: win.z,
        display: win.minimized ? "none" : "flex",
        ...frameStyle,
      }}
      className={!isInteracting ? "transition-all duration-75" : ""}
      disableDragging={win.maximized}
      enableResizing={!win.maximized}
      onMouseDown={activate}
    >
      {/* TITLE BAR */}
      <div
        className="window-titlebar flex items-center justify-between select-none overflow-hidden shrink-0"
        onDoubleClick={handleMaximizeToggle}
        style={{
          height: titleBarHeight,
          background: win.focused ? "var(--os-accent)" : "var(--InactiveTitle)",
          backgroundImage: isClassic
            ? win.focused
              ? "linear-gradient(to right, var(--ActiveTitle), var(--GradientActiveTitle))"
              : "linear-gradient(to right, var(--InactiveTitle), var(--GradientInactiveTitle))"
            : isXP
              ? win.focused
                ? "linear-gradient(to bottom, #0058ee 0%, #3b80f5 10%, #0058ee 100%)"
                : "linear-gradient(to bottom, #7695ce 0%, #8da3d3 100%)"
              : isWin7
                ? "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 100%)"
                : undefined,
          color: win.focused
            ? "var(--ActiveTitleText)"
            : "var(--InactiveTitleText)",
          paddingLeft: "4px",
          borderBottom: isWin7 ? "1px solid rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div className="flex items-center gap-2 pl-1 truncate">
          {/* App Icon */}
          <div className="w-4 h-4 text-current opacity-90">
            <Icons.App />
          </div>
          <span
            className="text-xs font-bold truncate"
            style={{
              textShadow: isXP || isWin7 ? "0 0 2px rgba(0,0,0,0.5)" : "none",
            }}
          >
            {getWindowTitle(win.id)}
          </span>
        </div>

        <TitleBarControls
          osIndex={state.osIndex}
          onMinimize={handleMinimize}
          onMaximize={handleMaximizeToggle}
          onClose={handleClose}
        />
      </div>

      {/* MENU BAR (Classic/Default only) */}
      {(menuItems || isClassic) && (
        <div
          className="flex items-center px-1 bg-[var(--Menu)] text-[var(--MenuText)] border-b border-[var(--ButtonShadow)] h-[20px] select-none text-[11px]"
          style={{ display: isClassic ? "flex" : "none" }}
        >
          {(
            menuItems || [
              { label: "File" },
              { label: "Edit" },
              { label: "View" },
              { label: "Help" },
            ]
          ).map((item, idx) => (
            <button
              key={idx}
              className="px-2 hover:bg-[var(--Hilight)] hover:text-[var(--HilightText)] disabled:text-[var(--GrayText)]"
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto bg-[var(--os-bg)] text-[var(--os-text)] relative">
        {children}
      </div>
    </Rnd>
  );
}
