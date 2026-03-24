"use client";

import React, { useState, useEffect } from "react";
import BiosSplash from "./BiosSplash";
import OsSelectScreen from "./OsSelectScreen";
import LockScreenManager from "../lockscreen/LockScreenManager";
import { useAppContext } from "../../state/AppContext";
import Desktop from "../Desktop";

export default function BootManager() {
    const { state, dispatch } = useAppContext();
    const [bootState, setBootState] = useState<"splash" | "select" | "login" | "booted">("splash");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedBoot = localStorage.getItem("nostro_booted");
        const storedLogin = localStorage.getItem("nostro_logged_in");
        const storedOS = localStorage.getItem("nostro_selected_os");

        if (storedBoot === "true" && storedLogin === "true") {
            // Load the previously selected OS and logged in state
            if (storedOS) {
                dispatch({ type: "SET_OS", payload: parseInt(storedOS, 10) });
            }
            dispatch({ type: "BOOT_OS" });
            dispatch({ type: "LOG_IN" });
            setBootState("booted");
        } else {
            setBootState("splash");
        }
    }, [dispatch]);

    // Handle logout - return to splash screen
    useEffect(() => {
        if (!state.isBooted && isClient && bootState === "booted") {
            setBootState("splash");
        }
    }, [state.isBooted, isClient, bootState]);

    // Handle successful login - move to desktop
    useEffect(() => {
        if (state.isLoggedIn && bootState === "login") {
            localStorage.setItem("nostro_logged_in", "true");
            setBootState("booted");
        }
    }, [state.isLoggedIn, bootState]);

    if (!isClient) return null;

    if (bootState === "booted" && state.isBooted && state.isLoggedIn) {
        return <Desktop />;
    }

    if (bootState === "login") {
        return <LockScreenManager />;
    }

    if (bootState === "splash") {
        return <BiosSplash onComplete={() => setBootState("select")} />;
    }

    return <OsSelectScreen onBoot={() => setBootState("login")} />;
}