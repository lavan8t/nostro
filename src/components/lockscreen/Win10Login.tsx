"use client";

import React, { useState } from "react";

interface Win10LoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

export default function Win10Login({ onLogin, isLoading }: Win10LoginProps) {
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const [password, setPassword] = useState("");

  const handleScreenClick = () => {
    if (!isLoading && !showLoginPanel) {
      setShowLoginPanel(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  // Get current time
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className="h-screen w-screen relative overflow-hidden cursor-pointer"
      onClick={handleScreenClick}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      {/* Windows 10 Wallpaper Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100%25\" height=\"100%25\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3ClinearGradient id=\"grad\" x1=\"0%25\" y1=\"0%25\" x2=\"100%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%2300a0f0;stop-opacity:1\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:%230050d0;stop-opacity:1\" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grad)\" /%3E%3C/svg%3E')",
          backgroundSize: "cover"
        }}
      />

      {/* Lock Screen - Clock Display */}
      {!showLoginPanel && !isLoading && (
        <div className="absolute bottom-24 left-16 text-white">
          <div 
            className="font-light mb-2"
            style={{ fontSize: "120px", lineHeight: 1 }}
          >
            {timeString}
          </div>
          <div 
            className="font-normal"
            style={{ fontSize: "32px" }}
          >
            {dateString}
          </div>
        </div>
      )}

      {/* Login Panel - Slides up from bottom */}
      {showLoginPanel && !isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center animate-slide-up"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            animation: "slideUp 0.4s ease-out"
          }}
        >
          <style>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
          
          <div className="flex flex-col items-center">
            {/* User Avatar */}
            <div 
              className="w-32 h-32 rounded-full mb-6 flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "3px solid rgba(255, 255, 255, 0.4)"
              }}
            >
              <svg width="70" height="70" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            {/* Username */}
            <div 
              className="text-white font-normal mb-6"
              style={{ fontSize: "24px" }}
            >
              User
            </div>

            {/* Password Input */}
            <form onSubmit={handleSubmit} className="w-80">
              <div 
                className="flex items-center px-4 py-3 rounded mb-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-300"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 rounded text-white font-semibold text-sm"
                style={{
                  backgroundColor: "rgba(0, 120, 215, 0.8)",
                  backdropFilter: "blur(10px)"
                }}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div className="flex flex-col items-center">
            {/* Windows 10 Dotted Spinning Circle */}
            <div className="mb-8">
              <svg 
                className="animate-spin" 
                width="60" 
                height="60" 
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div 
              className="text-white font-light text-2xl"
            >
              Welcome
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
