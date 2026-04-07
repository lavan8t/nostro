"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppContext, MenuItem } from "../../state/AppContext";

export const getMediaPlayerMenus = (dispatch: any, winId: string): MenuItem[] => [
  { label: "File", action: () => alert("File Menu: Open, Close") },
  { label: "View", action: () => alert("View Menu: Full Screen, Zoom") },
  { label: "Play", action: () => alert("Play Menu: Play/Pause, Stop, Rewind") },
  { label: "Help", action: () => alert("Help Menu: About Windows Media Player") },
];

export default function MediaPlayer({ winId }: { winId: string }) {
  const { state } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visualizerPos, setVisualizerPos] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const [durationStr, setDurationStr] = useState("03:32"); // Classic RickRoll length
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const osIndex = state.osIndex; // 0: 98, 1: XP, 2: 7, 3: 10
  const isWin98 = osIndex === 0;
  const isWinXP = osIndex === 1;
  const isWin7 = osIndex === 2;
  const isWin10 = osIndex === 3;

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Keep the visualizer bouncing while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerPos((prev) => (prev + 5) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.error("Audio playback blocked:", err));
      setIsPlaying(true);
    }
  };

  const stopPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    
    setCurrentTimeStr(formatTime(current));
    if (total > 0) {
      setProgress((current / total) * 100);
      setDurationStr(formatTime(total));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  // --- Dynamic OS Theming ---
  const theme = {
    appBg: isWin98 ? "bg-[#c0c0c0]" : isWinXP ? "bg-gradient-to-b from-[#293ea6] to-[#4567e5] p-1" : isWin7 ? "bg-[#f5f6f7]" : "bg-[#111111]",
    textColor: isWin10 ? "text-white" : isWinXP ? "text-white" : "text-black",
    videoBorder: isWin98 ? "border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white" : isWinXP ? "border-2 border-[#1c2c7a]" : "border-none shadow-inner",
    controlPanelBg: isWin98 ? "bg-[#c0c0c0]" : isWinXP ? "bg-gradient-to-r from-[#ece9d8] to-[#d6d3c2] rounded-b-md" : isWin7 ? "bg-[#eaf1f8] border-t border-[#b9d1ea]" : "bg-[#1f1f1f]",
    getBtnStyle: () => {
      if (isWin98) return "bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white text-black";
      if (isWinXP) return "bg-[#316ac5] border border-[#1c2c7a] rounded-full text-white hover:bg-[#4a84e0] active:bg-[#1c2c7a]";
      if (isWin7) return "bg-transparent text-blue-700 hover:bg-blue-200 rounded-full border border-transparent hover:border-blue-300";
      return "bg-transparent text-white hover:bg-[#333333] rounded-full";
    }
  };

  return (
    <div 
      className={`w-full h-full flex flex-col select-none ${theme.appBg} ${theme.textColor} transition-colors duration-300`}
      style={{ fontFamily: "var(--os-font)" }}
    >
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src="/RickRoll.MP3" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
      
      {/* ==========================================
          TOP HEADER (Win7 / Win10 specific)
          ========================================== */}
      {(isWin7 || isWin10) && (
        <div className={`px-4 py-2 flex items-center justify-between text-xs ${isWin7 ? 'border-b border-gray-300' : ''}`}>
          <div className="flex gap-4">
            <span className="font-bold opacity-80 hover:opacity-100 cursor-pointer">Now Playing</span>
            <span className="opacity-60 hover:opacity-100 cursor-pointer">Library</span>
            <span className="opacity-60 hover:opacity-100 cursor-pointer">Burn</span>
          </div>
          <div className="flex gap-2">
            <div className={`px-2 py-1 rounded ${isWin10 ? 'bg-[#333]' : 'bg-white border border-gray-300'} text-[10px]`}>Search...</div>
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN LAYOUT: Sidebar (XP) + Video Area
          ========================================== */}
      <div className={`flex flex-grow overflow-hidden ${isWin98 ? 'p-2' : ''}`}>
        
        {/* WinXP specific left sidebar */}
        {isWinXP && (
          <div className="w-32 bg-[#293ea6] border-r border-[#1c2c7a] flex flex-col pt-2 text-xs">
            <div className="px-2 py-1 hover:bg-[#4567e5] cursor-pointer font-bold">Now Playing</div>
            <div className="px-2 py-1 hover:bg-[#4567e5] cursor-pointer">Media Guide</div>
            <div className="px-2 py-1 hover:bg-[#4567e5] cursor-pointer">Copy from CD</div>
            <div className="px-2 py-1 hover:bg-[#4567e5] cursor-pointer">Media Library</div>
            <div className="px-2 py-1 hover:bg-[#4567e5] cursor-pointer">Radio Tuner</div>
          </div>
        )}

        {/* Video / Visualizer Area */}
        <div className={`flex-grow bg-black relative overflow-hidden flex items-center justify-center ${theme.videoBorder}`}>
          
          {!isPlaying && progress === 0 ? (
            <div className="text-gray-500 text-sm flex flex-col items-center">
              <span className="text-4xl mb-2">🎵</span>
              {isWin10 ? "Choose a file to play" : "Ready"}
            </div>
          ) : (
            <>
              {/* Audio Visualizer */}
              <div className="absolute bottom-0 w-full flex items-end justify-center gap-1 h-1/2 px-4 opacity-70">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-full max-w-[20px] ${isWin10 ? 'bg-blue-500' : isWinXP ? 'bg-[#316ac5]' : 'bg-green-500'} transition-all duration-75`}
                    style={{ 
                      height: isPlaying ? `${Math.max(10, Math.sin((visualizerPos + i * 15) * 0.15) * 100)}%` : '10px'
                    }}
                  ></div>
                ))}
              </div>
            </>
          )}

          {/* Loading / Buffering spinner for Win10 style */}
          {isPlaying && isWin10 && (
            <div className="absolute top-4 right-4 w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin opacity-50"></div>
          )}
        </div>
      </div>

      {/* ==========================================
          BOTTOM CONTROL BAR
          ========================================== */}
      <div className={`flex flex-col p-2 flex-shrink-0 ${theme.controlPanelBg} ${isWinXP ? 'text-black' : ''}`}>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono">
          <span>{currentTimeStr}</span>
          <div 
            className="flex-grow relative h-3 flex items-center group cursor-pointer" 
            onClick={handleSeek}
          >
            {/* Track */}
            <div className={`absolute w-full h-1 ${isWin98 ? 'bg-[#808080] border-b border-r border-white' : 'bg-gray-300 rounded-full'}`}></div>
            {/* Fill */}
            <div className={`absolute h-1 ${isWin98 ? 'bg-[#000080]' : isWin10 ? 'bg-blue-500' : 'bg-[#316ac5]'} ${!isWin98 && 'rounded-full'}`} style={{ width: `${progress}%` }}></div>
            {/* Thumb */}
            <div className={`absolute w-2 h-4 ${isWin98 ? 'bg-[#c0c0c0] border border-gray-500' : 'bg-white border border-gray-400 rounded-full shadow-sm group-hover:scale-125 transition-transform'}`} style={{ left: `calc(${progress}% - 4px)` }}></div>
          </div>
          <span>{durationStr}</span>
        </div>
        
        {/* Playback Controls */}
        <div className={`flex items-center justify-center gap-2 mt-2 ${isWinXP ? 'mb-1' : ''}`}>
          <button 
            className={`w-8 h-8 flex items-center justify-center ${theme.getBtnStyle()}`}
            title="Stop"
            onClick={stopPlay}
          >
            ■
          </button>
          
          <button 
            className={`w-10 h-10 flex items-center justify-center ${theme.getBtnStyle()} ${isWin7 || isWinXP ? 'scale-110' : ''}`}
            title={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
          >
            <span className={`text-lg ${isPlaying ? '-ml-0' : 'ml-1'}`}>{isPlaying ? "||" : "▶"}</span>
          </button>

          <button 
            className={`w-8 h-8 flex items-center justify-center ${theme.getBtnStyle()}`}
            title="Fast Forward"
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
            }}
          >
            ▶▶
          </button>
        </div>

        {/* WinXP Bottom Status Line */}
        {isWinXP && (
          <div className="w-full text-[10px] text-[#4a84e0] mt-1 flex justify-between px-2">
            <span>{isPlaying ? 'Playing...' : 'Ready'}</span>
            <span>RickRoll.MP3</span>
          </div>
        )}
      </div>

    </div>
  );
}