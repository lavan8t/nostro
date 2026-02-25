"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "../../state/AppContext";

const OS_OPTIONS = [
    { id: 0, name: "Windows 98 (Classic Mode)" },
    { id: 1, name: "Windows XP (Whistler Mode)" },
    { id: 2, name: "Windows 7 (Aero Mode)" },
    { id: 3, name: "Windows 10 (Modern Mode)" }
];

export default function OsSelectScreen({ onBoot }: { onBoot: () => void }) {
    const { dispatch } = useAppContext();
    const [activeIndex, setActiveIndex] = useState(3); // Default to Win 10

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                setActiveIndex((prev) => (prev < OS_OPTIONS.length - 1 ? prev + 1 : 0));
            } else if (e.key === "ArrowUp") {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : OS_OPTIONS.length - 1));
            } else if (e.key === "Enter") {
                dispatch({ type: "SET_OS", payload: OS_OPTIONS[activeIndex].id });
                dispatch({ type: "BOOT_OS" });
                localStorage.setItem("nostro_booted", "true");
                onBoot();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, dispatch, onBoot]);

    return (
        <div className="h-screen w-screen bg-black text-gray-300 font-mono p-10 cursor-none flex flex-col select-none">
            <div className="border-b-2 border-gray-500 pb-2 mb-8 uppercase text-lg">
                Nostro Boot Manager v1.0
            </div>

            <div className="mb-8 text-sm leading-relaxed">
                Choose an operating system to start:
                <br />
                (Use the arrow keys to highlight your choice, then press ENTER.)
            </div>

            <div className="flex-1 ml-4 border border-gray-700 p-4 max-w-2xl bg-[#000000]">
                {OS_OPTIONS.map((os, idx) => (
                    <div
                        key={os.id}
                        className={`py-1 px-2 ${activeIndex === idx ? "bg-gray-300 text-black font-bold" : "text-gray-300"}`}
                    >
                        {os.name}
                    </div>
                ))}
            </div>

            <div className="text-xs text-gray-500 mt-auto flex justify-between max-w-2xl">
                <span>ENTER=Choose</span>
                <span>ESC=Cancel</span>
            </div>
        </div>
    );
}