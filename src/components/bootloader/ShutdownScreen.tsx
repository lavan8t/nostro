"use client";

import React, { useEffect } from "react";
import { useAppContext } from "../../state/AppContext";

export default function ShutdownScreen({ osIndex }: { osIndex: number }) {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // Automatically finish shutting down and cut power after 3 seconds
    const timer = setTimeout(() => {
      dispatch({ type: "FINISH_SHUTDOWN" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Windows 98
  if (osIndex === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#008080] select-none cursor-wait">
        <div className="bg-[#c0c0c0] border-t border-l border-white border-r border-b p-4 shadow-[1px_1px_0_0_black] max-w-sm w-full">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full opacity-60"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-[13px] mb-1 font-sans text-black">
                Windows is shutting down...
              </h1>
              <p className="text-[11px] font-sans text-black">Please wait.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Windows XP
  if (osIndex === 1) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0033e6] text-white select-none cursor-wait font-sans">
        <div className="w-full h-24 bg-linear-to-b from-[#0033e6] to-[#001f8f] border-t border-b border-white/20 flex items-center justify-center shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold italic shadow-black drop-shadow-md">
              Windows is shutting down...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Windows 7
  if (osIndex === 2) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1868A9] bg-[radial-gradient(circle_at_center,#1D80CF_0%,#1868A9_100%)] text-white select-none cursor-wait font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-2xl text-shadow-md shadow-black drop-shadow-md">
            Shutting down...
          </span>
        </div>
      </div>
    );
  }

  // Windows 10
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#005A9E] text-white select-none cursor-wait font-sans">
      <div className="flex flex-col items-center gap-6">
        <span className="text-2xl font-light">Shutting down</span>
        <div className="flex gap-2">
          <div
            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "450ms" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "600ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
