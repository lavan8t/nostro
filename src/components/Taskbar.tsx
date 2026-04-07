"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAppContext, WindowState, MenuItem } from "../state/AppContext";
import StartMenu from "./StartMenu";
import Calendar from "../apps/Calendar/Calendar";
import {
  getProgramId,
  getProgramIcon,
  getTaskbarButtonStyle,
} from "../utils/TaskbarUtils";

export default function Taskbar() {
  const { state, dispatch } = useAppContext();
  const [showCalendar, setShowCalendar] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [time, setTime] = useState("");
  const scrollAccumulator = useRef(0);
  const lastSwitchTime = useRef(0);
  const localOsIndex = useRef(state.osIndex);

  useEffect(() => {
    localOsIndex.current = state.osIndex;
  }, [state.osIndex]);

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const groupedWindows = state.windows.reduce(
    (acc, win) => {
      const pId = getProgramId(win.id);
      if (!acc[pId]) acc[pId] = [];
      acc[pId].push(win);
      return acc;
    },
    {} as Record<string, WindowState[]>,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        state.startMenuOpen &&
        startButtonRef.current &&
        !startButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".start-menu-container")
      ) {
        dispatch({ type: "CLOSE_START_MENU" });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state.startMenuOpen, dispatch]);

  const handleProgramClick = (programId: string) => {
    const windows = groupedWindows[programId];
    if (!windows || windows.length === 0) return;
    const sorted = [...windows].sort((a, b) => b.z - a.z);
    const topWindow = sorted[0];

    if (topWindow.minimized) {
      dispatch({ type: "RESTORE_WINDOW", payload: topWindow.id });
    } else if (topWindow.focused) {
      if (sorted.length > 1) {
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
      dispatch({
        type: "UPDATE_WINDOW",
        payload: { id: w.id, z: index + 1, focused: w.id === id },
      });
    });
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    scrollAccumulator.current += e.deltaY;
    const SCROLL_THRESHOLD = 150;
    const TIME_DELAY = 250;
    if (Math.abs(scrollAccumulator.current) > SCROLL_THRESHOLD) {
      const now = Date.now();
      if (now - lastSwitchTime.current > TIME_DELAY) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        const totalThemes = 4;
        const current = localOsIndex.current;
        const newIndex = (current + direction + totalThemes) % totalThemes;
        if (newIndex !== current) {
          dispatch({ type: "SET_OS", payload: newIndex });
          lastSwitchTime.current = now;
          localOsIndex.current = newIndex;
        }
        scrollAccumulator.current = 0;
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (state.osIndex !== 3) return; // Only for Windows 10
    
    e.preventDefault();
    e.stopPropagation();

    const win10TaskbarItems: MenuItem[] = [
      {
        label: "Toolbars",
        disabled: true,
        submenu: [{ label: "Address", disabled: true }, { label: "Links", disabled: true }, { label: "Desktop", disabled: true }, { separator: true, label: "" }, { label: "New toolbar...", disabled: true }],
      },
      {
        label: "Search",
        disabled: true,
        submenu: [{ label: "Hidden", disabled: true }, { label: "Show search icon", disabled: true }, { label: "Show search box", disabled: true }],
      },
      { label: "Show Task View button", disabled: true },
      { label: "Show People on the taskbar", disabled: true },
      { label: "Show Windows Ink Workspace button", disabled: true },
      { label: "Show touch keyboard button", disabled: true },
      { separator: true, label: "" },
      { label: "Cascade windows", disabled: true },
      { label: "Show windows stacked", disabled: true },
      { label: "Show windows side by side", disabled: true },
      { 
        label: "Show the desktop", 
        action: () => state.windows.forEach(w => dispatch({ type: "MINIMIZE_WINDOW", payload: w.id })) 
      },
      { separator: true, label: "" },
      { label: "Task Manager", disabled: true }, 
      { separator: true, label: "" },
      { label: "✓ Lock the taskbar", disabled: true }, 
      { label: "Taskbar settings", disabled: true },
    ];

    dispatch({
      type: "OPEN_CONTEXT_MENU",
      payload: { x: e.clientX, y: e.clientY, items: win10TaskbarItems },
    });
  };

  const renderStartButton = () => {
    const index = state.osIndex;
    if (index === 0) {
      return (
        <button
          ref={startButtonRef}
          onClick={() => dispatch({ type: "TOGGLE_START_MENU" })}
          className={`px-1 h-full flex items-center gap-1 font-bold active:translate-y-px active:translate-x-px ${state.startMenuOpen ? "active" : ""} transition-all duration-300`}
          style={{
            backgroundColor: "var(--ButtonFace)",
            borderTop: "1px solid var(--ButtonHilight)",
            borderLeft: "1px solid var(--ButtonHilight)",
            borderRight: "1px solid var(--ButtonDkShadow)",
            borderBottom: "1px solid var(--ButtonDkShadow)",
            boxShadow: state.startMenuOpen
              ? "inset 1px 1px 0 0 var(--ButtonShadow)"
              : "inset -1px -1px 0 var(--ButtonShadow), inset 1px 1px 0 var(--ButtonFace)",
            color: "var(--ButtonText)",
            fontSize: "13px", // Bumped Up
            fontFamily: "var(--os-font)",
            minWidth: "60px",
          }}
        >
          <img src="/assets/win98/start.avif" alt="" className="w-4 h-4" />
          <span className="pt-px">Start</span>
        </button>
      );
    }
    if (index === 1) {
      return (
        <button
          ref={startButtonRef}
          onClick={() => dispatch({ type: "TOGGLE_START_MENU" })}
          className="h-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-transform duration-200"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <img
            src="/assets/winxp/start.avif"
            alt="Start"
            className="h-[110%] object-contain origin-left"
            style={{ marginTop: "-1px" }}
          />
        </button>
      );
    }
    if (index === 2 || index === 3) {
      const isWin7 = index === 2;
      const iconPath = isWin7
        ? "/assets/win7/start.avif"
        : "/assets/win10/start.bmp";
      return (
        <button
          ref={startButtonRef}
          onClick={() => dispatch({ type: "TOGGLE_START_MENU" })}
          className="h-full flex items-center justify-center pl-2 pr-1 hover:brightness-110 transition-transform duration-200"
        >
          <img
            src={iconPath}
            alt="Start"
            className={isWin7 ? "w-8 h-8 scale-110" : "w-8 h-8 p-1"}
          />
        </button>
      );
    }
    return null;
  };

  const taskbarHeight =
    state.osIndex === 0 || state.osIndex === 1 ? "30px" : "40px";

  const taskbarStyle: React.CSSProperties = {
    height: taskbarHeight,
    background: "var(--os-taskbar-bg)",
    borderTop: state.osIndex === 0 ? "1px solid var(--ButtonHilight)" : "none",
    boxShadow:
      state.osIndex === 0
        ? "inset 0 1px 0 var(--ButtonFace)"
        : "0 -1px 0 rgba(255,255,255,0.05)",
    color: "var(--ButtonText)",
    padding: "0",
    fontFamily: "var(--os-font)",
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center select-none z-9999 transition-all duration-500 ease-in-out"
      style={taskbarStyle}
      onContextMenu={handleContextMenu}
    >
      <div className="start-menu-container">
        <StartMenu />
      </div>
      <div className="flex-1 flex items-center h-full w-full justify-start">
        <div className="flex items-center h-full mr-1">
          {renderStartButton()}
          {state.osIndex === 0 && (
            <div className="w-0.5 h-5 mx-1 border-l border-(--ButtonShadow) border-r" />
          )}
        </div>

        <div className="flex items-center gap-1 h-full overflow-hidden">
          {Object.entries(groupedWindows).map(([programId, windows]) => {
            const isActive = windows.some((w) => w.focused && !w.minimized);
            const isRunning = windows.length > 0;
            if (!isRunning) return null;

            return (
              <button
                key={programId}
                onClick={() => handleProgramClick(programId)}
                className={`h-[80%] flex items-center px-2 gap-2 truncate transition-all duration-300 ${state.osIndex > 0 ? "hover:bg-white/10" : ""}`}
                style={getTaskbarButtonStyle(state.osIndex, isActive)}
              >
                <div className="w-4 h-4 shrink-0 text-current">
                  {getProgramIcon(programId)}
                </div>
                {state.osIndex <= 1 && (
                  <span
                    className={`truncate font-normal ${state.osIndex === 0 ? "text-[13px]" : "text-[11px]"}`}
                  >
                    {programId}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clock and Calendar Container */}
      <div className="relative flex items-center h-full ml-auto">
        
        {/* Calendar Popup */}
        {showCalendar && (
          <div className="absolute bottom-full right-0 mb-1 w-64 shadow-xl z-50">
            <Calendar winId="sys-calendar" />
          </div>
        )}

        {/* Clickable Clock Area */}
        <div
          onClick={() => setShowCalendar(!showCalendar)}
          className={`flex items-center px-2 h-full cursor-pointer hover:bg-black/5 transition-all duration-500 ${state.osIndex === 0 ? "border-l border-gray-400 inset-shadow" : ""}`}
          onWheel={handleScroll}
          title="Click to toggle Calendar | Scroll to switch OS"
          style={
            state.osIndex === 0
              ? {
                  borderTop: "1px solid var(--ButtonShadow)",
                  borderLeft: "1px solid var(--ButtonShadow)",
                  borderRight: "1px solid var(--ButtonHilight)",
                  borderBottom: "1px solid var(--ButtonHilight)",
                  boxShadow:
                    "inset 1px 1px 0 var(--ButtonDkShadow), inset -1px -1px 0 var(--ButtonLight)",
                  backgroundColor: "var(--ButtonFace)",
                  minWidth: "80px",
                  justifyContent: "center",
                }
              : {
                  minWidth: "80px",
                  justifyContent: "center",
                  color: "white",
                }
          }
        >
          <span
            className={
              state.osIndex === 0
                ? "text-[13px] font-normal"
                : "text-xs font-normal"
            }
            style={{ fontFamily: "var(--os-font)" }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

