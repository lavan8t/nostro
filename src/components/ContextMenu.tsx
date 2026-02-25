"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppContext, MenuItem } from "../state/AppContext";

// --------------------------------------------------
// SHARED LOGIC
// --------------------------------------------------

const useMenuLogic = (item: MenuItem, dispatch: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.disabled || item.submenu) return;
    if (item.action) item.action();
    dispatch({ type: "CLOSE_CONTEXT_MENU" });
  };
  return { isHovered, setIsHovered, handleClick };
};

// --------------------------------------------------
// 1. WINDOWS 98 (Classic)
// --------------------------------------------------

const Win98Item = ({ item, dispatch }: { item: MenuItem; dispatch: any }) => {
  const { isHovered, setIsHovered, handleClick } = useMenuLogic(item, dispatch);

  if (item.separator) {
    return (
      <div className="h-[2px] my-[1px] border-t border-[var(--ButtonShadow)] border-b border-[var(--ButtonHilight)]" />
    );
  }

  const isActive = isHovered && !item.disabled;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="flex items-center px-4 py-[1px] cursor-default select-none"
      style={{
        backgroundColor: isActive ? "var(--Hilight)" : "transparent",
        color: isActive ? "var(--HilightText)" : "var(--MenuText)",
        fontFamily: "var(--os-font)",
        fontSize: "11px",
      }}
    >
      {/* Label */}
      <span
        className="flex-1"
        style={
          item.disabled
            ? {
              color: "var(--GrayText)",
              textShadow: "1px 1px 0 var(--ButtonHilight)",
            }
            : {}
        }
      >
        {item.label}
      </span>

      {/* Shortcut */}
      {item.shortcut && (
        <span
          className="ml-4"
          style={
            item.disabled
              ? {
                color: "var(--GrayText)",
                textShadow: "1px 1px 0 var(--ButtonHilight)",
              }
              : {}
          }
        >
          {item.shortcut}
        </span>
      )}

      {/* Arrow */}
      {item.submenu && (
        <div className="ml-2">
          <svg
            width="4"
            height="7"
            viewBox="0 0 4 7"
            fill={
              item.disabled
                ? "var(--GrayText)"
                : isActive
                  ? "var(--HilightText)"
                  : "var(--MenuText)"
            }
          >
            <path d="M0 0 L4 3.5 L0 7 Z" />
          </svg>
        </div>
      )}

      {/* Nested Menu */}
      {item.submenu && isHovered && (
        <div className="absolute left-full top-[-3px] ml-[-3px]">
          <SubMenu items={item.submenu} osIndex={0} />
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// 2. WINDOWS XP
// --------------------------------------------------

const WinXPItem = ({ item, dispatch }: { item: MenuItem; dispatch: any }) => {
  const { isHovered, setIsHovered, handleClick } = useMenuLogic(item, dispatch);

  if (item.separator) {
    return (
      <div className="flex my-[1px]">
        <div className="w-[28px] shrink-0 bg-[#ECE9D8]" /> {/* Gutter skip */}
        <div className="flex-1 h-[1px] bg-[#aca899] mr-1" />
      </div>
    );
  }

  const isActive = isHovered && !item.disabled;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="flex items-center pr-2 py-[1px] cursor-default select-none relative"
      style={{
        backgroundColor: isActive ? "#316AC5" : "transparent",
        color: isActive ? "white" : "black",
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
        border: isActive ? "1px solid #316AC5" : "1px solid transparent",
      }}
    >
      {/* Gutter Icon Area (Transparent over global gutter) */}
      <div className="w-[26px] shrink-0 flex items-center justify-center">
        { }
      </div>

      <span
        className="flex-1 px-1"
        style={item.disabled ? { color: "#8d8d8d" } : {}}
      >
        {item.label}
      </span>

      {item.shortcut && (
        <span
          className="ml-4 text-[10px]"
          style={item.disabled ? { color: "#8d8d8d" } : {}}
        >
          {item.shortcut}
        </span>
      )}

      {item.submenu && (
        <div className="ml-2">
          <svg
            width="4"
            height="7"
            viewBox="0 0 4 7"
            fill={item.disabled ? "#8d8d8d" : isActive ? "white" : "black"}
          >
            <path d="M0 0 L4 3.5 L0 7 Z" />
          </svg>
        </div>
      )}

      {item.submenu && isHovered && (
        <div className="absolute left-full top-[-1px] ml-[-2px]">
          <SubMenu items={item.submenu} osIndex={1} />
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// 3. WINDOWS 7
// --------------------------------------------------

const Win7Item = ({ item, dispatch }: { item: MenuItem; dispatch: any }) => {
  const { isHovered, setIsHovered, handleClick } = useMenuLogic(item, dispatch);

  if (item.separator) {
    return (
      <div className="my-[3px] h-[2px] relative">
        <div className="absolute left-[34px] right-1 top-0 h-[1px] bg-[#e0e0e0]" />
        <div className="absolute left-[34px] right-1 top-[1px] h-[1px] bg-white" />
      </div>
    );
  }

  const isActive = isHovered && !item.disabled;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="flex items-center px-1 py-[3px] cursor-default select-none mx-[2px] rounded-[2px] relative"
      style={{
        background: isActive
          ? "linear-gradient(to bottom, #eaf6fd 0%, #d9f0fc 100%)"
          : "transparent",
        border: isActive ? "1px solid #7da2ce" : "1px solid transparent",
        boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.5)" : "none",
        color: item.disabled ? "#8d8d8d" : "black",
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: "12px",
      }}
    >
      {/* Icon Area */}
      <div className="w-[28px] shrink-0 flex items-center justify-center">
        {/* Icon */}
      </div>

      <span className="flex-1">{item.label}</span>
      {item.shortcut && (
        <span className="ml-4 text-gray-500">{item.shortcut}</span>
      )}

      {item.submenu && (
        <div className="ml-2 mr-1">
          <svg width="4" height="7" viewBox="0 0 4 7" fill="currentColor">
            <path d="M0 0 L4 3.5 L0 7 Z" />
          </svg>
        </div>
      )}

      {item.submenu && isHovered && (
        <div className="absolute left-full top-[-4px] ml-[-1px]">
          <SubMenu items={item.submenu} osIndex={2} />
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// 4. WINDOWS 10  (Modern)
// --------------------------------------------------

const Win10Item = ({ item, dispatch }: { item: MenuItem; dispatch: any }) => {
  const { isHovered, setIsHovered, handleClick } = useMenuLogic(item, dispatch);

  if (item.separator) {
    return <div className="h-[1px] bg-[#454545] my-[4px] mx-1" />;
  }

  const isActive = isHovered && !item.disabled;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="flex items-center px-2 py-[4px] cursor-default select-none relative"
      style={{
        backgroundColor: isActive ? "#3a3a3a" : "transparent",
        color: item.disabled ? "#666" : "white",
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: "13px",
      }}
    >
      <div className="w-[32px] shrink-0" /> {/* Icon Placeholder */}
      <span className="flex-1">{item.label}</span>
      {item.shortcut && (
        <span className="ml-4 opacity-60 text-xs">{item.shortcut}</span>
      )}
      {item.submenu && (
        <div className="ml-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </div>
      )}
      {item.submenu && isHovered && (
        <div className="absolute left-full top-[-4px] ml-[0px]">
          <SubMenu items={item.submenu} osIndex={3} />
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// SUBMENU CONTAINER
// --------------------------------------------------

const SubMenu = ({
  items,
  osIndex,
}: {
  items: MenuItem[];
  osIndex: number;
}) => {
  const { dispatch } = useAppContext();

  // WIN 98
  if (osIndex === 0) {
    return (
      <div
        className="min-w-[150px] p-[2px] z-[99999]"
        style={{
          backgroundColor: "var(--ButtonFace)",
          borderTop: "1px solid var(--ButtonHilight)",
          borderLeft: "1px solid var(--ButtonHilight)",
          borderRight: "1px solid var(--ButtonDkShadow)",
          borderBottom: "1px solid var(--ButtonDkShadow)",
          boxShadow:
            "inset -1px -1px 0 var(--ButtonShadow), inset 1px 1px 0 var(--ButtonLight)",
        }}
      >
        {items.map((item, idx) => (
          <Win98Item key={idx} item={item} dispatch={dispatch} />
        ))}
      </div>
    );
  }

  // WIN XP
  if (osIndex === 1) {
    return (
      <div
        className="min-w-[150px] p-[2px] z-[99999] bg-white relative"
        style={{
          border: "1px solid #999",
          boxShadow: "4px 4px 3px rgba(0,0,0,0.2)",
        }}
      >
        {/* XP Gutter */}
        <div className="absolute left-[2px] top-[2px] bottom-[2px] w-[26px] bg-[#ECE9D8] z-0 pointer-events-none" />
        <div className="relative z-10">
          {items.map((item, idx) => (
            <WinXPItem key={idx} item={item} dispatch={dispatch} />
          ))}
        </div>
      </div>
    );
  }

  // WIN 7
  if (osIndex === 2) {
    return (
      <div
        className="min-w-[150px] p-[2px] z-[99999] bg-[#F0F0F0] relative"
        style={{
          border: "1px solid #979797",
          boxShadow: "4px 4px 5px rgba(0,0,0,0.2)",
        }}
      >
        {/* Win7 Gutter */}
        <div className="absolute left-0 top-0 bottom-0 w-[34px] border-r border-[#e2e3e3] bg-[#f0f0f0] z-0 pointer-events-none" />
        <div className="relative z-10">
          {items.map((item, idx) => (
            <Win7Item key={idx} item={item} dispatch={dispatch} />
          ))}
        </div>
      </div>
    );
  }

  // WIN 10/11
  return (
    <div
      className="min-w-[200px] py-[4px] z-[99999] flex flex-col"
      style={{
        backgroundColor: "#2b2b2b", // Dark Acrylic-ish
        border: "1px solid #1f1f1f",
        boxShadow: "0 8px 16px rgba(0,0,0,0.35)",
        backdropFilter: "blur(20px)",
      }}
    >
      {items.map((item, idx) => (
        <Win10Item key={idx} item={item} dispatch={dispatch} />
      ))}
    </div>
  );
};

// --------------------------------------------------
// MAIN EXPORT
// --------------------------------------------------

export default function ContextMenu() {
  const { state, dispatch } = useAppContext();
  const { contextMenu, osIndex } = state;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenu.isOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        dispatch({ type: "CLOSE_CONTEXT_MENU" });
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu.isOpen, dispatch]);

  if (!contextMenu.isOpen) return null;

  return (
    <div
      ref={ref}
      className="fixed z-[99999]"
      style={{ left: contextMenu.x, top: contextMenu.y }}
    >
      <SubMenu items={contextMenu.items} osIndex={osIndex} />
    </div>
  );
}
