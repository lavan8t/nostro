"use client";

import React from "react";
import {
  Win7CommandButton,
  Win7DriveTile,
  Win7NavGroup,
  Win7NavItem,
} from "./Win7Elements";

export default function Win7Explorer() {
  return (
    <div className="w-full h-full flex flex-col bg-[#f0f0f0] text-black font-['Segoe_UI',sans-serif] text-[12px] cursor-default select-none">
      {/* Top Header / Address Bar Area */}
      <div className="flex items-center px-2 py-2 gap-2 bg-linear-to-b from-[#f9fbfd] to-[#e4eff8] border-b border-[#d9d9d9]">
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-full border border-[#b8b8b8] shadow-sm flex items-center justify-center bg-white hover:bg-[#e5f1fb] hover:border-[#b8d6fb] text-[#555]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="w-6 h-6 rounded-full border border-transparent flex items-center justify-center hover:bg-[#e5f1fb] hover:border-[#b8d6fb] opacity-50 text-[#555]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center bg-white border border-[#b9d1ea] h-6.5 px-1 shadow-inner overflow-hidden text-black">
          <svg viewBox="0 0 32 32" fill="#316ac5" className="w-4 h-4 mr-1">
            <path d="M4 6h10l3 4h11v16H4V6z" />
          </svg>
          <span className="text-[12px] flex items-center gap-1">
            Computer{" "}
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="currentColor"
              className="opacity-50"
            >
              <path d="M0 0h6L3 6z" />
            </svg>
          </span>
        </div>

        <div className="w-50 flex items-center bg-white border border-[#b9d1ea] h-6.5 px-2 shadow-inner text-[#888] italic">
          Search Computer
        </div>
      </div>

      {/* Command Bar */}
      <div className="flex items-center px-2 py-1 bg-[#f5f6f7] border-b border-[#d9d9d9] gap-1 shadow-sm relative z-10">
        <Win7CommandButton label="Organize" hasDropdown />
        <div className="w-px h-4 bg-[#ccc] mx-1" />
        <Win7CommandButton label="System properties" />
        <div className="w-px h-4 bg-[#ccc] mx-1" />
        <Win7CommandButton label="Uninstall or change a program" />
        <div className="w-px h-4 bg-[#ccc] mx-1" />
        <Win7CommandButton label="Map network drive" hasDropdown />
      </div>

      {/* Main Split Pane */}
      <div className="flex-1 flex overflow-hidden bg-white text-black">
        {/* Left Nav Pane */}
        <div className="w-50 h-full overflow-y-auto bg-white border-r border-[#d9d9d9] p-2">
          <Win7NavGroup title="Favorites">
            <Win7NavItem
              label="Desktop"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                </svg>
              }
            />
            <Win7NavItem
              label="Downloads"
              icon={
                <svg viewBox="0 0 24 24" fill="#316ac5">
                  <path
                    d="M12 3v14m-4-4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              }
            />
            <Win7NavItem
              label="Recent Places"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                </svg>
              }
            />
          </Win7NavGroup>
          <Win7NavGroup title="Libraries">
            <Win7NavItem
              label="Documents"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                </svg>
              }
            />
            <Win7NavItem
              label="Music"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                </svg>
              }
            />
            <Win7NavItem
              label="Pictures"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                </svg>
              }
            />
            <Win7NavItem
              label="Videos"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                </svg>
              }
            />
          </Win7NavGroup>
          <Win7NavGroup title="Computer">
            <Win7NavItem
              label="Local Disk (C:)"
              active
              icon={
                <svg viewBox="0 0 24 24" fill="#aaa">
                  <rect x="2" y="8" width="20" height="8" rx="1" />
                </svg>
              }
            />
            <Win7NavItem
              label="Local Disk (D:)"
              icon={
                <svg viewBox="0 0 24 24" fill="#aaa">
                  <rect x="2" y="8" width="20" height="8" rx="1" />
                </svg>
              }
            />
          </Win7NavGroup>
        </div>

        {/* Right Content Pane */}
        <div className="flex-1 bg-white p-4 overflow-auto text-black">
          <div className="text-[#1e395b] font-semibold text-sm border-b border-[#e5f3fb] pb-1 mb-2">
            Hard Disk Drives (2)
          </div>
          <div className="flex flex-wrap gap-4 content-start mb-6">
            <Win7DriveTile
              letter="C"
              label="Local Disk"
              type="hard"
              space="78.9 GB"
              free="44.3 GB"
            />
            <Win7DriveTile
              letter="D"
              label="Local Disk"
              type="hard"
              space="69.9 GB"
              free="21.6 GB"
            />
          </div>

          <div className="text-[#1e395b] font-semibold text-sm border-b border-[#e5f3fb] pb-1 mb-2">
            Devices with Removable Storage (1)
          </div>
          <div className="flex flex-wrap gap-4 content-start">
            <Win7DriveTile letter="E" label="DVD RW Drive" type="cd" />
          </div>
        </div>
      </div>

      {/* Bottom Details Bar */}
      <div className="h-9.5 flex items-center px-4 bg-linear-to-r from-[#d9ebf9] to-[#cbe1f4] border-t border-[#b9d1ea] text-[#1e395b] gap-6">
        <div className="flex items-center gap-2 font-semibold">
          <svg viewBox="0 0 32 32" fill="#316ac5" className="w-5 h-5">
            <path d="M4 8h10l3 4h11v14H4V8z" />
          </svg>
          AUN-LAPTOP
        </div>
        <div className="flex flex-col text-[11px] text-[#555]">
          <span>Workgroup: WORKGROUP</span>
          <span>Processor: Intel(R) Pentium(R) Dua...</span>
        </div>
        <div className="flex flex-col text-[11px] text-[#555] ml-auto">
          <span>Memory: 2.00 GB</span>
        </div>
      </div>
    </div>
  );
}
