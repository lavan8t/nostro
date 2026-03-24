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
    const [countdown, setCountdown] = useState(10);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Auto-boot when countdown reaches 0
    useEffect(() => {
        if (countdown === 0) {
            handleBoot();
        }
    }, [countdown]);

    const handleBoot = () => {
        dispatch({ type: "SET_OS", payload: OS_OPTIONS[activeIndex].id });
        dispatch({ type: "BOOT_OS" });
        localStorage.setItem("nostro_booted", "true");
        localStorage.setItem("nostro_selected_os", String(OS_OPTIONS[activeIndex].id));
        onBoot();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                setActiveIndex((prev) => (prev < OS_OPTIONS.length - 1 ? prev + 1 : 0));
                setCountdown(10); // Reset countdown on interaction
            } else if (e.key === "ArrowUp") {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : OS_OPTIONS.length - 1));
                setCountdown(10); // Reset countdown on interaction
            } else if (e.key === "Enter") {
                handleBoot();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, dispatch, onBoot]);

    return (
        <div className="h-screen w-screen bg-black text-white font-mono flex flex-col select-none overflow-hidden">
            {/* Header Bar - Centered, 60-70% width */}
            <div className="w-full flex justify-center pt-8 mb-6">
                <div 
                    className="bg-[#cfcfcf] text-black flex items-center justify-center"
                    style={{ 
                        width: '65%',
                        height: '45px',
                        fontSize: '22px',
                        fontWeight: '600'
                    }}
                >
                    Windows Boot Manager
                </div>
            </div>

            {/* Main Content - Left Aligned with 120px margin */}
            <div className="flex-1 flex flex-col" style={{ paddingLeft: '240px', paddingRight: '80px' }}>
                
                {/* Instruction Text */}
                <div className="mb-8" style={{ marginTop: '25px' }}>
                    <div 
                        className="text-white mb-2"
                        style={{ fontSize: '18px', lineHeight: '1.4', marginBottom: '10px' }}
                    >
                        Choose an operating system to start, or press TAB to select a tool:
                    </div>
                    <div 
                        className="text-[#a0a0a0]"
                        style={{ fontSize: '16px', lineHeight: '1.4' }}
                    >
                        (Use the arrow keys to highlight your choice, then press ENTER.)
                    </div>
                </div>

                {/* Operating System List */}
                <div className="mb-8">
                    {/* Section Label */}
                    <div 
                        className="text-white mb-5"
                        style={{ fontSize: '20px' }}
                    >
                        Earlier Version of Windows
                    </div>
                    
                    {/* OS Options */}
                    <div className="flex flex-col" style={{ gap: '18px' }}>
                        {OS_OPTIONS.map((os, idx) => (
                            <div
                                key={os.id}
                                className={`${
                                    activeIndex === idx
                                        ? "bg-[#cfcfcf] text-black"
                                        : "bg-transparent text-white"
                                }`}
                                style={{
                                    fontSize: '20px',
                                    height: '38px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: '40px',
                                    paddingRight: '40px',
                                    marginRight: '-80px'
                                }}
                            >
                                {os.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advanced Options Message */}
                <div 
                    className="text-white"
                    style={{ fontSize: '17px', marginTop: '30px' }}
                >
                    To specify an advanced option for this choice, press F8.
                </div>

                {/* Auto Boot Countdown */}
                <div 
                    className="text-white"
                    style={{ fontSize: '17px', marginTop: '12px' }}
                >
                    Seconds until the highlighted choice will be started automatically: {countdown}
                </div>

                {/* Tools Section */}
                <div style={{ marginTop: '80px' }}>
                    <div 
                        className="text-white mb-3"
                        style={{ fontSize: '18px' }}
                    >
                        Tools:
                    </div>
                    <div 
                        className="text-white ml-8"
                        style={{ fontSize: '18px' }}
                    >
                        Windows Memory Diagnostic
                    </div>
                </div>
            </div>

            {/* Footer Bar - Full Width */}
            <div 
                className="w-full bg-[#cfcfcf] text-black flex justify-between items-center px-24"
                style={{ 
                    height: '40px',
                    fontSize: '16px',
                    fontWeight: '500'
                }}
            >
                <span>ENTER=Choose</span>
                <span>TAB=Menu</span>
                <span>ESC=Cancel</span>
            </div>
        </div>
    );
}