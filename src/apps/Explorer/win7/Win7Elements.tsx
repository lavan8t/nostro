"use client";

import React from "react";

export const Win7CommandButton = ({
  label,
  icon,
  hasDropdown,
}: {
  label: string;
  icon?: React.ReactNode;
  hasDropdown?: boolean;
}) => (
  <button className="flex items-center gap-1.5 px-2 py-1 rounded-[3px] border border-transparent hover:border-[#b8d6fb] hover:bg-[#e5f1fb] active:bg-[#cce4f7] transition-none text-[#1e395b]">
    {icon && <div className="w-4 h-4">{icon}</div>}
    <span>{label}</span>
    {hasDropdown && (
      <svg
        width="8"
        height="4"
        viewBox="0 0 8 4"
        fill="currentColor"
        className="ml-1 opacity-70"
      >
        <path d="M0 0h8L4 4z" />
      </svg>
    )}
  </button>
);

export const Win7NavGroup = ({
  title,
  children,
  expanded = true,
}: {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
}) => (
  <div className="flex flex-col mb-1">
    <div className="flex items-center gap-1 cursor-pointer select-none py-1 px-1 hover:bg-[#e5f3fb]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="2"
        className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span className="text-[#1e395b] font-semibold">{title}</span>
    </div>
    {expanded && <div className="flex flex-col pl-4">{children}</div>}
  </div>
);

export const Win7NavItem = ({
  label,
  icon,
  active,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none rounded-[3px] border border-transparent ${active ? "bg-[#cce8ff] border-[#99d1ff]" : "hover:bg-[#e5f3fb] hover:border-[#cce8ff]"}`}
  >
    {icon ? <div className="w-4 h-4">{icon}</div> : <div className="w-4 h-4" />}
    <span className="text-[#1e395b]">{label}</span>
  </div>
);

export const Win7DriveTile = ({
  letter,
  label,
  type,
  space,
  free,
}: {
  letter: string;
  label: string;
  type: "hard" | "cd";
  space?: string;
  free?: string;
}) => (
  <div className="flex items-start gap-2 w-75 p-2 hover:bg-[#e5f3fb] border border-transparent hover:border-[#cce8ff] rounded-[3px] select-none cursor-default group">
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
    </div>
    <div className="flex flex-col justify-center text-[12px] text-[#1e395b] w-full">
      <span className="font-semibold">
        {label} ({letter}:)
      </span>
      {type === "hard" && (
        <>
          <div className="h-3.5 w-full bg-[#e6e6e6] border border-[#ccc] mt-1 rounded-[1px] overflow-hidden">
            <div className="h-full bg-linear-to-b from-[#40a0c0] to-[#146080] w-[60%]" />
          </div>
          <span className="text-[#555] mt-0.5">
            {free} free of {space}
          </span>
        </>
      )}
    </div>
  </div>
);
