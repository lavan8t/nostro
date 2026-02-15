"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../state/AppContext";
import { osThemes, ThemeTokens } from "../themes/osThemes";

export default function ThemeCrossfade() {
  const { state } = useAppContext();

  // State to manage the visual layers
  // We deliberately do NOT sync this with state.osIndex immediately to allow animation
  const [currentLayerIndex, setCurrentLayerIndex] = useState(state.osIndex);
  const [nextLayerIndex, setNextLayerIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(0); // 0 means current is visible, 1 means next is visible

  useEffect(() => {
    // If the requested OS index is different from what we are currently showing...
    if (state.osIndex !== currentLayerIndex) {
      // If we are already animating to a target, and the target changes,
      // we ideally want to just jump to the new target or finish the old one.
      // Simplified robust approach:
      // 1. Set the 'Next' layer to the new target.
      // 2. Fade it in.
      // 3. When done, swap 'Next' to 'Current' and reset.

      setNextLayerIndex(state.osIndex);

      // Small timeout to ensure DOM has rendered the new background image in the 'next' div
      // before we start fading opacity.
      const raf = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setOpacity(1);
        });
      });

      const timeout = setTimeout(() => {
        // Animation Complete
        setCurrentLayerIndex(state.osIndex);
        setNextLayerIndex(null);
        setOpacity(0);
      }, 600); // Matches duration-600

      return () => {
        clearTimeout(timeout);
        // We do NOT cancel the animation frame logic aggressively to avoid stutter
      };
    }
  }, [state.osIndex, currentLayerIndex]);

  const getWallpaper = (index: number | null) => {
    if (index === null) return "none";
    const safeIndex = osThemes[index] ? index : 3;
    const theme = osThemes[safeIndex];
    // Handle dual/single theme structure
    const tokens =
      "light" in theme && "dark" in theme
        ? theme.dark.tokens
        : (theme as any).tokens;
    return tokens.wallpaper;
  };

  const layerStyle: React.CSSProperties = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    willChange: "opacity",
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden z-0">
      {/* Bottom Layer (Current) */}
      <div
        style={{
          ...layerStyle,
          backgroundImage: getWallpaper(currentLayerIndex),
          zIndex: 1,
        }}
      />

      {/* Top Layer (Next) - Fades In */}
      {nextLayerIndex !== null && (
        <div
          className="transition-opacity duration-600 ease-in-out"
          style={{
            ...layerStyle,
            backgroundImage: getWallpaper(nextLayerIndex),
            opacity: opacity,
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
