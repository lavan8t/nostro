"use client";

import React from "react";
import {
  XPToolbarButton,
  XPSeparator,
  XPTaskGroup,
  XPTaskItem,
  XPDriveTile,
} from "./WinXPElements";

export default function WinXPExplorer() {
  return (
    <div className="w-full h-full flex flex-col bg-[#ece9d8] font-['Tahoma',sans-serif] cursor-default select-none">
      <div className="flex items-center px-1 py-0.5 border-b border-[#d8d2bd] gap-1">
        <XPToolbarButton
          label="Back"
          hasDropdown
          icon={
            <div className="w-7 h-7 bg-[#4ca232] rounded-full flex items-center justify-center border border-[#3d8328] shadow-inner">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </div>
          }
        />
        <XPToolbarButton
          hasDropdown
          icon={
            <div className="w-7 h-7 bg-[#4ca232] rounded-full flex items-center justify-center border border-[#3d8328] shadow-inner opacity-50 grayscale">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" />
              </svg>
            </div>
          }
        />
        <XPToolbarButton
          icon={
            <svg
              viewBox="0 0 32 32"
              fill="currentColor"
              className="w-6 h-6 text-[#e8c14a]"
            >
              <path d="M4 8h10l3 4h11v14H4V8z" />
              <path d="M12 16h8v4h-8z" fill="#4ca232" />
              <path d="M16 10l-6 6h12z" fill="#4ca232" />
            </svg>
          }
        />
        <XPSeparator />
        <XPToolbarButton
          label="Search"
          icon={
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-[#316ac5]"
            >
              <circle cx="12" cy="12" r="8" fill="#fff" />
              <line x1="24" y1="24" x2="17.65" y2="17.65" strokeWidth="3" />
            </svg>
          }
        />
        <XPToolbarButton
          label="Folders"
          icon={
            <svg viewBox="0 0 32 32" fill="#e8c14a" className="w-6 h-6">
              <path d="M4 8h10l3 4h11v14H4V8z" />
            </svg>
          }
        />
        <XPSeparator />
        <XPToolbarButton
          hasDropdown
          icon={
            <svg viewBox="0 0 24 24" fill="#666" className="w-5 h-5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          }
        />
      </div>

      <div className="flex items-center px-2 py-1 border-b border-[#d8d2bd] gap-2 h-8">
        <span className="text-[11px] text-gray-600">Address</span>
        <div className="flex-1 flex items-center bg-white border border-[#7f9db9] h-5.5 px-1">
          <svg viewBox="0 0 32 32" fill="#316ac5" className="w-4 h-4 mr-1">
            <path d="M4 6h10l3 4h11v16H4V6z" />
          </svg>
          <span className="text-[11px] text-black flex-1">My Computer</span>
          <div className="w-4 h-full flex items-center justify-center hover:bg-[#ece9d8]">
            <svg width="6" height="4" viewBox="0 0 6 4" fill="black">
              <path d="M0 0h6L3 4z" />
            </svg>
          </div>
        </div>
        <button className="flex items-center gap-1 hover:bg-[#c1d2ee] px-1 rounded-sm border border-transparent hover:border-[#316ac5]">
          <div className="w-5 h-5 bg-[#4ca232] rounded-sm flex items-center justify-center border border-[#3d8328]">
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-[11px]">Go</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white">
        <div
          className="w-53.75 h-full overflow-y-auto p-3 border-r border-[#d8d2bd]"
          style={{
            background: "linear-gradient(180deg, #7ba2e7 0%, #638de4 100%)",
          }}
        >
          <XPTaskGroup title="System Tasks">
            <XPTaskItem
              label="View system information"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4m0-4h.01" />
                </svg>
              }
            />
            <XPTaskItem
              label="Add or remove programs"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              }
            />
            <XPTaskItem
              label="Change a setting"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              }
            />
          </XPTaskGroup>
          <XPTaskGroup title="Other Places">
            <XPTaskItem
              label="My Network Places"
              icon={
                <svg viewBox="0 0 24 24" fill="#4580c4">
                  <rect x="2" y="4" width="20" height="14" rx="2" />
                  <path d="M8 22h8m-4-4v4" stroke="#4580c4" strokeWidth="2" />
                </svg>
              }
            />
            <XPTaskItem
              label="My Documents"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                  <rect
                    x="7"
                    y="10"
                    width="10"
                    height="12"
                    fill="white"
                    stroke="#e8c14a"
                  />
                </svg>
              }
            />
            <XPTaskItem
              label="Shared Documents"
              icon={
                <svg viewBox="0 0 24 24" fill="#e8c14a">
                  <path d="M3 6h7l2 3h9v10H3V6z" />
                  <circle cx="12" cy="16" r="3" fill="white" />
                </svg>
              }
            />
            <XPTaskItem
              label="Control Panel"
              icon={
                <svg viewBox="0 0 24 24" fill="#316ac5">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="12" cy="12" r="3" fill="white" />
                </svg>
              }
            />
          </XPTaskGroup>
          <XPTaskGroup title="Details" expanded={false} />
        </div>

        <div className="flex-1 bg-white p-4 overflow-auto">
          <div className="flex flex-wrap gap-x-8 gap-y-4 content-start">
            <XPDriveTile letter="C" label="Local Disk" type="hard" />
            <XPDriveTile letter="D" label="Local Disk" type="hard" />
            <XPDriveTile letter="E" label="CD Drive" type="cd" />
          </div>
        </div>
      </div>
    </div>
  );
}
