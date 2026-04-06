"use client";

import React from "react";
import { useAppContext } from "../../state/AppContext";
import BaseTerminal from "./BaseTerminal";
import { TerminalTheme } from "./terminalTypes";

// ── Per-OS themes (stripped from each *Terminal.tsx) ────────────────────────

const win98Theme: TerminalTheme = {
  version: "win98",
  fontFamily: '"Courier New", Courier, monospace',
  fontSize: 13,
  bgColor: "#000000",
  textColor: "#c0c0c0",
  promptColor: "#c0c0c0",
  selectionBg: "#000080",
  cursorColor: "#c0c0c0",
  windowBg: "#c0c0c0",
  titleBarBg: "#000080",
  titleBarText: "#ffffff",
  titleText: "MS-DOS Prompt",
  promptPrefix: (cwd: string) => `${cwd}>`,
  versionString: "Microsoft Windows 98 [Version 4.10.1998]",
  startupLines: [
    "Microsoft(R) Windows 98",
    "   (C)Copyright Microsoft Corp 1981-1998.",
    "",
    "",
  ],
};

const winXPTheme: TerminalTheme = {
  version: "winxp",
  fontFamily: '"Lucida Console", "Courier New", monospace',
  fontSize: 13,
  bgColor: "#000000",
  textColor: "#c0c0c0",
  promptColor: "#c0c0c0",
  selectionBg: "#000080",
  cursorColor: "#c0c0c0",
  windowBg: "#ece9d8",
  titleBarBg: "#0a246a",
  titleBarText: "#ffffff",
  titleText: "C:\\WINDOWS\\System32\\cmd.exe",
  promptPrefix: (cwd: string) => `${cwd}>`,
  versionString: "Microsoft Windows XP [Version 5.1.2600]",
  startupLines: [
    "Microsoft Windows XP [Version 5.1.2600]",
    "(C) Copyright 1985-2001 Microsoft Corp.",
    "",
  ],
};

const win7Theme: TerminalTheme = {
  version: "win7",
  fontFamily: '"Consolas", "Lucida Console", monospace',
  fontSize: 14,
  bgColor: "#000000",
  textColor: "#c0c0c0",
  promptColor: "#c0c0c0",
  selectionBg: "#000080",
  cursorColor: "#c0c0c0",
  windowBg: "rgba(240,240,240,0.85)",
  titleBarBg: "rgba(200,220,240,0.7)",
  titleBarText: "#000000",
  titleText: "C:\\Windows\\system32\\cmd.exe",
  promptPrefix: (cwd: string) => `${cwd}>`,
  versionString: "Microsoft Windows [Version 6.1.7601]",
  startupLines: [
    "Microsoft Windows [Version 6.1.7601]",
    "Copyright (c) 2009 Microsoft Corporation.  All rights reserved.",
    "",
  ],
};

const win10Theme: TerminalTheme = {
  version: "win10",
  fontFamily: '"Cascadia Mono", "Cascadia Code", "Consolas", monospace',
  fontSize: 14,
  bgColor: "#012456",
  textColor: "#cccccc",
  promptColor: "#3a96dd",
  selectionBg: "#3a96dd",
  cursorColor: "#cccccc",
  windowBg: "#0c0c0c",
  titleBarBg: "#1c1c1c",
  titleBarText: "#cccccc",
  titleText: "Administrator: PowerShell",
  promptPrefix: (cwd: string) => `PS ${cwd}> `,
  versionString: "PowerShell 7.2.6",
  startupLines: [
    "PowerShell 7.2.6",
    "Copyright (c) Microsoft Corporation.",
    "",
    "https://aka.ms/powershell",
    "Type 'help' to get help.",
    "",
  ],
};

const themesByIndex: Record<number, TerminalTheme> = {
  0: win98Theme,
  1: winXPTheme,
  2: win7Theme,
  3: win10Theme,
};

// ── Component ────────────────────────────────────────────────────────────────

export default function TerminalApp({ winId }: { winId: string }) {
  const { state, dispatch } = useAppContext();
  const theme = themesByIndex[state.osIndex] ?? win10Theme;

  const handleClose = () => {
    dispatch({ type: "REMOVE_WINDOW", payload: winId });
  };

  const handleTitleChange = (newTitle: string) => {
    dispatch({ type: "UPDATE_WINDOW", payload: { id: winId, title: newTitle } });
  };

  const handleCrash = () => {
    dispatch({ type: "TRIGGER_BSOD" });
  };

  return (
    <BaseTerminal
      theme={theme}
      onClose={handleClose}
      onTitleChange={handleTitleChange}
      onCrash={handleCrash}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
