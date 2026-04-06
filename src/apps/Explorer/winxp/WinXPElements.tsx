"use client";

import React from "react";

export interface XPToolbarButtonProps {
  label?: string;
  icon: React.ReactNode;
  hasDropdown?: boolean;
}

export interface XPTaskGroupProps {
  title: string;
  children?: React.ReactNode;
  expanded?: boolean;
}

export interface XPTaskItemProps {
  icon: React.ReactNode;
  label: string;
}

export interface XPDriveTileProps {
  letter: string;
  label: string;
  type: "hard" | "cd";
}

export const XPToolbarButton: React.FC<XPToolbarButtonProps> = ({
  label,
  icon,
  hasDropdown = false,
}) => (
  <div className="flex items-center">
    <button className="flex items-center justify-center gap-1 h-9.5 px-1 rounded-[3px] border border-transparent hover:border-[#316ac5] hover:bg-[#c1d2ee] active:bg-[#98b5e2] text-black transition-none group">
      <div className="w-6 h-6 flex items-center justify-center filter drop-shadow-sm group-active:translate-x-px group-active:translate-y-px">
        {icon}
      </div>
      {label && <span className="text-[11px] pr-1">{label}</span>}
    </button>
    {hasDropdown && (
      <button className="h-9.5 px-0.5 rounded-[3px] border border-transparent hover:border-[#316ac5] hover:bg-[#c1d2ee] active:bg-[#98b5e2] flex items-center justify-center">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="black">
          <path d="M0 0h8L4 4z" />
        </svg>
      </button>
    )}
  </div>
);

export const XPSeparator: React.FC = () => (
  <div className="w-px h-8 mx-1 bg-[#aca899] shadow-[1px_0_0_0_white]" />
);

export const XPTaskGroup: React.FC<XPTaskGroupProps> = ({
  title,
  children,
  expanded = true,
}) => (
  <div className="flex flex-col mb-3">
    <div
      className="h-5.75 rounded-t-[3px] px-3 flex justify-between items-center cursor-pointer select-none"
      style={{
        background: "linear-gradient(to bottom, #ffffff 0%, #e5efff 100%)",
      }}
    >
      <span className="text-[#1d5281] font-bold text-[11px] tracking-wide">
        {title}
      </span>
      <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
        {expanded ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1d5281"
            strokeWidth="2"
            className="w-3 h-3"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
            <polyline
              points="18 11 12 5 6 11"
              className="opacity-50"
            ></polyline>
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1d5281"
            strokeWidth="2"
            className="w-3 h-3"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
            <polyline
              points="6 13 12 19 18 13"
              className="opacity-50"
            ></polyline>
          </svg>
        )}
      </div>
    </div>
    {expanded && (
      <div className="bg-[#d6e8ff] px-3 py-2 flex flex-col gap-1.5 border-l border-r border-b border-white">
        {children}
      </div>
    )}
  </div>
);

export const XPTaskItem: React.FC<XPTaskItemProps> = ({ icon, label }) => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="w-4 h-4 flex items-center justify-center text-[#1d5281] group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-[#0c327d] text-[11px] group-hover:underline">
      {label}
    </span>
  </div>
);

export const XPDriveTile: React.FC<XPDriveTileProps> = ({
  letter,
  label,
  type,
}) => (
  <div className="flex items-center gap-2 w-55 p-1 hover:bg-[#316ac5] hover:text-white group cursor-default">
    <div className="w-12 h-12 relative shrink-0">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className="w-full h-full drop-shadow-md"
      >
        <rect
          x="6"
          y="16"
          width="36"
          height="16"
          rx="2"
          fill="#e0e0e0"
          stroke="#999"
          strokeWidth="1.5"
        />
        <rect x="6" y="16" width="36" height="6" rx="2" fill="#f5f5f5" />
        <circle cx="12" cy="24" r="2" fill="#555" />
        {type === "cd" && (
          <>
            <circle
              cx="24"
              cy="24"
              r="10"
              fill="#ddd"
              stroke="#aaa"
              strokeWidth="1"
            />
            <circle cx="24" cy="24" r="3" fill="#fff" stroke="#999" />
            <path
              d="M24 14 A10 10 0 0 1 34 24"
              stroke="#fff"
              strokeWidth="2"
              opacity="0.6"
            />
          </>
        )}
      </svg>
      {type === "cd" && (
        <div className="absolute -bottom-1 left-1 bg-black text-white text-[8px] font-bold px-1 rounded-sm border border-white">
          CD-RW
        </div>
      )}
    </div>
    <div className="flex flex-col justify-center text-[11px] text-black group-hover:text-white leading-tight">
      <span>
        {label} ({letter}:)
      </span>
    </div>
  </div>
);
