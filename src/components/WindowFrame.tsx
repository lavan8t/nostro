"use client";

import React, { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useAppContext, WindowState, MenuItem } from "../state/AppContext";
import { Icons } from "./Icons";

// --------------------------------------------------
// CONSTANTS & STYLES (Migrated from CSS Module)
// --------------------------------------------------

// Windows 7 Theme Constants
const WIN7_STYLES = {
  glassBackground: `
    linear-gradient(135deg, #fff5 70px, transparent 100px),
    linear-gradient(225deg, #fff5 70px, transparent 100px),
    linear-gradient(
      54deg,
      #0002 0 4%, #6661 6% 6%, #0002 8% 10%, #0002 15% 16%, #aaa1 17% 18%,
      #0002 23% 24%, #bbb2 25% 26%, #0002 31% 33%, #0002 34% 34.5%, #bbb2 36% 40%,
      #0002 41% 41.5%, #bbb2 44% 45%, #bbb2 46% 47%, #0002 48% 49%, #0002 50% 50.5%,
      #0002 56% 56.5%, #bbb2 57% 63%, #0002 67% 69%, #bbb2 69.5% 70%, #0002 73.5% 74%,
      #bbb2 74.5% 79%, #0002 80% 84%, #aaa2 85% 86%, #0002 87%, #bbb1 90%
    ) center/100vw 100vh no-repeat fixed
  `,
  windowBg: "#4580c4",
  borderColor: "#000000b3",
};

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

// --------------------------------------------------
// HELPER
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
// SUB-COMPONENTS
// --------------------------------------------------

// Authentic XP Button
function XPButton({
  type,
  onClick,
}: {
  type: string;
  onClick: (e: any) => void;
}) {
  const isClose = type === "close";
  const bg = isClose
    ? "radial-gradient(circle at 90% 90%, #cc4600 0%, #dc6527 55%, #cd7546 70%, #ffccb2 90%, white 100%)"
    : "radial-gradient(circle at 90% 90%, #0054e9 0%, #2263d5 55%, #4479e4 70%, #a3bbec 90%, white 100%)";
  const shadow = isClose
    ? "inset 0 -1px 2px 1px #da4600"
    : "inset 0 -1px 2px 1px #4646ff";

  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      className="group relative flex items-center justify-center rounded-[3px] border border-white hover:brightness-110 active:brightness-90 outline-none"
      style={{
        width: "21px",
        height: "21px",
        backgroundImage: bg,
        boxShadow: shadow,
        marginLeft: "2px",
        cursor: "default",
      }}
    >
      {type === "minimize" && (
        <div className="absolute left-1 top-3.25 w-2 h-0.75 bg-white shadow-[0_1px_0_rgba(0,0,0,0.3)]" />
      )}
      {type === "maximize" && (
        <div className="absolute left-1 top-1 w-3 h-3 shadow-[inset_0_3px_0_0_white,inset_0_0_0_1px_white]" />
      )}
      {type === "restore" && (
        <>
          <div className="absolute left-1.75 top-1 w-2 h-2 shadow-[inset_0_2px_0_0_white,inset_0_0_0_1px_white]" />
          <div className="absolute left-1 top-1.75 w-2 h-2 bg-[#136dff] shadow-[inset_0_2px_0_0_white,inset_0_0_0_1px_white] z-10" />
        </>
      )}
      {type === "close" && (
        <svg
          viewBox="0 0 10 10"
          className="w-2.5 h-2.5 text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.3)]"
          style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.25))" }}
        >
          <path d="M0 0 L10 10 M10 0 L0 10" stroke="white" strokeWidth="2" />
        </svg>
      )}
    </button>
  );
}

// Authentic Win98/Classic Button
function ClassicButton({
  type,
  onClick,
  isMaximized,
}: {
  type: string;
  onClick: (e: any) => void;
  isMaximized?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-4 h-3.5 flex items-center justify-center bg-(--ButtonFace) border-t border-l border-(--ButtonHilight) border-r border-b active:border-t-(--ButtonDkShadow) active:border-l-(--ButtonDkShadow) active:border-r-(--ButtonHilight) active:border-b-(--ButtonHilight) shadow-[inset_-1px_-1px_0_0_var(--ButtonShadow),inset_1px_1px_0_0_var(--ButtonLight)] active:shadow-[inset_1px_1px_0_0_var(--ButtonShadow)] p-0 m-0 group"
    >
      <div className="w-full h-full relative group-active:translate-x-px group-active:translate-y-px">
        {type === "minimize" && (
          <div className="absolute left-0.75 bottom-0.75 w-1.5 h-0.5 bg-(--ButtonText)" />
        )}
        {type === "maximize" && !isMaximized && (
          <div className="absolute top-0.5 left-0.5 w-2.25 h-2 border-t-2 border border-(--ButtonText)" />
        )}
        {type === "maximize" && isMaximized && (
          <>
            <div className="absolute bottom-0.75 left-px w-1.75 h-1.75 border-t-2 border border-(--ButtonText) bg-(--ButtonFace) z-2" />
            <div className="absolute top-px right-0.5 w-1.75 h-1.75 border-t-2 border border-(--ButtonText) z-1" />
          </>
        )}
        {type === "close" && (
          <>
            <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-(--ButtonText) -translate-x-1/2 -translate-y-1/2 rotate-45" />
            <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-(--ButtonText) -translate-x-1/2 -translate-y-1/2 -rotate-45" />
          </>
        )}
      </div>
    </button>
  );
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function WindowFrame({
  win,
  onSnapHover,
  viewportSize,
  children,
  menuItems,
}: {
  win: WindowState;
  onSnapHover: (rect: SnapRect | null) => void;
  viewportSize: { width: number; height: number };
  children?: React.ReactNode;
  menuItems?: MenuItem[];
}) {
  const { state, dispatch } = useAppContext();
  const { width: vw, height: vh } = viewportSize;

  const [animState, setAnimState] = useState<
    "entering" | "visible" | "exiting" | "closing"
  >("entering");
  const [isInteracting, setIsInteracting] = useState(false);

  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const snapTypeRef = useRef<SnapType>(null);

  const isWin7 = state.osIndex === 2;
  const isXP = state.osIndex === 1;
  const isClassic = state.osIndex === 0;

  const windowTitle = getWindowTitle(win.id);

  // Mount animation
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
      const sorted = [...state.windows].sort((a, b) => a.z - b.z);
      const others = sorted.filter((w) => w.id !== win.id);
      [...others, win].forEach((w, i) => {
        dispatch({
          type: "UPDATE_WINDOW",
          payload: { id: w.id, z: i + 1, focused: w.id === win.id },
        });
      });
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    setAnimState("closing");
    animationTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "REMOVE_WINDOW", payload: win.id });
    }, 300);
  };

  // Drag Logic
  const handleDrag = (e: any, d: any) => {
    if (win.maximized && d.y > 20) {
      const newX = Math.max(
        -(win.width - 10),
        Math.min(e.clientX - win.width / 2, vw - 10),
      );
      dispatch({ type: "UNMAXIMIZE_WINDOW", payload: win.id });
      dispatch({
        type: "UPDATE_WINDOW",
        payload: { id: win.id, x: newX, y: d.y, focused: true },
      });
      return;
    }
    const mouseX = e.clientX,
      mouseY = e.clientY,
      workHeight = vh - 40;
    let newSnap: SnapType = null;
    let preview: SnapRect | null = null;

    if (mouseY < 10) {
      if (mouseX < 20) {
        newSnap = "top-left";
        preview = { x: 0, y: 0, width: vw / 2, height: workHeight / 2 };
      } else if (mouseX > vw - 20) {
        newSnap = "top-right";
        preview = { x: vw / 2, y: 0, width: vw / 2, height: workHeight / 2 };
      } else {
        newSnap = "top";
        preview = { x: 0, y: 0, width: vw, height: workHeight };
      }
    } else if (mouseX < 20) {
      newSnap = "left";
      preview = { x: 0, y: 0, width: vw / 2, height: workHeight };
    } else if (mouseX > vw - 20) {
      newSnap = "right";
      preview = { x: vw / 2, y: 0, width: vw / 2, height: workHeight };
    }

    if (snapTypeRef.current !== newSnap) {
      snapTypeRef.current = newSnap;
      onSnapHover(preview);
    }
  };

  const handleDragStop = (e: any, d: any) => {
    setIsInteracting(false);
    const snap = snapTypeRef.current;
    if (snap) {
      if (snap === "top")
        dispatch({ type: "MAXIMIZE_WINDOW", payload: win.id });
      else {
        let rect = { x: 0, y: 0, width: vw / 2, height: vh - 40 };
        if (snap === "right") rect.x = vw / 2;
        dispatch({
          type: "UPDATE_WINDOW",
          payload: { id: win.id, ...rect, maximized: false, focused: true },
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

  // Styles Hook
  const dropDistance = vh - win.y;
  const getStyles = () => {
    if (isXP || isClassic) {
      return {
        opacity: animState === "visible" ? 1 : 0,
        transition: "opacity 150ms ease-in-out",
        transform: "none",
      };
    }
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

  const rndTransition = isInteracting
    ? "none"
    : "transform 200ms ease-in-out, width 200ms ease-in-out, height 200ms ease-in-out";
  const position = win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y };
  const size = win.maximized
    ? { width: vw, height: Math.max(0, vh - 40) }
    : { width: win.width, height: win.height };

  // --------------------------------------------------
  // WINDOWS 7 RENDERER (Original Style Logic Migrated)
  // --------------------------------------------------
  if (isWin7) {
    return (
      <Rnd
        size={size}
        position={position}
        style={{ zIndex: win.z, transition: rndTransition }}
        dragHandleClassName="window-header"
        disableDragging={win.maximized}
        enableResizing={!win.maximized}
        onDragStart={() => {
          setIsInteracting(true);
          activate();
        }}
        onResizeStart={() => {
          setIsInteracting(true);
          activate();
        }}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onMouseDown={activate}
      >
        <div style={{ width: "100%", height: "100%" }}>
          <div
            className={`window ${win.focused ? "active" : ""}`}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "6px",
              boxShadow: `2px 2px 10px 1px ${WIN7_STYLES.borderColor}, inset 0 0 0 1px #fffa`,
              border: `1px solid ${WIN7_STYLES.borderColor}`,
              backgroundColor: "transparent",
              position: "relative",
              ...getStyles(),
            }}
          >
            {/* Glass Overlay Background */}
            <div
              style={{
                position: "absolute",
                zIndex: -1,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "6px",
                background: `linear-gradient(transparent 20%, #ffffffb3 40%, transparent 41%), linear-gradient(to right, #ffffff66, #0000001a, #ffffff33), ${WIN7_STYLES.windowBg}`,
                backgroundColor: WIN7_STYLES.windowBg,
                boxShadow: "inset 0 0 0 1px #fffd",
                opacity: 0.95,
              }}
            />

            {/* Title Bar */}
            <div
              className="window-header"
              onDoubleClick={handleMaximizeToggle}
              style={{
                borderRadius: "6px 6px 0 0",
                background: "transparent",
                boxShadow:
                  "inset 0 1px 0 #fffd, inset 1px 0 0 #fffd, inset -1px 0 0 #fffd",
                display: "flex",
                alignItems: "center",
                padding: "3px 2px",
                minHeight: "18px",
                color: "#000",
                textShadow: "0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "0 4px",
                }}
              >
                {windowTitle}
              </div>
              {/* Controls */}
              <div
                style={{
                  display: "flex",
                  background: "#fff3",
                  border: "1px solid #0000004d",
                  borderTop: "0",
                  borderRadius: "0 0 5px 5px",
                  boxShadow: "0 1px 0 #fffa, 1px 0 0 #fffa, -1px 0 0 #fffa",
                  marginRight: "4px",
                }}
              >
                <button
                  onClick={handleMinimize}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-7 h-[18h-4.5er-r border-[#0000004d] hover:bg-[#ffffff4d] relative"
                >
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_#fff5]">
                    <div className="absolute left-2.25 bottom-1 w-2.5 h-0.5 bg-black" />
                  </div>
                </button>
                <button
                  onClick={handleMaximizeToggle}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-7 h-4.5 border-r border-[#0000004d] hover:bg-[#ffffff4d] relative"
                >
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_#fff5]">
                    <div className="absolute top-1 left-2.25 w-2.5 h-2 border border-black" />
                  </div>
                </button>
                <button
                  onClick={handleClose}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-10 h-4.5 rounded-[0_0_5px_0] hover:bg-[#d54f36] relative group"
                >
                  <div className="absolute inset-0 shadow-[inset_0_0_0_1px_#fff5]">
                    <div className="absolute top-1 left-3.5 w-3 h-2.5 text-black group-hover:text-white font-sans font-bold leading-2.5">
                      x
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                margin: "6px",
                marginTop: "0",
                border: `1px solid ${WIN7_STYLES.borderColor}`,
                background: "#f0f0f0",
                boxShadow: "0 0 0 1px #fff9",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{ flex: 1, backgroundColor: "#fff", overflow: "auto" }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    );
  }

  // --------------------------------------------------
  // WINDOWS XP RENDERER (Authentic, Inline)
  // --------------------------------------------------
  if (isXP) {
    const xpTitleBg = win.focused
      ? "linear-gradient(to bottom, #0058ee 0%, #3593ff 4%, #288eff 6%, #127dff 8%, #036ffc 10%, #0262ee 14%, #0057e5 20%, #0054e3 24%, #0055eb 56%, #005bf5 66%, #026afe 76%, #0062ef 86%, #0052d6 92%, #0040ab 94%, #003092 100%)"
      : "linear-gradient(to bottom, #7697e7 0%, #7e9ee3 3%, #94afe8 6%, #97b4e9 8%, #82a5e4 14%, #7c9fe2 17%, #7996de 25%, #7b99e1 56%, #82a9e9 81%, #80a5e7 89%, #7b96e1 94%, #7a93df 97%, #abbae3 100%)";

    return (
      <Rnd
        size={size}
        position={position}
        style={{ zIndex: win.z, transition: rndTransition }}
        dragHandleClassName="window-header"
        disableDragging={win.maximized}
        enableResizing={!win.maximized}
        onDragStart={() => {
          setIsInteracting(true);
          activate();
        }}
        onResizeStart={() => {
          setIsInteracting(true);
          activate();
        }}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onMouseDown={activate}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: win.focused ? "#0831d9" : "#6582f5",
            padding: "3px",
            paddingBottom: "3px",
            borderRadius: "8px 8px 0 0",
            display: "flex",
            flexDirection: "column",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            ...getStyles(),
          }}
        >
          <div
            className="window-header"
            onDoubleClick={handleMaximizeToggle}
            style={{
              height: "30px",
              background: xpTitleBg,
              borderRadius: "5px 5px 0 0",
              display: "flex",
              alignItems: "center",
              padding: "0 5px",
              color: "white",
              textShadow: "1px 1px 1px #000",
              fontFamily: '"Tahoma", sans-serif',
              fontWeight: "bold",
              fontSize: "13px",
              overflow: "visible",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                marginRight: "4px",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
              }}
            >
              <Icons.App />
            </div>
            <div
              style={{
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                pointerEvents: "none",
              }}
            >
              {windowTitle}
            </div>
            <div style={{ display: "flex", gap: "2px" }}>
              <XPButton type="minimize" onClick={handleMinimize} />
              <XPButton
                type={win.maximized ? "restore" : "maximize"}
                onClick={handleMaximizeToggle}
              />
              <XPButton type="close" onClick={handleClose} />
            </div>
          </div>
          {/* XP Menu Bar Placeholder */}
          {menuItems && (
            <div
              className="flex items-center px-1 border-b border-[#d4d0c8]"
              style={{ backgroundColor: "#ece9d8", height: "20px" }}
            >
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  className="px-2 text-black hover:bg-[#316ac5] hover:text-white text-xs h-full flex items-center"
                  onClick={item.action}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              margin: "0",
              border: "1px solid #003092",
              borderTop: "none",
              overflow: "auto",
              position: "relative",
            }}
          >
            {children}
          </div>
        </div>
      </Rnd>
    );
  }

  // --------------------------------------------------
  // DEFAULT / WINDOWS 98 RENDERER (Classic Tailwind)
  // --------------------------------------------------
  return (
    <Rnd
      size={size}
      position={position}
      style={{ zIndex: win.z, transition: rndTransition }}
      dragHandleClassName="window-header"
      disableDragging={win.maximized}
      enableResizing={!win.maximized}
      onDragStart={() => {
        setIsInteracting(true);
        activate();
      }}
      onResizeStart={() => {
        setIsInteracting(true);
        activate();
      }}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onMouseDown={activate}
    >
      <div
        className={`w-full h-full flex flex-col box-border p-0.75 bg-(--ButtonFace) text-(--ButtonText) font-(--os-font) text-[12px]
          border-t border-l border-r border-b border-(--ButtonDkShadow) shadow-[inset_1px_1px_0_0_var(--ButtonLight),inset_-1px_-1px_0_0_var(--ButtonShadow)]
          transition-colors duration-500
          ${win.maximized ? "border-0! p-0! shadow-none!" : ""}`}
        style={getStyles()}
      >
        {/* Title Bar */}
        <div
          className={`window-header flex items-center px-0.5 min-h-4.5 font-bold tracking-wide select-none
            ${
              win.focused
                ? "bg-linear-to-r from-(--ActiveTitle) to-(--GradientActiveTitle) text-(--ActiveTitleText)"
                : "bg-linear-to-r from-(--InactiveTitle) to-(--GradientInactiveTitle) text-(--InactiveTitleText)"
            }`}
          onDoubleClick={handleMaximizeToggle}
        >
          <div className="w-4 h-4 mr-0.75 flex items-center justify-center">
            <div className="w-3 h-3 bg-white/30" />
          </div>
          <span className="flex-1 truncate pt-px">{windowTitle}</span>
          <div className="flex gap-0.5 ml-0.5">
            <ClassicButton type="minimize" onClick={handleMinimize} />
            <ClassicButton
              type="maximize"
              onClick={handleMaximizeToggle}
              isMaximized={win.maximized}
            />
            <ClassicButton type="close" onClick={handleClose} />
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex bg-(--Menu) p-[1px_0] mt-px min-h-4.5">
          {(menuItems || ["File", "Edit", "View", "Help"]).map((item) => (
            <div
              key={typeof item === "string" ? item : item.label}
              className="px-1.5 py-0.5 cursor-default text-(--MenuText) hover:bg-(--Hilight) hover:text-(--HilightText) select-none"
            >
              <span className="underline">
                {(typeof item === "string" ? item : item.label)[0]}
              </span>
              {(typeof item === "string" ? item : item.label).slice(1)}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 bg-white relative overflow-auto mt-0.5 border-t border-l border-(--ButtonShadow) border-r border-b shadow-[inset_1px_1px_0_0_var(--ButtonDkShadow),inset_-1px_-1px_0_0_var(--ButtonLight)]">
          {children}
        </div>
      </div>
    </Rnd>
  );
}
