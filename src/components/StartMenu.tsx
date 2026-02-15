"use client";

import React from "react";
import { useAppContext } from "../state/AppContext";
import { makeWindow } from "../state/windowFactory";
import {
  WinClassicStartMenu,
  WinXPStartMenu,
  Win7StartMenu,
  Win10StartMenu,
} from "./start-menu/StartMenuLayouts";

export default function StartMenu() {
  const { state, dispatch } = useAppContext();

  if (!state.startMenuOpen) return null;

  const handleLaunch = (appId: string) => {
    const maxZ = state.windows.reduce((max, w) => Math.max(max, w.z), 0);
    const newWindow = makeWindow({
      id: `${appId}-${Date.now()}`,
      z: maxZ + 1,
      focused: true,
    });
    dispatch({ type: "ADD_WINDOW", payload: newWindow });
    dispatch({ type: "CLOSE_START_MENU" });
  };

  const index = state.osIndex;

  if (index === 3) return <Win10StartMenu handleLaunch={handleLaunch} />;
  if (index === 2) return <Win7StartMenu handleLaunch={handleLaunch} />;
  if (index === 1) return <WinXPStartMenu handleLaunch={handleLaunch} />;

  // Default / 98
  return <WinClassicStartMenu handleLaunch={handleLaunch} osIndex={index} />;
}
