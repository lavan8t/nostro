"use client";

import React, { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { useAppContext, WindowState } from "../state/AppContext";
import styles from "./WindowFrame.module.css";

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
// COMPONENT
// --------------------------------------------------

export default function WindowFrame({
  win,
  onSnapHover,
  viewportSize,
}: {
  win: WindowState;
  onSnapHover: (rect: SnapRect | null) => void;
  viewportSize: { width: number; height: number };
}) {
  const { state, dispatch } = useAppContext();
  const { width: vw, height: vh } = viewportSize;

  // Animation state
  const [animState, setAnimState] = useState<
    "entering" | "visible" | "exiting" | "closing"
  >("entering");

  // Interaction state
  const [isInteracting, setIsInteracting] = useState(false);

  // Refs
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const rafRef1 = useRef<number | null>(null);
  const rafRef2 = useRef<number | null>(null);
  const snapTypeRef = useRef<SnapType>(null);

  // Check if current theme is Windows 7 (Index 2)
  const isWin7 = state.osIndex === 2;

  // Mount animation
  useEffect(() => {
    setAnimState("entering");
    rafRef1.current = requestAnimationFrame(() => {
      rafRef2.current = requestAnimationFrame(() => {
        setAnimState("visible");
      });
    });

    return () => {
      if (rafRef1.current) cancelAnimationFrame(rafRef1.current);
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  // Focus Logic
  const handleFocus = () => {
    const sortedWindows = [...state.windows].sort((a, b) => a.z - b.z);
    const others = sortedWindows.filter((w) => w.id !== win.id);
    const newOrder = [...others, win];

    newOrder.forEach((w, index) => {
      const newZ = index + 1;
      const shouldBeFocused = w.id === win.id;

      if (w.z !== newZ || w.focused !== shouldBeFocused) {
        dispatch({
          type: "UPDATE_WINDOW",
          payload: { id: w.id, z: newZ, focused: shouldBeFocused },
        });
      }
    });
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
    if (win.maximized) {
      dispatch({ type: "UNMAXIMIZE_WINDOW", payload: win.id });
    } else {
      dispatch({ type: "MAXIMIZE_WINDOW", payload: win.id });
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    setAnimState("closing");
    animationTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "REMOVE_WINDOW", payload: win.id });
    }, 300);
  };

  const handleDragStart = () => {
    setIsInteracting(true);
    handleFocus();
  };

  const handleResizeStart = () => {
    setIsInteracting(true);
    handleFocus();
  };

  const handleDrag = (e: any, d: any) => {
    // Maximize pull-down
    if (win.maximized) {
      if (d.y > 20) {
        const restoredWidth = win.width;
        const mouseX = e.clientX;
        let newX = mouseX - restoredWidth / 2;
        const minX = -(restoredWidth - 10);
        const maxX = vw - 10;
        newX = Math.max(minX, Math.min(newX, maxX));

        dispatch({ type: "UNMAXIMIZE_WINDOW", payload: win.id });
        dispatch({
          type: "UPDATE_WINDOW",
          payload: { id: win.id, x: newX, y: d.y, focused: true },
        });
      }
      return;
    }

    // Snap Detection
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const EDGE_THRESHOLD = 20;
    const TOP_THRESHOLD = 10;
    const BOTTOM_THRESHOLD = 20;
    const taskbarHeight = 40;
    const workHeight = vh - taskbarHeight;

    let newSnapType: SnapType = null;
    let previewRect: SnapRect | null = null;

    if (mouseY < TOP_THRESHOLD) {
      if (mouseX < EDGE_THRESHOLD) {
        newSnapType = "top-left";
        previewRect = { x: 0, y: 0, width: vw / 2, height: workHeight / 2 };
      } else if (mouseX > vw - EDGE_THRESHOLD) {
        newSnapType = "top-right";
        previewRect = {
          x: vw / 2,
          y: 0,
          width: vw / 2,
          height: workHeight / 2,
        };
      } else {
        newSnapType = "top";
        previewRect = { x: 0, y: 0, width: vw, height: workHeight };
      }
    } else if (mouseY > workHeight - BOTTOM_THRESHOLD) {
      if (mouseX < EDGE_THRESHOLD) {
        newSnapType = "bottom-left";
        previewRect = {
          x: 0,
          y: workHeight / 2,
          width: vw / 2,
          height: workHeight / 2,
        };
      } else if (mouseX > vw - EDGE_THRESHOLD) {
        newSnapType = "bottom-right";
        previewRect = {
          x: vw / 2,
          y: workHeight / 2,
          width: vw / 2,
          height: workHeight / 2,
        };
      }
    } else {
      if (mouseX < EDGE_THRESHOLD) {
        newSnapType = "left";
        previewRect = { x: 0, y: 0, width: vw / 2, height: workHeight };
      } else if (mouseX > vw - EDGE_THRESHOLD) {
        newSnapType = "right";
        previewRect = { x: vw / 2, y: 0, width: vw / 2, height: workHeight };
      }
    }

    if (snapTypeRef.current !== newSnapType) {
      snapTypeRef.current = newSnapType;
      onSnapHover(previewRect);
    }
  };

  const handleDragStop = (e: any, d: any) => {
    setIsInteracting(false);

    const currentSnap = snapTypeRef.current;
    const taskbarHeight = 40;
    const workHeight = vh - taskbarHeight;
    const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);

    if (currentSnap) {
      if (currentSnap === "top") {
        dispatch({ type: "MAXIMIZE_WINDOW", payload: win.id });
      } else {
        let targetRect = { x: 0, y: 0, width: 0, height: 0 };
        switch (currentSnap) {
          case "left":
            targetRect = { x: 0, y: 0, width: vw / 2, height: workHeight };
            break;
          case "right":
            targetRect = { x: vw / 2, y: 0, width: vw / 2, height: workHeight };
            break;
          case "top-left":
            targetRect = { x: 0, y: 0, width: vw / 2, height: workHeight / 2 };
            break;
          case "top-right":
            targetRect = {
              x: vw / 2,
              y: 0,
              width: vw / 2,
              height: workHeight / 2,
            };
            break;
          case "bottom-left":
            targetRect = {
              x: 0,
              y: workHeight / 2,
              width: vw / 2,
              height: workHeight / 2,
            };
            break;
          case "bottom-right":
            targetRect = {
              x: vw / 2,
              y: workHeight / 2,
              width: vw / 2,
              height: workHeight / 2,
            };
            break;
        }

        dispatch({
          type: "UPDATE_WINDOW",
          payload: {
            id: win.id,
            ...targetRect,
            maximized: false,
            focused: true,
            z: maxZ + 1,
          },
        });
      }
    } else {
      const minX = -(win.width - 10);
      const maxX = vw - 10;
      const minY = 0;
      const maxY = workHeight - 10;
      const clampedX = Math.max(minX, Math.min(d.x, maxX));
      const clampedY = Math.max(minY, Math.min(d.y, maxY));

      dispatch({
        type: "UPDATE_WINDOW",
        payload: { id: win.id, x: clampedX, y: clampedY },
      });
    }

    snapTypeRef.current = null;
    onSnapHover(null);
  };

  // Styles
  const dropDistance = vh - win.y;

  const getInnerStyles = (): React.CSSProperties => {
    const baseTransition =
      "transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease-in-out";
    const focusScale = win.focused && !win.maximized ? "scale(1)" : "scale(1)"; // Identity scale

    switch (animState) {
      case "entering":
        return {
          opacity: 0,
          transform: `scale(0.8) translateY(${dropDistance * 0.2}px)`,
          transition: baseTransition,
        };
      case "visible":
        return {
          opacity: 1,
          transform: `${focusScale} translateY(0)`,
          transition: baseTransition,
        };
      case "exiting":
        return {
          opacity: 0,
          transform: `scale(0.6) translateY(${dropDistance * 0.5}px)`,
          transformOrigin: "bottom center",
          transition: baseTransition,
        };
      case "closing":
        return {
          opacity: 0,
          transform: "scale(0.9)",
          transition: "transform 200ms ease-out, opacity 200ms ease-out",
        };
    }
  };

  const rndTransition = isInteracting
    ? "none"
    : "transform 200ms ease-in-out, width 200ms ease-in-out, height 200ms ease-in-out";

  const position = win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y };
  const size = win.maximized
    ? { width: vw, height: Math.max(0, vh - 40) }
    : { width: win.width, height: win.height };

  // Windows 7 Rendering
  if (isWin7) {
    return (
      <Rnd
        size={size}
        position={position}
        style={{ zIndex: win.z, transition: rndTransition }}
        // Use "title-bar" as the handle class for 7.css, but alias to "window-header" to match logic
        dragHandleClassName="window-header"
        disableDragging={false}
        enableResizing={!win.maximized}
        onDragStart={handleDragStart}
        onResizeStart={handleResizeStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStop={(e, direction, ref, delta, position) => {
          setIsInteracting(false);
          if (!win.maximized) {
            dispatch({
              type: "UPDATE_WINDOW",
              payload: {
                id: win.id,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              },
            });
          }
        }}
        onMouseDown={handleFocus}
      >
        <div className="win7" style={{ width: "100%", height: "100%" }}>
          <div
            className={`window ${win.focused ? "active" : ""}`}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              ...getInnerStyles(),
            }}
          >
            <div
              className="title-bar window-header" // "window-header" for drag handle
              onDoubleClick={handleMaximizeToggle}
            >
              <div className="title-bar-text">{win.id}</div>
              <div className="title-bar-controls">
                <button
                  aria-label="Minimize"
                  onClick={handleMinimize}
                  onMouseDown={(e) => e.stopPropagation()}
                ></button>
                <button
                  aria-label={win.maximized ? "Restore" : "Maximize"}
                  onClick={handleMaximizeToggle}
                  onMouseDown={(e) => e.stopPropagation()}
                ></button>
                <button
                  aria-label="Close"
                  onClick={handleClose}
                  onMouseDown={(e) => e.stopPropagation()}
                ></button>
              </div>
            </div>

            {/* 7.css window-body normally expects P tag, we force it to act as container */}
            <div
              className="window-body"
              style={{
                flex: 1,
                margin: 0,
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{ flex: 1, backgroundColor: "#fff", overflow: "auto" }}
              >
                {/* Content */}
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    );
  }

  // Default / Windows 98 Rendering
  return (
    <Rnd
      size={size}
      position={position}
      style={{ zIndex: win.z, transition: rndTransition }}
      dragHandleClassName="window-header"
      disableDragging={false}
      enableResizing={!win.maximized}
      onDragStart={handleDragStart}
      onResizeStart={handleResizeStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={(e, direction, ref, delta, position) => {
        setIsInteracting(false);
        if (!win.maximized) {
          dispatch({
            type: "UPDATE_WINDOW",
            payload: {
              id: win.id,
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position,
            },
          });
        }
      }}
      onMouseDown={handleFocus}
    >
      <div
        className={`${styles.window} ${win.maximized ? styles.maximized : ""}`}
        style={getInnerStyles()}
      >
        <div
          className={`window-header ${styles.titleBar} ${!win.focused ? styles.titleBarInactive : ""}`}
          onDoubleClick={handleMaximizeToggle}
        >
          {/* Icon */}
          <div className={styles.titleIcon}>
            <div className="w-3 h-3 bg-white/30" />
          </div>

          <span className={styles.titleText}>{win.id}</span>

          <div className={styles.controls}>
            <button
              onClick={handleMinimize}
              className={styles.button}
              aria-label="Minimize"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className={`${styles.icon} ${styles.iconMinimize}`} />
            </button>
            <button
              onClick={handleMaximizeToggle}
              className={styles.button}
              aria-label="Maximize"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                className={`${styles.icon} ${win.maximized ? styles.iconRestore : styles.iconMaximize}`}
              />
            </button>
            <button
              onClick={handleClose}
              className={styles.button}
              aria-label="Close"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className={`${styles.icon} ${styles.iconClose}`} />
            </button>
          </div>
        </div>

        <div className={styles.menuBar}>
          <div className={styles.menuItem}>
            <span className={styles.hotkey}>F</span>ile
          </div>
          <div className={styles.menuItem}>
            <span className={styles.hotkey}>E</span>dit
          </div>
          <div className={styles.menuItem}>
            <span className={styles.hotkey}>V</span>iew
          </div>
          <div className={styles.menuItem}>
            <span className={styles.hotkey}>H</span>elp
          </div>
        </div>

        <div className={styles.content}>
          {/* Content will be injected here later */}
        </div>
      </div>
    </Rnd>
  );
}
