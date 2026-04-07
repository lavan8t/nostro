"use client";

import React, { useState, useEffect } from "react";
import { useAppContext, MenuItem } from "../../state/AppContext";

export const getCalendarMenus = (dispatch: any, winId: string): MenuItem[] => [
  { label: "View", action: () => {} },
  { label: "Help", action: () => {} },
];

export default function Calendar({ winId }: { winId: string }) {
  const { state } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [time, setTime] = useState("");

  const osIndex = state.osIndex; // 0: 98, 1: XP, 2: 7, 3: 10

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Previous month days for the faded out dates
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const blanks = Array.from({ length: firstDay }, (_, i) => daysInPrevMonth - firstDay + i + 1);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Next month days to fill the 6x7 grid (42 cells total)
  const totalCellsFilled = blanks.length + monthDays.length;
  const nextMonthDays = Array.from({ length: 42 - totalCellsFilled }, (_, i) => i + 1);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentYear, currentMonth + offset, 1));
  };

  const isWin98 = osIndex === 0;
  const isWinXP = osIndex === 1;
  const isWin7 = osIndex === 2;
  const isWin10 = osIndex === 3;

  const realToday = new Date();
  const isCurrentMonthView = currentMonth === realToday.getMonth() && currentYear === realToday.getFullYear();

  // ==========================================
  // WIN XP GADGET LOOK
  // ==========================================
  if (isWinXP) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent drop-shadow-xl">
        <div className="w-56 bg-white border border-black flex flex-col font-sans select-none shadow-md">
          
          {/* XP Blue Header */}
          <div className="flex justify-between items-center bg-[#0046d5] px-1.5 py-1.5 text-white border-b border-black">
            <button 
              onClick={() => changeMonth(-1)}
              className="w-6 h-5 bg-gradient-to-b from-[#ffffff] to-[#99bbf0] border border-[#002277] text-[#002277] font-bold flex items-center justify-center text-sm leading-none active:scale-95 shadow-sm rounded-sm"
            >
              &lt;
            </button>
            <span className="font-bold text-[14px] tracking-wide">
              {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
            </span>
            <button 
              onClick={() => changeMonth(1)}
              className="w-6 h-5 bg-gradient-to-b from-[#ffffff] to-[#99bbf0] border border-[#002277] text-[#002277] font-bold flex items-center justify-center text-sm leading-none active:scale-95 shadow-sm rounded-sm"
            >
              &gt;
            </button>
          </div>

          {/* XP Day Headers */}
          <div className="grid grid-cols-7 text-center pt-1 pb-1 border-b border-gray-400 mx-2 mb-1 text-[11px] text-[#333]">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>

          {/* XP Grid */}
          <div className="grid grid-cols-7 text-center text-[13px] gap-y-0.5 px-2 mb-1">
            {/* Prev Month */}
            {blanks.map(d => <div key={`prev-${d}`} className="py-0.5 text-[#d0d0d0]">{d}</div>)}
            
            {/* Current Month */}
            {monthDays.map(d => {
              const isToday = isCurrentMonthView && d === realToday.getDate();
              return (
                <div key={`curr-${d}`} className="flex items-center justify-center p-[1px]">
                  <div className={`w-full h-full flex items-center justify-center py-0.5 ${
                    isToday 
                      ? "bg-[#2951a5] text-white border border-[#8b2346] font-bold" 
                      : "text-black hover:bg-black/5 cursor-pointer border border-transparent"
                  }`}>
                    {d}
                  </div>
                </div>
              );
            })}

            {/* Next Month */}
            {nextMonthDays.map(d => <div key={`next-${d}`} className="py-0.5 text-[#d0d0d0]">{d}</div>)}
          </div>

          {/* XP Footer */}
          <div className="mt-auto flex items-center gap-1.5 px-2 py-1.5 border-t border-gray-100 bg-white">
             <div className="w-5 h-[14px] border border-[#8b2346]"></div>
             <span className="font-bold text-[12px] text-black tracking-tight">Today: {realToday.toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // WIN 7 GADGET LOOK (Skeuomorphic Spiral)
  // ==========================================
  if (isWin7) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent drop-shadow-2xl">
        <div className="w-56 bg-gradient-to-b from-[#fcfcfc] via-[#f0f0f0] to-[#e0e0e0] rounded-lg border border-white relative px-3 pb-3 pt-6 font-sans text-[#333] shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
          <div className="absolute -top-3 left-0 right-0 flex justify-evenly px-3 pointer-events-none z-10">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#f4f4f4] via-[#fff] to-[#999] border border-[#777] shadow-[0_3px_4px_rgba(0,0,0,0.5)] relative">
                <div className="absolute bottom-1 left-0.5 right-0.5 h-1.5 bg-[#333] rounded-full opacity-30"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-2 px-1">
            <button onClick={() => changeMonth(-1)} className="w-0 h-0 border-t-[5px] border-t-transparent border-r-[8px] border-r-gray-400 border-b-[5px] border-b-transparent hover:border-r-gray-600 active:scale-95" />
            <span className="font-semibold text-sm">{currentDate.toLocaleString('default', { month: 'short' })} {currentYear}</span>
            <button onClick={() => changeMonth(1)} className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-gray-400 border-b-[5px] border-b-transparent hover:border-l-gray-600 active:scale-95" />
          </div>

          <div className="grid grid-cols-7 text-center text-xs mb-1">
            {days.map((d, i) => (
              <div key={i} className={`font-bold pb-1 border-b border-gray-300 ${isCurrentMonthView && realToday.getDay() === i ? 'text-[#e57224]' : 'text-gray-500'}`}>{d[0]}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center text-sm gap-y-1">
            {blanks.map(d => <div key={`prev-${d}`} className="py-1 text-gray-400">{d}</div>)}
            {monthDays.map(d => {
              const isToday = isCurrentMonthView && d === realToday.getDate();
              return (
                <div key={`curr-${d}`} className="flex items-center justify-center p-0.5">
                  <div className={`w-6 h-6 flex items-center justify-center ${isToday ? "bg-gradient-to-b from-[#f78d3f] to-[#d65f1a] text-white rounded-[3px] border border-[#b84b0e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] font-bold" : "text-black hover:bg-black/5 rounded-[3px] cursor-pointer"}`}>
                    {d}
                  </div>
                </div>
              );
            })}
            {nextMonthDays.map(d => <div key={`next-${d}`} className="py-1 text-gray-400">{d}</div>)}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // WIN 98 and WIN 10 LOOKS
  // ==========================================
  let containerClass = "w-full h-full flex flex-col p-2 select-none ";
  if (isWin98) {
    containerClass += "bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]";
  } else {
    // Win10
    containerClass += "bg-[#1f1f1f] text-white border border-[#444]";
  }

  return (
    <div className={containerClass} style={{ fontFamily: "var(--os-font)" }}>
      {isWin10 && (
        <div className="mb-4 px-2 border-b border-gray-700 pb-4">
          <div className="text-4xl font-light">{time}</div>
          <div className="text-[#0078d7] text-sm mt-1">
            {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-3 px-1">
        <span className={`font-bold ${isWin98 ? 'text-[13px]' : 'text-sm'}`}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
        </span>
        <div className="flex gap-1">
          <button onClick={() => changeMonth(-1)} className={`w-6 h-6 flex items-center justify-center ${isWin98 ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]' : 'hover:bg-gray-500/20'}`}>&lt;</button>
          <button onClick={() => changeMonth(1)} className={`w-6 h-6 flex items-center justify-center ${isWin98 ? 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]' : 'hover:bg-gray-500/20'}`}>&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs gap-y-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className={`font-bold pb-2 ${isWin10 ? 'text-gray-400' : 'text-gray-600'}`}>{d}</div>)}
        
        {blanks.map(b => <div key={`prev-${b}`} className="py-1 text-gray-400 opacity-50">{b}</div>)}
        
        {monthDays.map(d => {
          const isToday = isCurrentMonthView && d === realToday.getDate();
          let dayStyle: React.CSSProperties = { border: "1px solid transparent" };
          let dayClass = "py-1.5 text-[13px] cursor-pointer flex items-center justify-center ";
          
          if (isToday) {
            dayClass += "font-bold ";
            if (isWin98) {
              dayClass += "bg-[#c0c0c0] ";
              dayStyle.borderTop = "1px solid #808080";
              dayStyle.borderLeft = "1px solid #808080";
              dayStyle.borderBottom = "1px solid white";
              dayStyle.borderRight = "1px solid white";
            } else {
              dayClass += "bg-[#0078d7] text-white";
            }
          }
          return <div key={`curr-${d}`} className={dayClass} style={dayStyle}>{d}</div>;
        })}
        
        {nextMonthDays.map(d => <div key={`next-${d}`} className="py-1 text-gray-400 opacity-50">{d}</div>)}
      </div>
    </div>
  );
}