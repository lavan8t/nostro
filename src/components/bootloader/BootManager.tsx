"use client";

import React, { useState, useEffect } from "react";
import BiosSplash from "./BiosSplash";
import OsSelectScreen from "./OsSelectScreen";
import { useAppContext } from "../../state/AppContext";
import Desktop from "../Desktop";

export default function BootManager() {
    const { state } = useAppContext();
    const [bootState, setBootState] = useState<"splash" | "select" | "booted">("splash");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem("nostro_booted");

        if (stored === "true" || state.isBooted) {
            setBootState("booted");
        } else {
            setBootState("splash");
        }
    }, [state.isBooted]);

    if (!isClient) return null;

    if (bootState === "booted" && state.isBooted) {
        return <Desktop />;
    }

    if (bootState === "splash") {
        return <BiosSplash onComplete={() => setBootState("select")} />;
    }

    return <OsSelectScreen onBoot={() => setBootState("booted")} />;
}