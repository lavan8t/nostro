"use client";

import React from "react";

export default function BiosSplash({ onComplete }: { onComplete: () => void }) {
    // We removed the useEffect timeout so it stays here infinitely until clicked

    return (
        <div
            onClick={onComplete} // Clicking anywhere triggers the transition to the OS Select screen
            className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white cursor-pointer select-none relative"
        >
            <div
                className="text-7xl font-bold tracking-widest text-blue-500 mb-4"
                style={{ fontFamily: "serif", textShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
            >
                nostro
            </div>

            <div className="text-sm font-mono text-gray-400">
                Motherboard BIOS Revision 1.0.4
            </div>

            {/* Blinking prompt to let the user know they need to click */}
            <div className="mt-16 text-gray-500 font-mono text-sm animate-pulse">
                Click anywhere to continue...
            </div>

            <div className="absolute bottom-10 left-10 text-xs font-mono text-gray-500">
                Press DEL to enter Setup...
            </div>
        </div>
    );
}