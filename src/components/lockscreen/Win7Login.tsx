"use client";

import React, { useState } from "react";

interface Win7LoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

export default function Win7Login({ onLogin, isLoading }: Win7LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleAvatarClick = () => {
    if (!isLoading) {
      setShowPassword(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #4cb5f5 0%, #034ea2 50%, #022c5e 100%)"
      }}
    >
      {/* Aero Swirl Effect Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='swirl' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffffff;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23ffffff;stop-opacity:0' /%3E%3C/radialGradient%3E%3C/defs%3E%3Cellipse cx='50%25' cy='50%25' rx='40%25' ry='30%25' fill='url(%23swirl)' /%3E%3C/svg%3E")`,
          backgroundSize: "cover"
        }}
      />

      {/* Main Login Container */}
      <div className="relative z-10 flex flex-col items-center">
        {!isLoading && (
          <>
            {/* User Avatar */}
            <div 
              className={`mb-6 ${!showPassword ? 'cursor-pointer' : ''}`}
              onClick={handleAvatarClick}
            >
              <div 
                className="w-36 h-36 rounded-lg flex items-center justify-center overflow-hidden relative"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                <svg width="90" height="90" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            {/* Username */}
            <div 
              className="text-white font-normal mb-4 drop-shadow-lg"
              style={{ fontSize: "28px" }}
            >
              User
            </div>

            {/* Password Input or Click Prompt */}
            {showPassword ? (
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div 
                  className="flex items-center px-4 py-3 rounded mb-3"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    width: "300px"
                  }}
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-gray-800"
                  />
                  <button
                    type="submit"
                    className="ml-2 w-8 h-8 rounded flex items-center justify-center text-white"
                    style={{
                      backgroundColor: "#3498db"
                    }}
                  >
                    →
                  </button>
                </div>
              </form>
            ) : (
              <div 
                className="text-white text-base opacity-90 drop-shadow"
              >
                Click your picture to log on
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center">
            {/* Windows 7 Spinning Circle */}
            <div className="mb-6">
              <svg 
                className="animate-spin" 
                width="80" 
                height="80" 
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="#4cb5f5"
                  strokeWidth="4"
                  strokeDasharray="31.4 31.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div 
              className="text-white font-normal text-2xl drop-shadow-lg"
            >
              Welcome
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
        <button 
          className="px-4 py-2 rounded text-white text-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
          disabled={isLoading}
        >
          Ease of access
        </button>
        <button 
          className="px-4 py-2 rounded text-white text-sm flex items-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
          disabled={isLoading}
        >
          <span className="mr-2">⏻</span>
          Shut down
        </button>
      </div>
    </div>
  );
}
