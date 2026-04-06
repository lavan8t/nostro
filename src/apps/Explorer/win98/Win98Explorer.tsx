"use client";

import React from "react";
import {
  Win98ToolbarButton,
  Win98Separator,
  Win98DriveIcon,
  Win98Icon,
} from "./Win98Elements";

export default function Win98Explorer() {
  return (
    <div className="w-full h-full flex flex-col bg-[var(--ButtonFace)] text-[var(--ButtonText)] font-[var(--os-font)] cursor-default select-none">
      <div className="flex items-center px-1 py-0.5 border-b border-[var(--ButtonShadow)] shadow-[0_1px_0_0_var(--ButtonHilight)] gap-0.5">
        <Win98ToolbarButton
          label="Back"
          disabled
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          }
        />
        <Win98ToolbarButton
          label="Forward"
          disabled
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" />
            </svg>
          }
        />
        <Win98ToolbarButton
          label="Up"
          icon={
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              <path d="M11 14v4h2v-4h3l-4-4-4 4h3z" fill="white" />
            </svg>
          }
        />
        <Win98Separator />
        <Win98ToolbarButton
          label="Cut"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 8l12 12M18 8L6 20M9 6a3 3 0 10-6 0 3 3 0 006 0zM21 6a3 3 0 10-6 0 3 3 0 006 0z" />
            </svg>
          }
        />
        <Win98ToolbarButton
          label="Copy"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          }
        />
        <Win98ToolbarButton
          label="Paste"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          }
        />
        <Win98ToolbarButton
          label="Undo"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
          }
        />
      </div>

      <div className="flex items-center px-1 py-1 border-b border-[var(--ButtonShadow)] shadow-[0_1px_0_0_var(--ButtonHilight)] gap-2">
        <span className="text-[11px] pl-1 text-[var(--GrayText)]">Address</span>
        <div className="flex-1 flex items-center bg-white border-t border-l border-[var(--ButtonShadow)] border-r border-b border-[var(--ButtonHilight)] shadow-[inset_1px_1px_0_0_var(--ButtonDkShadow),inset_-1px_-1px_0_0_var(--ButtonLight)] h-6 px-1">
          <div className="w-4 h-4 mr-1 text-blue-600">
            <svg viewBox="0 0 32 32" fill="currentColor">
              <path d="M4 6h10l3 4h11v16H4V6z" />
            </svg>
          </div>
          <span className="text-[11px] text-black flex-1">My Computer</span>
          <div className="w-4 h-full bg-(--ButtonFace) border border-(--ButtonHilight) border-r-(--ButtonDkShadow) border-b-[var(--ButtonDkShadow)] flex items-center justify-center">
            <svg width="6" height="4" viewBox="0 0 6 4" fill="currentColor">
              <path d="M0 0h6L3 4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 flex border-t border-l border-r border-b border-(--ButtonHilight) shadow-[inset_1px_1px_0_0_var(--ButtonDkShadow),inset_-1px_-1px_0_0_var(--ButtonLight)] overflow-hidden m-0.5 bg-white">
        <div className="w-55 bg-white flex flex-col p-4 border-r border-gray-300">
          <div className="w-12 h-12 mb-4 text-blue-800">
            <svg viewBox="0 0 32 32" fill="currentColor">
              <path d="M4 6h10l3 4h11v16H4V6z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-sans text-black leading-none mb-1">
            My
            <br />
            Computer
          </h1>
          <div
            className="w-full h-0.5 mb-4"
            style={{
              background:
                "linear-gradient(to right, #ff0000 0%, #ff0000 25%, #ffff00 25%, #ffff00 50%, #00ff00 50%, #00ff00 75%, #0000ff 75%, #0000ff 100%)",
            }}
          />
          <p className="text-[11px] text-black font-sans pr-4 leading-snug">
            Select an item to view its description.
          </p>
        </div>

        <div className="flex-1 bg-white p-2 overflow-auto">
          <div className="flex flex-wrap gap-4 content-start">
            <Win98DriveIcon letter="A" type="floppy" />
            <Win98DriveIcon letter="C" type="hard" />
            <Win98DriveIcon letter="D" type="cd" />
            <Win98Icon label="Printers" />
            <Win98Icon label="Control Panel" />
            <Win98Icon label="Dial-Up Networking" />
            <Win98Icon label="Scheduled Tasks" />
            <Win98Icon label="Web Folders" />
          </div>
        </div>
      </div>

      <div className="h-5 flex border-t border-(--ButtonShadow) shadow-[inset_0_1px_0_0_var(--ButtonHilight)] text-[11px]">
        <div className="flex-1 border-r border-(--ButtonShadow) shadow-[1px_0_0_0_var(--ButtonHilight)] flex items-center px-2 mx-0.5 my-0.5">
          8 object(s)
        </div>
        <div className="w-1/3 flex items-center px-2 shadow-[inset_1px_1px_0_0_var(--ButtonDkShadow),inset_-1px_-1px_0_0_var(--ButtonLight)] mx-0.5 my-0.5">
          <div className="w-3 h-3 mr-1 text-blue-600">
            <svg viewBox="0 0 32 32" fill="currentColor">
              <path d="M4 6h10l3 4h11v16H4V6z" />
            </svg>
          </div>
          My Computer
        </div>
      </div>
    </div>
  );
}
