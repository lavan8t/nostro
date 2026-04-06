"use client";

import React, { useState, useEffect } from "react";
import BiosSplash from "./BiosSplash";
import OsSelectScreen from "./OsSelectScreen";
import LockScreenManager from "../lockscreen/LockScreenManager";
import ShutdownScreen from "./ShutdownScreen";
import { useAppContext } from "../../state/AppContext";
import Desktop from "../Desktop";

export default function BootManager() {
  const { state, dispatch } = useAppContext();
  const [bootState, setBootState] = useState<
    "splash" | "select" | "login" | "booted"
  >("splash");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedBoot = localStorage.getItem("nostro_booted");
    const storedLogin = localStorage.getItem("nostro_logged_in");
    const storedOS = localStorage.getItem("nostro_selected_os");

    // ALWAYS initialize the global OS state to the last booted one,
    // ensuring the "D" shortcut has the right default even before boot.
    if (storedOS) {
      dispatch({ type: "SET_OS", payload: parseInt(storedOS, 10) });
    }

    if (storedBoot === "true" && storedLogin === "true") {
      dispatch({ type: "BOOT_OS" });
      dispatch({ type: "LOG_IN" });
      setBootState("booted");
    } else {
      setBootState("splash");
    }
  }, [dispatch]);

  useEffect(() => {
    if (state.shutdownState === "shutting_down") {
      localStorage.setItem("nostro_logged_in", "false");
      localStorage.setItem("nostro_booted", "false");
    }
  }, [state.shutdownState]);

  useEffect(() => {
    if (state.shutdownState === "powered_off") {
      const handlePowerOn = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          dispatch({ type: "POWER_ON" });
          setBootState("splash");
        }
      };
      window.addEventListener("keydown", handlePowerOn);
      return () => window.removeEventListener("keydown", handlePowerOn);
    }
  }, [state.shutdownState, dispatch]);

  useEffect(() => {
    if (bootState === "booted" || state.shutdownState !== "none") return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && bootState === "splash") {
        setBootState("select");
      } else if (e.key.toLowerCase() === "d") {
        // Now uses whatever OS is actively in state (from storage OR active selection)
        const targetOS = state.osIndex;

        dispatch({ type: "SET_OS", payload: targetOS });
        dispatch({ type: "BOOT_OS" });
        dispatch({ type: "LOG_IN" });

        localStorage.setItem("nostro_booted", "true");
        localStorage.setItem("nostro_logged_in", "true");
        localStorage.setItem("nostro_selected_os", targetOS.toString());
        setBootState("booted");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [bootState, state.shutdownState, state.osIndex, dispatch]); // Added state.osIndex to dependencies

  if (!isClient) return null;

  if (state.shutdownState === "powered_off") {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white select-none font-sans relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-16 h-16 opacity-30 animate-pulse text-white mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
          </div>
          <span className="opacity-50 text-sm tracking-widest uppercase">
            Press Enter to power on
          </span>
        </div>
      </div>
    );
  }

  if (state.shutdownState === "shutting_down") {
    return <ShutdownScreen osIndex={state.osIndex} />;
  }

  if (bootState === "booted" && state.isBooted && state.isLoggedIn) {
    return <Desktop />;
  }

  if (bootState === "login") {
    return <LockScreenManager onUnlock={() => setBootState("booted")} />;
  }

  if (bootState === "splash") {
    return <BiosSplash onComplete={() => setBootState("select")} />;
  }

  return <OsSelectScreen onBoot={() => setBootState("login")} />;
}
