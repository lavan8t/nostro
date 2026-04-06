"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "../../state/AppContext";

const OS_OPTIONS = [
  { id: 0, name: "Windows 98" },
  { id: 1, name: "Windows XP" },
  { id: 2, name: "Windows 7" },
  { id: 3, name: "Windows 10" },
];

export default function OsSelectScreen({ onBoot }: { onBoot: () => void }) {
  const { state, dispatch } = useAppContext();

  // Initialize active index to match the last booted OS from global state
  const [activeIndex, setActiveIndex] = useState(() => {
    const foundIndex = OS_OPTIONS.findIndex((os) => os.id === state.osIndex);
    return foundIndex !== -1 ? foundIndex : 3;
  });

  const [countdown, setCountdown] = useState<number | null>(10);

  // Sync activeIndex with global state so the "D" shortcut knows what is highlighted
  useEffect(() => {
    dispatch({ type: "SET_OS", payload: OS_OPTIONS[activeIndex].id });
  }, [activeIndex, dispatch]);

  // Countdown timer
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      handleBoot();
    }
  }, [countdown]);

  const handleBoot = () => {
    dispatch({ type: "SET_OS", payload: OS_OPTIONS[activeIndex].id });
    dispatch({ type: "BOOT_OS" });
    localStorage.setItem("nostro_booted", "true");
    localStorage.setItem(
      "nostro_selected_os",
      String(OS_OPTIONS[activeIndex].id),
    );
    onBoot();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => (prev < OS_OPTIONS.length - 1 ? prev + 1 : 0));
        setCountdown(null); // Cancel auto-boot and vanish text
      } else if (e.key === "ArrowUp") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : OS_OPTIONS.length - 1));
        setCountdown(null); // Cancel auto-boot and vanish text
      } else if (e.key === "Enter") {
        handleBoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, dispatch, onBoot]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden font-mono select-none">
      {/* 4:3 Aspect Ratio Container mimicking a classic VGA display */}
      <div
        className="flex flex-col bg-black text-[#aaaaaa]"
        style={{
          width: "800px",
          height: "600px",
          fontFamily: "'Consolas', 'Courier New', Courier, monospace",
          fontSize: "18px",
          lineHeight: "1.2",
        }}
      >
        {/* Header */}
        <div className="bg-[#aaaaaa] text-black text-center py-0.5 mb-8 font-bold">
          Windows Boot Manager
        </div>

        {/* Instruction Text */}
        <div className="px-6 mb-6 text-white">
          <div>
            Choose an operating system to start, or press TAB to select a tool:
          </div>
          <div>
            (Use the arrow keys to highlight your choice, then press ENTER.)
          </div>
        </div>

        {/* OS List */}
        <div className="px-14 mb-16 flex flex-col">
          {OS_OPTIONS.map((os, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={os.id}
                className={`flex justify-between px-1 py-px ${
                  isActive
                    ? "bg-[#aaaaaa] text-black"
                    : "text-[#aaaaaa] bg-transparent"
                }`}
              >
                <span>{os.name}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="px-6 mb-16 text-white">
          <div className="mb-1">
            To specify an advanced option for this choice, press F8.
          </div>
          <div className="min-h-5.5">
            {countdown !== null
              ? `Seconds until the highlighted choice will be started automatically: ${countdown}`
              : ""}
          </div>
        </div>

        {/* Tools Section */}
        <div className="px-6 flex-1 text-white">
          <div className="mb-4">Tools:</div>
          <div className="pl-10">Windows Memory Diagnostic</div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#aaaaaa] text-black flex justify-between px-6 py-0.5">
          <span>ENTER=Choose</span>
          <span>TAB=Menu</span>
          <span>ESC=Cancel</span>
        </div>
      </div>
    </div>
  );
}
