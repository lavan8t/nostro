"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../state/AppContext";
import { osThemes, ThemeTokens } from "../themes/osThemes";

export default function ThemeCrossfade() {
  const { state } = useAppContext();

  // Track previous index to determine when to trigger animation
  const prevOsIndexRef = useRef<number>(state.osIndex);

  // State to manage the transition lifecycle
  const [animating, setAnimating] = useState(false);
  const [indices, setIndices] = useState<{ prev: number; next: number } | null>(
    null,
  );
  const [triggerFade, setTriggerFade] = useState(false);

  // Helper to safely extract tokens (defaulting to Dark for Win10/Dual themes)
  const getTokens = (index: number): ThemeTokens => {
    const theme = osThemes[index] || osThemes[3];
    if ("light" in theme && "dark" in theme) {
      return theme.dark.tokens;
    }
    // @ts-ignore - We know it's a SingleTheme if not Dual
    return theme.tokens;
  };

  useEffect(() => {
    if (prevOsIndexRef.current !== state.osIndex) {
      const fromIndex = prevOsIndexRef.current;
      const toIndex = state.osIndex;

      // 1. Prepare animation state
      setIndices({ prev: fromIndex, next: toIndex });
      setAnimating(true);
      setTriggerFade(false); // Reset fade trigger

      // 2. Trigger the CSS transition (next tick)
      const raf = requestAnimationFrame(() => {
        setTriggerFade(true);
      });

      // 3. Cleanup after transition completes (600ms)
      const timer = setTimeout(() => {
        setAnimating(false);
        setIndices(null);
        setTriggerFade(false);
      }, 600);

      // Update ref
      prevOsIndexRef.current = state.osIndex;

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [state.osIndex]);

  if (!animating || !indices) return null;

  const prevTokens = getTokens(indices.prev);
  const nextTokens = getTokens(indices.next);

  // Helper to generate inline CSS variables for a specific theme
  const getStyleVars = (tokens: ThemeTokens) =>
    ({
      "--os-bg": tokens.bg,
      "--os-text": tokens.text,
      "--os-taskbar-bg": tokens.taskbarBg,
      "--os-accent": tokens.accent,
      "--os-window-border": tokens.windowBorder,
    }) as React.CSSProperties;

  return (
    <div className="absolute top-0 left-0 right-0 bottom-[40px] pointer-events-none overflow-hidden z-0">
      {/* Previous Theme Overlay: 1 -> 0 */}
      <div
        className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out ${
          triggerFade ? "opacity-0" : "opacity-100"
        }`}
        style={{
          ...getStyleVars(prevTokens),
          backgroundColor: "var(--os-bg)",
          color: "var(--os-text)",
        }}
      />

      {/* New Theme Overlay: 0 -> 1 */}
      <div
        className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
          triggerFade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          ...getStyleVars(nextTokens),
          backgroundColor: "var(--os-bg)",
          color: "var(--os-text)",
        }}
      />
    </div>
  );
}
