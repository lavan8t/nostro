"use client";

import React from "react";
import { useAppContext } from "../state/AppContext";
import {
  Win7StartMenu,
  Win10StartMenu,
  WinXPStartMenu,
  WinClassicStartMenu,
} from "./start-menu/StartMenuLayouts";
import { makeWindow } from "../state/windowFactory";

export default function StartMenu() {
  const { state, dispatch } = useAppContext();

  if (!state.startMenuOpen) return null;

  const handleLaunch = (id: string) => {
    let baseId = id;
    const maxZ =
      state.windows.length > 0 ? Math.max(...state.windows.map((w) => w.z)) : 0;

    // Calculate cascading offset: 25px per existing window
    const offset = state.windows.length * 25;
    const spawnX = 100 + offset;
    const spawnY = 100 + offset;

    const newWindow = makeWindow({
      id: `${baseId}-${Date.now()}`,
      z: maxZ + 1,
      focused: true,
      x: spawnX,
      y: spawnY,
    });

    dispatch({ type: "ADD_WINDOW", payload: newWindow });
    dispatch({ type: "CLOSE_START_MENU" });
  };

  const handleShutdown = () => {
    dispatch({ type: "START_SHUTDOWN" });
  };

  switch (state.osIndex) {
    case 0:
      return (
        <WinClassicStartMenu
          handleLaunch={handleLaunch}
          handleLogout={handleShutdown}
          osIndex={0}
        />
      );
    case 1:
      return (
        <WinXPStartMenu
          handleLaunch={handleLaunch}
          handleLogout={handleShutdown}
        />
      );
    case 2:
      return (
        <Win7StartMenu
          handleLaunch={handleLaunch}
          handleLogout={handleShutdown}
        />
      );
    case 3:
      return (
        <Win10StartMenu
          handleLaunch={handleLaunch}
          handleLogout={handleShutdown}
        />
      );
    default:
      return null;
  }
}
