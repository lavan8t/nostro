"use client";

import React, { useState, useEffect } from "react";
import { useAppContext, DesktopIconState, MenuItem } from "../state/AppContext";

// --------------------------------------------------
// HELPER: Crossfade Text
// --------------------------------------------------

const CrossfadeText = ({ text }: { text: string }) => {
  const [displayTexts, setDisplayTexts] = useState<{
    current: string;
    prev: string | null;
  }>({
    current: text,
    prev: null,
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (text !== displayTexts.current) {
      setDisplayTexts((d) => ({ current: text, prev: d.current }));
      setFading(true);

      const timer = setTimeout(() => {
        setFading(false);
        setDisplayTexts({ current: text, prev: null });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <div className="relative h-[1.2em] w-full text-center">
      {displayTexts.prev && (
        <span
          className="absolute top-0 left-0 right-0 transition-opacity duration-300 ease-in-out"
          style={{ opacity: fading ? 0 : 0 }}
        >
          {displayTexts.prev}
        </span>
      )}
      <span
        className="absolute top-0 left-0 right-0 transition-opacity duration-300 ease-in-out"
        style={{ opacity: fading ? 0 : 1 }}
      >
        {displayTexts.current}
      </span>
    </div>
  );
};

// --------------------------------------------------
// HELPER: Crossfade Image
// --------------------------------------------------

const CrossfadeImage = ({ src, alt }: { src: string; alt: string }) => {
  const [layers, setLayers] = useState<{
    current: string;
    prev: string | null;
  }>({ current: src, prev: null });
  const [showNext, setShowNext] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src !== layers.current) {
      setLayers((l) => ({ current: src, prev: l.current }));
      setShowNext(false);
      setHasError(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowNext(true);
        });
      });
      const timer = setTimeout(() => {
        setLayers({ current: src, prev: null });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [src]);

  return (
    <div className="relative w-8 h-8">
      {layers.prev && (
        <img
          src={layers.prev}
          alt=""
          className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500"
          style={{ opacity: showNext ? 0 : 1 }}
          draggable={false}
        />
      )}
      {!hasError && src ? (
        <img
          src={layers.current}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500"
          style={{ opacity: showNext ? 1 : 0 }}
          draggable={false}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-sm bg-gray-400/40 transition-opacity duration-500"
          style={{ opacity: showNext ? 1 : 0 }}
        >
          <div className="w-3 h-3 bg-white/40 rounded-sm" />
        </div>
      )}
    </div>
  );
};

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);

  // OS Config
  const osIndex = state.osIndex;
  const isClassic = osIndex <= 1;

  // Determine Label & Type
  const iconType = icon.type || icon.id;
  let label = icon.label || "Icon";
  if (iconType === "computer") {
    if (osIndex === 0 || osIndex === 1) label = "My Computer";
    else if (osIndex === 2) label = "Computer";
    else label = "This PC";
  } else if (iconType === "recycle") {
    label = "Recycle Bin";
  }

  // Determine Icon Path
  let iconPath = "";
  const osDir = ["win98", "winxp", "win7", "win10"][state.osIndex] || "win10";

  if (iconType === "computer") {
    iconPath = `/assets/${osDir}/icons/computer.png`;
  } else if (iconType === "recycle") {
    const status = state.recycleBinFilled ? "full" : "empty";
    iconPath = `/assets/${osDir}/icons/recycle_bin_${status}.png`;
  } else if (iconType === "folder") {
    iconPath = `/assets/${osDir}/icons/folder.png`;
  } else if (iconType === "text") {
    iconPath = `/assets/${osDir}/icons/text.png`;
  } else if (iconType === "shortcut") {
    iconPath = `/assets/${osDir}/icons/shortcut.png`;
  } else if (iconType === "bitmap") {
    iconPath = `/assets/${osDir}/icons/bitmap.png`;
  }

  // Grid Logic
  const GRID_SIZE_X = 75;
  const GRID_SIZE_Y = 100;

  // Calculate Position
  let posX = icon.x;
  let posY = icon.y;

  if (state.autoArrange) {
    const col = Math.floor(index / 6);
    const row = index % 6;
    posX = 10 + col * GRID_SIZE_X;
    posY = 10 + row * GRID_SIZE_Y;
  }

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsSelected(true);

    if (!state.autoArrange) {
      setIsDragging(true);
      setDragOffset({ x: e.clientX - posX, y: e.clientY - posY });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        dispatch({
          type: "UPDATE_ICON_POS",
          payload: {
            id: icon.id,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, dispatch, icon.id]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items: MenuItem[] = [
      { label: "Open", action: () => alert(`Opening ${label}...`) },
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

    if (iconType !== "computer" && iconType !== "recycle") {
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

  const textStyle: React.CSSProperties = isClassic
    ? { color: "white" }
    : { color: "white", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" };

  return (
    <div
      className={`absolute flex flex-col items-center justify-start p-1 w-17.5 select-none cursor-default group`}
      style={{ left: posX, top: posY, opacity: isDragging ? 0.7 : 1 }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => alert(`Opening ${label}...`)}
    >
      <div className={`mb-1 relative ${isSelected ? "opacity-80" : ""}`}>
        <CrossfadeImage src={iconPath} alt={label} />
      </div>
      <div
        className={`text-[11px] text-center leading-tight px-1 rounded-sm ${
          isSelected
            ? isClassic
              ? "bg-[#000080] text-white"
              : "bg-[#316ac5] bg-opacity-60 text-white"
            : ""
        }`}
        style={!isSelected ? textStyle : {}}
      >
        <CrossfadeText text={label} />
      </div>
    </div>
  );
}
