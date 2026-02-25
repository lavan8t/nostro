"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../state/AppContext";
import { osThemes, ThemeTokens } from "../themes/osThemes";

export default function ThemeCrossfade() {
  const { state } = useAppContext();


  const [currentLayerIndex, setCurrentLayerIndex] = useState(state.osIndex);
  const [nextLayerIndex, setNextLayerIndex] = useState<number | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {

    if (state.osIndex !== currentLayerIndex) {


      setNextLayerIndex(state.osIndex);


      const raf = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setOpacity(1);
        });
      });

      const timeout = setTimeout(() => {

        setCurrentLayerIndex(state.osIndex);
        setNextLayerIndex(null);
        setOpacity(0);
      }, 600);

      return () => {
        clearTimeout(timeout);

      };
    }
  }, [state.osIndex, currentLayerIndex]);

  const getWallpaper = (index: number | null) => {
    if (index === null) return "none";
    const safeIndex = osThemes[index] ? index : 3;
    const theme = osThemes[safeIndex];

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
