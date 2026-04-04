"use client";

import React from "react";

export interface Win98ToolbarButtonProps {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export interface Win98DriveIconProps {
  letter: string;
  type: "floppy" | "hard" | "cd";
}

export interface Win98IconProps {
  label: string;
  folder?: boolean;
}

export const Win98ToolbarButton: React.FC<Win98ToolbarButtonProps> = ({
  label,
  icon,
  disabled = false,
}) => (
  <button
    className={`flex flex-col items-center justify-center w-12 h-10 border border-transparent ${disabled ? "text-(--GrayText)" : "text-(--ButtonText) hover:border-t-(--ButtonHilight) hover:border-l-(--ButtonHilight) hover:border-r-(--ButtonDkShadow) hover:border-b-(--ButtonDkShadow) hover:shadow-[inset_1px_1px_0_0_var(--ButtonLight),inset_-1px_-1px_0_0_var(--ButtonShadow)] active:border-t-(--ButtonDkShadow) active:border-l-(--ButtonDkShadow) active:border-r-(--ButtonHilight) active:border-b-(--ButtonHilight) active:shadow-[inset_1px_1px_0_0_var(--ButtonShadow)]"}`}
    disabled={disabled}
  >
    <div className={`w-5 h-5 mb-0.5 ${disabled ? "opacity-40 grayscale" : ""}`}>
      {icon}
    </div>
    <span className="text-[10px] leading-none">{label}</span>
  </button>
);

export const Win98Separator: React.FC = () => (
  <div className="w-0.5 h-8 mx-1 border-l border-r border-(--ButtonHilight)" />
);

export const Win98DriveIcon: React.FC<Win98DriveIconProps> = ({
  letter,
  type,
}) => (
  <div className="flex flex-col items-center justify-start w-20 h-16 group cursor-default">
    <div className="w-8 h-8 mb-1 relative opacity-80 group-hover:opacity-100">
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="w-full h-full text-gray-500"
      >
        <rect x="2" y="8" width="28" height="16" rx="2" fill="#d1d5db" />
        <rect x="4" y="10" width="24" height="12" fill="#9ca3af" />
        {type === "floppy" && (
          <rect x="8" y="10" width="16" height="8" fill="#4b5563" />
        )}
        {type === "cd" && <circle cx="16" cy="16" r="6" fill="#fbbf24" />}
      </svg>
    </div>
    <span className="text-[11px] text-center leading-tight group-hover:bg-[#000080] group-hover:text-white px-1">
      {type === "floppy" ? `3½ Floppy (${letter}:)` : `(${letter}:)`}
    </span>
  </div>
);

export const Win98Icon: React.FC<Win98IconProps> = ({
  label,
  folder = true,
}) => (
  <div className="flex flex-col items-center justify-start w-20 h-16 group cursor-default">
    <div className="w-8 h-8 mb-1 opacity-80 group-hover:opacity-100">
      {folder ? (
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-full h-full text-[#fcd34d]"
        >
          <path d="M2 6l8-2 2 4h18v18H2V6z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-full h-full text-gray-500"
        >
          <path d="M4 6h10l3 4h11v16H4V6z" />
        </svg>
      )}
    </div>
    <span className="text-[11px] text-center leading-tight group-hover:bg-[#000080] group-hover:text-white px-1">
      {label}
    </span>
  </div>
);
